import type { EntityCreateUpdate, EntityMetaData } from '../types/entities';
import { RichInput } from '../components/lib/Inputs/RichInput'
import { convertSuggestionDataToRender } from '../types/suggestion';
import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { enrichEntityFieldsMentions, simplerEntityFieldsMentions } from '../types/mention';
import { api } from '../utils/api';
import { ToggleSwitch } from '../components/lib/ToggleSwitch';
import ImageUpload from '../components/lib/ImageUpload';
import FoldableCategory from '../components/lib/FoldableCategory';
import { SelectInput } from '../components/lib/Inputs/SelectInput';
import { useAppSelector } from '../store';
import { selectAuthorization, selectPlayerInfo } from '../reducers/PlayerSlice';
import { selectCurrentGameInfo, selectCurrentGameSuggestions } from '../reducers/CurrentGameSlice';
import SubmitButton from '../components/lib/SubmitButton';
import LoadingLabel from '../components/lib/LoadingLabel';

interface EntityEditPageProps {
  metaData: EntityMetaData;
};

const EntityEditPage = <T extends EntityCreateUpdate>({ metaData }: EntityEditPageProps) => {
  const { id } = useParams();
  const newEntity = !id;
  const navigate = useNavigate();

  const auth = useAppSelector(selectAuthorization);
  const suggestionData = useAppSelector(selectCurrentGameSuggestions);
  const player = useAppSelector(selectPlayerInfo);
  const game = useAppSelector(selectCurrentGameInfo);
  
  const [entity, setEntity] = useState<T | null>(newEntity ? {} as T : null);
  const { data: pageData, loading, error } = useApi.get(`/${metaData.EntityType}/${id}`, auth, [], newEntity);
  const [hidden, setHidden] = useState<boolean>(entity && entity?.hidden || false);

  // Sync data to state
  useEffect(() => {
    if (pageData && pageData[metaData.EntityType] && suggestionData) {
      setEntity(simplerEntityFieldsMentions(pageData[metaData.EntityType], metaData, suggestionData));
      setHidden(pageData[metaData.EntityType].hiddenBy > 0)
    }
  }, [pageData, suggestionData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setEntity(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveEdited = async (editedEntity: T | null) => {
    if (!editedEntity || !suggestionData) return;

    var enrichedEntity = enrichEntityFieldsMentions(editedEntity, metaData, convertSuggestionDataToRender(suggestionData));
    enrichedEntity.hidden = hidden 

    const endpoint = `/${metaData.EntityType}`;
    const method = newEntity ? api.post : api.put;

    const { data, error } = await method<T>(endpoint, auth, enrichedEntity);
    if (!error) {
      navigate(data?.id ? `/${metaData.EntityType}/${data.id}` : `/${metaData.EntityType}`);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {loading ? (
        <LoadingLabel />
      ) : !newEntity && (error || !entity) ? (
        <p>Данные недоступны</p>
      ) : (<div className='flex flex-col'>
        { entity && metaData.Fields.map((field) => {
          if (field.EditType == 'input') {
              return (<InputField 
                        className="mb-4" 
                        label={field.FieldLabel} 
                        value={entity[field.FieldName as keyof typeof entity] as string} 
                        entityEdit={{ fieldName: field.FieldName, handleFieldChange }}
                      />);
          } else if (field.EditType == 'richInput') {
              return (<RichInput 
                        label='Описание' 
                        value={entity[field.FieldName as keyof typeof entity] as string} 
                        entityEdit={{ fieldName: field.FieldName, handleFieldChange }} 
                        suggestionData={convertSuggestionDataToRender(suggestionData)}
                      />);
          }
        })}

        {/* Entity specific fields */}
        {metaData.EntityType == 'location' && <>
          <div className='my-4'>
            <SelectInput  
              key={"locationedit_parentselect"}
              options={suggestionData.entities
                .filter((suggestion) => suggestion.type === 'location')
                .filter((suggestion) => suggestion.id !== entity?.id)
                .map((suggestion) => { return { key: suggestion.id, value: suggestion.name } })
                .sort((a, b) => a.value.localeCompare(b.value))} 
              label='Находится в' 
              setKey={entity && 'pid' in entity ? entity?.pid : 0} 
              entityEdit={{ fieldName: 'pid', handleFieldChange }} 
              nullable={true}/>
          </div>
        </>}

        {/* Image */}
        {id && <FoldableCategory title='Изображение' children={<ImageUpload entityType={metaData.EntityType} entityID={id} />} />}
        
        {/* // ** Change game proof by request instead of local storage ** // */}
        {player?.id === game?.gmID && <div className='py-2'>
          <ToggleSwitch 
            key={`toggle_sectert_post_${player?.id}`}
            label='Скрыть'
            labelPosition='right'
            setValue={hidden}
            entityEdit={{ handleFieldChange : (value) => setHidden(value) }}
          />
        </div>}

        <SubmitButton
          onClick={() => saveEdited(entity)}
          className='mt-6'  
        >
          {entity?.id ? "Применить" : "Создать"}
        </SubmitButton>
      </div>)}
    </div>
  );
};

export default EntityEditPage;
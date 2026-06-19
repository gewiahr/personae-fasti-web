import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { selectCurrentGameSuggestions, selectCurrentGameInfo } from '@/reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerExt } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import { simplerEntityFieldsMentions, enrichEntityFieldsMentions } from '@/types/mention';
import { convertSuggestionDataToRender } from '@/types/suggestion';
import { api } from '@/utils/api';
import FoldableCategory from '@lib/FoldableCategory';
import ImageUpload from '@lib/ImageUpload';
import { InputField } from '@lib/Inputs/InputField';
import { RichInput } from '@lib/Inputs/RichInput';
import { SelectInput } from '@lib/Inputs/SelectInput';
import LoadingLabel from '@lib/LoadingLabel';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { useEntityContext } from './EntityLayout';
import type { EntityMetaDataTypeMap } from '@/types/entities';

const EntityEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entityType, metaData } = useEntityContext();
   const newEntity = !id;

  type EntityModel = EntityMetaDataTypeMap[typeof entityType]['edit'];

  const auth = useAppSelector(selectAuthorization);
  const suggestionData = useAppSelector(selectCurrentGameSuggestions);
  const playerExt = useAppSelector(selectPlayerExt);
  const game = useAppSelector(selectCurrentGameInfo);
  
  const [entity, setEntity] = useState<EntityModel | null>(newEntity ? {} as EntityModel : null);
  const { data: pageData, loading, error } = useApi.get(`/${metaData.EntityType}/${id}`, auth, [], newEntity);
  const [hidden, setHidden] = useState<boolean>(entity && entity?.hidden || false);

  // Sync data to state
  useEffect(() => {
    if (pageData && pageData[metaData.EntityType] && suggestionData) {
      setEntity(simplerEntityFieldsMentions(pageData[metaData.EntityType], metaData, suggestionData));
      setHidden(pageData[metaData.EntityType].hidden)
    }
  }, [pageData, suggestionData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setEntity(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveEdited = async (editedEntity: EntityModel | null) => {
    if (!editedEntity || !suggestionData) return;

    var enrichedEntity = enrichEntityFieldsMentions(editedEntity, metaData, convertSuggestionDataToRender(suggestionData));
    enrichedEntity.hidden = hidden 

    const endpoint = `/${metaData.EntityType}`;
    const method = newEntity ? api.post : api.put;

    const { data, error } = await method<EntityModel>(endpoint, auth, enrichedEntity);
    if (!error) {
      navigate(data?.id ? `/${metaData.EntityTypePl}/${data.id}` : `/${metaData.EntityTypePl}`);
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
        {playerExt === game?.gmExt && <div className='py-2'>
          <ToggleSwitch 
            key={`toggle_sectert_post_${playerExt}`}
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
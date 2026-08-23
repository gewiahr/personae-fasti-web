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
  const { ext } = useParams();
  const navigate = useNavigate();
  const { entityType, metaData } = useEntityContext();
   const newEntity = !ext;

  type EntityModel = EntityMetaDataTypeMap[typeof entityType]['edit'];

  const auth = useAppSelector(selectAuthorization);
  const suggestionData = useAppSelector(selectCurrentGameSuggestions);
  const playerExt = useAppSelector(selectPlayerExt);
  const game = useAppSelector(selectCurrentGameInfo);
  
  const [entity, setEntity] = useState<EntityModel | null>(newEntity ? {} as EntityModel : null);
  const { data: pageData, loading, error } = useApi.get(`/${metaData.EntityType}/${ext}`, auth, [], newEntity);
  const [hidden, setHidden] = useState<boolean>(entity && entity?.hidden || false);

  const parentLocationOptions = suggestionData.entities
    .filter((suggestion) => suggestion.type === 'location' && !suggestion.secret)
    .filter((suggestion) => suggestion.ext !== entity?.ext)
    .map((suggestion) => ({ key: suggestion.ext, value: suggestion.name }))
    .sort((a, b) => a.value.localeCompare(b.value));

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

    const { data, error } = await method<Record<string, EntityModel>>(endpoint, auth, enrichedEntity);
    if (!error) {
      const savedEntity = data?.[metaData.EntityType];
      navigate(savedEntity?.ext ? `/${metaData.EntityTypePl}/${savedEntity.ext}` : `/${metaData.EntityTypePl}`);
    }
  };

  return (
    <div className='layout-page'>
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
        {metaData.EntityType == 'location' && parentLocationOptions.length > 0 && <>
          <div className='my-4'>
            <SelectInput  
              key={"locationedit_parentselect"}
              options={parentLocationOptions}
              label='Находится в' 
              setKey={entity && 'parentExt' in entity ? entity.parentExt : ''}
              entityEdit={{ fieldName: 'parentExt', handleFieldChange }}
              nullable={true}/>
          </div>
        </>}

        {/* Image */}
        {ext && <FoldableCategory title='Изображение' children={<ImageUpload entityType={metaData.EntityType} entityID={ext} />} />}
        
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
          {entity?.ext ? "Применить" : "Создать"}
        </SubmitButton>
      </div>)}
    </div>
  );
};

export default EntityEditPage;

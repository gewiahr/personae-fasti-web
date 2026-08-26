import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '@/hooks/useApi';
import { selectCurrentGameSuggestions, selectCurrentGameInfo } from '@/reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerExt } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import { convertSuggestionDataToRender } from '@/types/suggestion';
import { api } from '@/utils/api';
import FoldableCategory from '@lib/FoldableCategory';
import ImageUpload from '@lib/ImageUpload';
import { InputField } from '@lib/Inputs/InputField';
import { MarkdownInput } from '@lib/Inputs/MarkdownInput';
import { SelectInput } from '@lib/Inputs/SelectInput';
import LoadingLabel from '@lib/LoadingLabel';
import SubmitButton from '@lib/SubmitButton';
import { ToggleSwitch } from '@lib/ToggleSwitch';
import { useEntityContext } from './EntityLayout';
import type { EntityMetaDataTypeMap } from '@/types/entities';
import { useNotifications } from '@/context/NotificationContext';
import { ENTITY_FIELD_LIMITS, validateEntityFields, type ValidationErrors } from '@/utils/validation';

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
  const { addNotification } = useNotifications();
  
  const [entity, setEntity] = useState<EntityModel | null>(newEntity ? {} as EntityModel : null);
  const { data: pageData, loading, error } = useApi.get(`/${metaData.EntityType}/${ext}`, auth, [], newEntity);
  const [hidden, setHidden] = useState<boolean>(entity && entity?.hidden || false);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const parentLocationOptions = suggestionData.entities
    .filter((suggestion) => suggestion.type === 'location' && !suggestion.secret)
    .filter((suggestion) => suggestion.ext !== entity?.ext)
    .map((suggestion) => ({ key: suggestion.ext, value: suggestion.name }))
    .sort((a, b) => a.value.localeCompare(b.value));

  // Sync data to state
  useEffect(() => {
    if (pageData && pageData[metaData.EntityType] && suggestionData) {
      setEntity(pageData[metaData.EntityType]);
      setHidden(pageData[metaData.EntityType].hidden)
    }
  }, [pageData, suggestionData, metaData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    const nextEntity = entity ? { ...entity, [field]: value } : null;
    setEntity(nextEntity);

    if (validationErrors[field] && nextEntity) {
      const nextError = validateEntityFields(nextEntity)[field];
      setValidationErrors((previous) => {
        const next = { ...previous };
        if (nextError) next[field] = nextError;
        else delete next[field];
        return next;
      });
    }
  };

  const saveEdited = async (editedEntity: EntityModel | null) => {
    if (!editedEntity || !suggestionData) return;

    const normalizedEntity = {
      ...editedEntity,
      name: editedEntity.name?.trim() ?? '',
      title: editedEntity.title?.trim() ?? '',
    };
    const errors = validateEntityFields(normalizedEntity);
    if (Object.keys(errors).length > 0) {
      setEntity(normalizedEntity);
      setValidationErrors(errors);
      addNotification(errors.description ?? 'Исправьте ошибки в форме', 'error');
      return;
    }

    normalizedEntity.hidden = hidden

    const endpoint = `/${metaData.EntityType}`;
    const method = newEntity ? api.post : api.put;

    const { data, error: saveError } = await method<Record<string, EntityModel>>(endpoint, auth, normalizedEntity);
    if (saveError?.data?.fields) {
      setValidationErrors(saveError.data.fields);
      addNotification(saveError.data.fields.description ?? 'Исправьте ошибки в форме', 'error');
    } else if (saveError) {
      addNotification(saveError.message, 'error');
    } else {
      setValidationErrors({});
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
                        key={`entityedit-${field.FieldName}`}
                        className="mb-4" 
                        label={field.FieldLabel} 
                        value={entity[field.FieldName as keyof typeof entity] as string} 
                        entityEdit={{ fieldName: field.FieldName, handleFieldChange }}
                        maxLength={field.FieldName === 'name' ? ENTITY_FIELD_LIMITS.name : ENTITY_FIELD_LIMITS.title}
                        error={validationErrors[field.FieldName]}
                      />);
          } else if (field.EditType == 'markdownInput') {
              return (<MarkdownInput
                        key={`entityedit-${field.FieldName}`}
                        label='Описание' 
                        value={entity[field.FieldName as keyof typeof entity] as string} 
                        entityEdit={{ fieldName: field.FieldName, handleFieldChange }} 
                        suggestionData={convertSuggestionDataToRender(suggestionData)}
                        error={validationErrors[field.FieldName]}
                      />);
          }
        })}

        {/* Entity specific fields */}
        {entityType == 'locations' && parentLocationOptions.length > 0 && <>
          <div className='my-4'>
            <SelectInput  
              key={"locationedit_parentselect"}
              options={parentLocationOptions}
              label='Находится в' 
              setKey={entity && 'parentExt' in entity ? entity.parentExt : ''}
              entityEdit={{ fieldName: 'parentExt', handleFieldChange }}
              error={validationErrors.parentExt}
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

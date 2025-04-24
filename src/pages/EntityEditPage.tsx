import { Entity, EntityMetaData } from '../types/entities'
import { RichInput } from '../components/RichInput'
import { SuggestionData } from '../types/suggestion';
import { useEffect, useState } from 'react';
import { InputField } from '../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { enrichEntityFieldsMentions, simplerEntityFieldsMentions } from '../types/mention';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';


interface EntityEditPageProps {
  metaData: EntityMetaData;
};

const EntityEditPage = <T extends Entity>({ metaData }: EntityEditPageProps) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessKey } = useAuth();

  const newEntity = !id;
  
  const [entity, setEntity] = useState<T | null>(newEntity ? {} as T : null);
  const { data: pageData } = useApi.get(`/${metaData.EntityType}/${id}`, accessKey, [], newEntity);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  // Sync data to state
  useEffect(() => {
    if (pageData && pageData[metaData.EntityType] && suggestionData) {
      setEntity(simplerEntityFieldsMentions(pageData[metaData.EntityType], metaData, suggestionData));
    }
  }, [pageData, suggestionData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setEntity(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveEdited = async (editedEntity: T | null) => {
    if (!editedEntity || !suggestionData) return;

    const enrichedEntity = enrichEntityFieldsMentions(editedEntity, metaData, suggestionData);
    
    const endpoint = `/${metaData.EntityType}`;
    const method = newEntity ? api.post : api.put;

    const { data, error } = await method<T>(endpoint, accessKey, enrichedEntity);
    if (!error) {
      navigate(data?.id ? `/${metaData.EntityType}/${data.id}` : `/${metaData.EntityType}`);
    }
  };

  if (!newEntity && !entity || !suggestionData) {
    return <div>Загрузка...</div>; // Or skeleton UI
  }

  return (
    <div className='flex flex-col'>
      <InputField 
        className="mb-4" 
        label='Имя' 
        setValue={entity?.name} 
        entityEdit={{ fieldName: 'name', handleFieldChange }}
      />
      <InputField 
        className="mb-4" 
        label='Титул' 
        setValue={entity?.title} 
        entityEdit={{ fieldName: 'title', handleFieldChange }}
      />
      <RichInput 
        label='Описание' 
        setValue={entity?.description} 
        entityEdit={{ fieldName: 'description', handleFieldChange }} 
        fullSuggestionData={suggestionData}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white mt-6 py-2 px-4 rounded"
        onClick={() => saveEdited(entity)}
      >
        {entity?.id ? "Применить" : "Создать"}
      </button>
    </div>
  );
};

export default EntityEditPage;
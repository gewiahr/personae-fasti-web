import { useNavigate, useParams } from 'react-router-dom';
import { Entity, EntityMetaData } from '../types/entities';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
//import { CharPageData, EntityPageData } from '../types/request';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import RichText from '../components/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { useRecords } from '../hooks/useRecords';

interface EntityPageProp {
  metaData: EntityMetaData;
}

export const EntityPage = <T extends Entity>({ metaData } : EntityPageProp) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const newEntity = id ? false : true;

  const [entity, setEntity] = useState<T>({} as T);

  const { accessKey } = useAuth();
  const { data, loading, error } = useApi.get(`/${metaData.EntityType}/${id}`, accessKey, [], newEntity);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  // ** change to valid player request ** //
  const { players } = useRecords();

  useEffect(() => {
    if (data) {
      setEntity(data[metaData.EntityType]);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/${metaData.EntityType}/${id}/edit`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {loading ? (
        <p>Данные загружаются...</p>
      ) : error || !entity ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className="text-2xl font-bold">{entity.name}</h1>
              <h3 className="text-m text-gray-400 mb-4">{entity?.title}</h3>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white mb-6 py-2 px-4 w-[25%] rounded"
              onClick={openEditing}
            >
              {"Изменить"}
            </button>
          </div>
          <RichText text={entity.description || ""}/>

          {/* ++ Change to universal feed ++ */}
          {data.records && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={1000} players={players} records={data.records} suggestionData={suggestionData} />
          </div>}         
        </>)
      }
    </div>
  );
};

export default EntityPage;
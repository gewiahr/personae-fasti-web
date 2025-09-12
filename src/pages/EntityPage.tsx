import { useNavigate, useParams } from 'react-router-dom';
import { Entity, EntityMetaData } from '../types/entities';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import RichText from '../components/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { useRecords } from '../hooks/useRecords';
import useImage from '../hooks/useImage';
import { LoadingPage } from './LoadingPage';
import { ErrorPage } from './ErrorPage';
import Hyperlink from '../components/Hyperlink';
import { EntityInfo } from '../types/request';

interface EntityPageProp {
  metaData: EntityMetaData;
}

export const EntityPage = <T extends Entity>({ metaData } : EntityPageProp) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const newEntity = id ? false : true;
  
  const { image, ratio } = useImage({entityType: metaData.EntityType, entityID: id || ""});

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
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <LoadingPage />
      ) : error || !entity ? (
        <ErrorPage error={error} entityMeta={metaData}/>
      ) : (
        <>
          {image && <div className='relative pb-4 rounded-lg'>
            <img className='w-full rounded-lg border border-gray-700 bg-gray-800 object-cover' src={image?.url}></img>
            {image && ratio <= 1 && <div className="absolute bottom-2 left-0 right-0 bg-slate-900/60 px-4 py-2 pb-4">
              <h1 className="text-xl font-bold">{entity.name}</h1>
              <h3 className="text-sm text-gray-400 italic">{entity?.title}</h3>
            </div>}
          </div>}
          <div className='flex justify-between pb-4'>
            {(image && ratio > 1 || !image) && 
            <div>
              <h1 className="text-2xl font-bold">{entity.name}</h1>
              <h3 className="text-m text-gray-400 mb-4 italic">{entity?.title}</h3>           
            </div>}
            <div className={`mb-6 ${(image && ratio > 1 || !image) ? "w-[30%]" : "w-[100%]"}`}>
              <button
                className={`flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded ${(image && ratio > 1 || !image) ? "w-full" : ""}`}
                onClick={openEditing}
              >
                {"Изменить"}
              </button>
            </div>           
          </div>
          <RichText text={entity.description || ""} fullWidth={true}/> 

          {/* Entity specific fields */}
          {metaData.EntityType == "location" && (data.parent != null || data.includes.length > 0) && <>
            <div className='mt-6'>
              {data.parent != null && <>
                <p>
                  Находится в <Hyperlink key={metaData.EntityType + data.parent.id} id={data.parent.id} type={metaData.EntityType} mentionText={data.parent.name}/>.
                </p>
              </>}
              {data.includes.length > 0 && <>
                <p>
                  В {entity.name} наход{data.includes.length > 1 ? "ятся" : "ится"} {data.includes.map((el : EntityInfo, i : number) => (<Hyperlink key={metaData.EntityType + el.id} id={'' + el.id} type={metaData.EntityType} mentionText={i === 0 ? `${el.name}` : `, ${el.name}`}/>))}.
                </p>
              </>}
            </div>
          </>}             

          {/* ++ Change to universal feed ++ */}
          {data.records && data.records.length > 0 && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={1000} players={players} records={data.records} suggestionData={suggestionData} />
          </div>}         
        </>)
      }
    </div>
  );
};

export default EntityPage;
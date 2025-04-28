import { useNavigate, useParams } from 'react-router-dom';
import { Char } from '../types/entities';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { CharPageData } from '../types/request';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import RichText from '../components/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { useRecords } from '../hooks/useRecords';

export const CharPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newChar] = useState<boolean>(id ? false : true);

  const [char, setChar] = useState<Char>({} as Char);

  const { accessKey } = useAuth();
  const { data, loading, error } = useApi.get<CharPageData>(`/char/${id}`, accessKey, [], newChar);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  // ** change to valid player request ** //
  const { players } = useRecords();

  useEffect(() => {
    if (data) {
      console.log(data);
      setChar(data.char);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/char/${id}/edit`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {loading ? (
        <p>Данные загружаются...</p>
      ) : error || !char ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className="text-2xl font-bold">{char.name}</h1>
              <h3 className="text-m text-gray-400 mb-4">{char.title}</h3>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white mb-6 py-2 px-4 w-[25%] rounded"
              onClick={openEditing}
            >
              {"Изменить"}
            </button>
          </div>
          <RichText text={char.description || ""}/>

          {/* ++ Change to universal feed ++ */}
          {data && data.records && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={1000} players={players} records={data.records} suggestionData={suggestionData} />
          </div>}
        </>)
      }
    </div>
  );
};
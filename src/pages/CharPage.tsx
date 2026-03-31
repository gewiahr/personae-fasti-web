import { useNavigate, useParams } from 'react-router-dom';
import type { Char } from '../types/entities';
import { useApi } from '../hooks/useApi';
import type { CharPageData } from '../types/request';
import { useEffect, useState } from 'react';
import RichText from '../components/lib/RichText/RichText';
import { RecordFeed } from '../components/RecordFeed';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import LoadingLabel from '../components/lib/LoadingLabel';
import SubmitButton from '../components/lib/SubmitButton';

export const CharPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newChar] = useState<boolean>(id ? false : true);

  const [char, setChar] = useState<Char>({} as Char);

  const auth = useAppSelector(selectAuthorization);

  const { data, loading, error } = useApi.get<CharPageData>(`/char/${id}`, auth, [], newChar);

  useEffect(() => {
    if (data) {
      setChar(data.char);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/char/${id}/edit`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {loading ? (
        <LoadingLabel />
      ) : error || !char ? (
        <p>Данные недоступны</p>
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className="text-2xl font-bold">{char.name}</h1>
              <h3 className="text-md text-gray-400 mb-4">{char.title}</h3>
            </div>
            <SubmitButton 
              onClick={openEditing}
              className='w-[25%] mb-6'
            >
              {"Изменить"}
            </SubmitButton>
          </div>
          <RichText key={`charpage_richtext-${id ?? "newchar"}`} text={char.description || ""} uid={`charpage-${id ?? "newchar"}`}/>

          {/* ++ Change to universal feed ++ */}
          {data && data.records && <div className=''>
            <h2 className='text-right text-xl text-bold pt-8 pb-2'>Упоминания</h2>
            <RecordFeed key={`charpage_recordsfeed`} records={data.records} />
          </div>}
        </>)
      }
    </div>
  );
};
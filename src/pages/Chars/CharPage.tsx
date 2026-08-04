import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { RecordFeed } from '@/pages/Records/RecordFeed';
import { useApi } from '@/hooks/useApi';
import { selectAuthorization } from '@/reducers/PlayerSlice';
import { useAppSelector } from '@/store';
import type { Char } from '@/types/entities';
import type { CharPageData } from '@/types/request';
import LoadingLabel from '@lib/LoadingLabel';
import RichText from '@lib/RichText/RichText';
import SubmitButton from '@lib/SubmitButton';

export const CharPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newChar] = useState<boolean>(id ? false : true);

  const [char, setChar] = useState<Char>({} as Char);

  const auth = useAppSelector(selectAuthorization);

  const { data, loading, error } = useApi.get<CharPageData>(`/chars/${id}`, auth, [], newChar);

  useEffect(() => {
    if (data) {
      setChar(data.char);
    };
  }, [data]);

  const openEditing = () => {
    navigate(`/chars/${id}/edit`);
  };

  return (
    <div className="layout-page">
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
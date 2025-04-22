import { useNavigate, useParams } from 'react-router-dom';
import { Char, CharMetaData } from '../types/entities';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { CharPageData } from '../types/request';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import CharPageEdit from './blocks/CharPageEdit';
import { api } from '../utils/api';
import { enrichMentionInput } from '../types/mention';
import RichText from '../components/RichText';

export const CharPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [newChar] = useState<boolean>(id ? false : true);

  const [editing, setEditing] = useState<boolean>(false);
  const [char, setChar] = useState<Char>({} as Char);

  const { accessKey } = useAuth();
  const { data, loading, error, refetch } = useApi.get<CharPageData>(`/char/${id}`, accessKey, [], newChar);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  useEffect(() => {
    if (data) {
      console.log(data);
      setChar(data.char);
    };
  }, [data]);

  const openEditing = () => {
    setEditing(true);
  };

  const saveEdited = async (editedChar: Char) => {
    // Enrich fields with rich input
    CharMetaData.RichInputFields.forEach((field) => {
      if (editedChar?.[field as keyof typeof editedChar]) {
        editedChar = {
          ...editedChar,
          [field]: enrichMentionInput(`${editedChar?.[field as keyof typeof editedChar]}`, suggestionData?.entities || [])
        };
      };
    });

    if (newChar) {
      const { data, error } = await api.post<Char>('/char', accessKey, editedChar);
      if (error) {
        console.log(error);
      } else {
        navigate(data?.id ? `/char/${data?.id}` : `/chars`);
        navigate(0);
        console.log(data);
      }
    } else {
      const { error } = await api.put<Char>('/char', accessKey, editedChar);
      if (error) {
        console.log(error);
      } else {
        refetch();
        setEditing(false);
      }
    }
  };

  if (newChar) {
    return (
      <CharPageEdit char={{} as Char} onSubmit={saveEdited} suggestionData={suggestionData || {} as SuggestionData} />
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {loading ? (
        <p>Данные загружаются...</p>
      ) : error ? (
        <p>Данные недоступны</p>

        // Edit Form
      ) : editing && char ? (
        <CharPageEdit char={char} onSubmit={saveEdited} suggestionData={suggestionData || {} as SuggestionData} />

        // View Form
      ) : (
        <>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className="text-2xl font-bold">{char?.name}</h1>
              <h3 className="text-m text-gray-400 mb-4">{char?.title}</h3>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white mb-6 py-2 px-4 w-[25%] rounded"
              onClick={openEditing}
            >
              {"Изменить"}
            </button>
          </div>
          <RichText text={char?.description || ""} suggestionData={suggestionData || {} as SuggestionData}/>
        </>)
      }
    </div>
  );
};
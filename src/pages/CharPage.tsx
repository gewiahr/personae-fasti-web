import { useNavigate, useParams } from 'react-router-dom';
import { Char } from '../types/entities';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../hooks/useAuth';
import { CharPageData } from '../types/request';
import { useEffect, useState } from 'react';
import { SuggestionData } from '../types/suggestion';
import CharPageEdit from './blocks/CharPageEdit';
import { api } from '../utils/api';

export const CharPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ newChar ] = useState<boolean>(id ? false : true);
  
  const [ editing, setEditing ] = useState<boolean>(false);
  const [ char, setChar ] = useState<Char>({} as Char);
  
  const { accessKey } = useAuth();
  const { data, loading, error, refetch } = useApi.get<CharPageData>(`/char/${id}`, accessKey, [], newChar);


  useEffect(() => {
    if (data) {
      console.log(data);
      setChar(data.char);
    };
  }, [data]);

  const openEditing = () => {
    setEditing(true);
  };

  const saveEdited = async (editedChar : Char) => {
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

  const mockSuggestionData : SuggestionData = {
		entities: [
			{ 
				id: 1,
				sid: "p:1",
				type: "p",
				typeName: "person",
				ref: "AkodoToturi",
				name: "Akodo Toturi"
			},
			{ 
				id: 2,
				sid: "p:2",
				type: "p",
				typeName: "person",
				ref: "DojiHotaru",
				name: "Doji Hotaru"
			},
			{ 
				id: 3,
				sid: "p:3",
				type: "p",
				typeName: "person",
				ref: "IsawaKaede",
				name: "Isawa Kaede"
			},
			{ 
				id: 4,
				sid: "p:4",
				type: "p",
				typeName: "person",
				ref: "MirumotoDaini",
				name: "Mirumoto Daini"
			},
		]
	}

  if (newChar) {
    //setChar();
    return (
      <CharPageEdit char={{} as Char} onSubmit={saveEdited} suggestionData={mockSuggestionData} />
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
          <CharPageEdit char={char} onSubmit={saveEdited} suggestionData={mockSuggestionData} />          

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
            <div>
              <p className="text-m mt-4">{data?.char.description}</p>
            </div> 
          </>)
      }
    </div>
  );
};
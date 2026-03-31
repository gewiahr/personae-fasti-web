import type { Char } from '../types/entities';
import { RichInput } from '../components/lib/Inputs/RichInput'
import { convertSuggestionDataToRender } from '../types/suggestion';
import { useEffect, useState } from 'react';
import { InputField } from '../components/lib/Inputs/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import type { CharPageData } from '../types/request';
import { useApi } from '../hooks/useApi';
import { enrichCharFieldsMentions, simplerCharFieldsMentions } from '../types/mention';
import { api } from '../utils/api';
import { useAppSelector } from '../store';
import { selectAuthorization } from '../reducers/PlayerSlice';
import LoadingLabel from '../components/lib/LoadingLabel';
import { selectCurrentGameSuggestions } from '../reducers/CurrentGameSlice';
import SubmitButton from '../components/lib/SubmitButton';


const CharEditPage = () => {
  const { id } = useParams();
  const newChar = !id;
  const navigate = useNavigate();
  
  const [char, setChar] = useState<Char | null>(newChar ? {} as Char : null);

  const auth = useAppSelector(selectAuthorization);
  const suggestionData = useAppSelector(selectCurrentGameSuggestions);
  
  const { data: apiData, loading, error } = useApi.get<CharPageData>(`/char/${id}`, auth, [], newChar);

  useEffect(() => {
    if (apiData?.char && suggestionData) {
      setChar(simplerCharFieldsMentions(apiData.char, suggestionData));
    }
  }, [apiData, suggestionData]);

  const handleFieldChange = (value: string, field?: string) => {
    if (!field) return
    setChar(prev => prev ? { ...prev, [field]: value } : null);
  };

  const saveEdited = async (editedChar: Char | null) => {
    if (!editedChar || !suggestionData) return;

    const enrichedChar = enrichCharFieldsMentions(editedChar, convertSuggestionDataToRender(suggestionData));
    
    const endpoint = '/char'; //newChar ? '/char' : `/char/${id}`;
    const method = newChar ? api.post : api.put;

    const { data, error } = await method<Char>(endpoint, auth, enrichedChar);
    if (!error) {
      navigate(data?.id ? `/char/${data.id}` : '/chars');
    }
  };

  // if (!newChar && !char || !suggestionData) {
  //   return <div>Loading...</div>; 
  // }

  return (
    <div className='max-w-4xl mx-auto p-4'>
      {loading ? (
        <LoadingLabel />
      ) : !newChar && (error || !char) ? (
        <p>Данные недоступны</p>
      ) : (<div className='flex flex-col'>
        <InputField 
          className="mb-4" 
          label='Имя' 
          value={char?.name} 
          entityEdit={{ fieldName: 'name', handleFieldChange }}
        />
        <InputField 
          className="mb-4" 
          label='Титул' 
          value={char?.title} 
          entityEdit={{ fieldName: 'title', handleFieldChange }}
        />
        <RichInput 
          label='Описание' 
          value={char?.description} 
          entityEdit={{ fieldName: 'description', handleFieldChange }} 
          suggestionData={convertSuggestionDataToRender(suggestionData)}
        />
        {/* <SelectInput
          label='Выбор'
          entityEdit={{ fieldName: 'title', handleFieldChange }}
          options={["1", "2", "3"]}
          value={char?.title}
          key={123123}
        /> */}
        <SubmitButton 
          onClick={() => saveEdited(char)}
          className='mt-6'
        >
          {char?.id ? "Применить" : "Создать"}  
        </SubmitButton>
      </div>)}
    </div>  
  );
};

export default CharEditPage;
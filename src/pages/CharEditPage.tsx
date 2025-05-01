import { Char } from '../types/entities'
import { RichInput } from '../components/RichInput'
import { SuggestionData } from '../types/suggestion';
import { useEffect, useState } from 'react';
import { InputField } from '../components/InputField';
import { useNavigate, useParams } from 'react-router-dom';
import { CharPageData } from '../types/request';
import { useApi } from '../hooks/useApi';
import { enrichCharFieldsMentions, simplerCharFieldsMentions } from '../types/mention';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';
//import { SelectInput } from '../components/SelectInput';


const CharEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessKey } = useAuth();

  // Derived state
  const newChar = !id;
  
  // Simplified state
  const [char, setChar] = useState<Char | null>(newChar ? {} as Char : null);
  
  // API calls
  const { data: apiData } = useApi.get<CharPageData>(`/char/${id}`, accessKey, [], newChar);
  const { data: suggestionData } = useApi.get<SuggestionData>(`/suggestions`, accessKey);

  // Sync data to state
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

    const enrichedChar = enrichCharFieldsMentions(editedChar, suggestionData);
    
    const endpoint = '/char';//newChar ? '/char' : `/char/${id}`;
    const method = newChar ? api.post : api.put;

    const { data, error } = await method<Char>(endpoint, accessKey, enrichedChar);
    if (!error) {
      navigate(data?.id ? `/char/${data.id}` : '/chars');
    }
  };

  if (!newChar && !char || !suggestionData) {
    return <div>Loading...</div>; // Or skeleton UI
  }

  return (
    <div className='flex flex-col'>
      <InputField 
        className="mb-4" 
        label='Имя' 
        setValue={char?.name} 
        entityEdit={{ fieldName: 'name', handleFieldChange }}
      />
      <InputField 
        className="mb-4" 
        label='Титул' 
        setValue={char?.title} 
        entityEdit={{ fieldName: 'title', handleFieldChange }}
      />
      <RichInput 
        label='Описание' 
        setValue={char?.description} 
        entityEdit={{ fieldName: 'description', handleFieldChange }} 
        fullSuggestionData={suggestionData}
      />
      {/* <SelectInput
        label='Выбор'
        entityEdit={{ fieldName: 'title', handleFieldChange }}
        options={["1", "2", "3"]}
        value={char?.title}
        key={123123}
      /> */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white mt-6 py-2 px-4 rounded"
        onClick={() => saveEdited(char)}
      >
        {char?.id ? "Применить" : "Создать"}
      </button>
    </div>
  );
};

export default CharEditPage;
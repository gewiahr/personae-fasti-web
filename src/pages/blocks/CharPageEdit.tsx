import { Char } from '../../types/entities'
//import { InputField } from '../../components/InputField'
import { RichInput } from '../../components/RichInput'
import { SuggestionData } from '../../types/suggestion';
import { useState } from 'react';
import { InputField } from '../../components/InputField';

type CharPageEditProp = {
  char: Char;
  suggestionData: SuggestionData
  onSubmit: (editedChar: Char) => void;
};

const CharPageEdit = ({ char, suggestionData, onSubmit } : CharPageEditProp) => {
  const [ editChar, setEditChar ] = useState<Char>(char);

  const handleFieldChange = (field: string, value: string) => {
    if (!editChar) return;

    setEditChar({
      ...editChar,
      [field]: value
    });
    console.log(`${field} changed to ${value}`);
  };

  const onClickApplyChanges = () => {
    onSubmit(editChar);
    console.log(char)
  };

  return (
    <div className='flex flex-col'>
      <InputField className="mb-4" label='Имя' setValue={editChar.name} entityEdit={{ fieldName: 'name', handleFieldChange }}/>
      <InputField className="mb-4" label='Титул' setValue={editChar.title} entityEdit={{ fieldName: 'title', handleFieldChange }} />
      {/* {<InputField className="mb-4" label='Описание' initValue={char?.description}/>} */}
      {/* <RichInput label='Имя' setValue={editChar.name} entityEdit={{ fieldName: 'name', handleOnChange: handleFieldChange }} fullSuggestionData={suggestionData} /> */}
      {/* <RichInput label='Титул' setValue={editChar.title} entityEdit={{ fieldName: 'title', handleOnChange: handleFieldChange }} fullSuggestionData={suggestionData} /> */}
      <RichInput label='Описание' setValue={editChar.description} entityEdit={{ fieldName: 'description', handleFieldChange }} fullSuggestionData={suggestionData} />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white mt-6 py-2 px-4 rounded"
        onClick={onClickApplyChanges}
      >
        {editChar?.id ? "Применить" : "Создать"}
      </button>
    </div>
  )
}

export default CharPageEdit

import { useEffect, useState } from 'react';
import { RichInput } from './lib/Inputs/RichInput';
import { enrichMentionInput } from '../types/mention';
import { ToggleSwitch } from './lib/ToggleSwitch';
import { SelectInput } from './lib/Inputs/SelectInput';
import Icon from './icons/Icon';
import { useAppDispatch, useAppSelector } from '../store';
import { postNewRecord, selectCurrentGame } from '../reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerInfo } from '../reducers/PlayerSlice';
import { convertSuggestionDataToRender } from '../types/suggestion';

type RecordInputProps = {

};

export const RecordInput: React.FC<RecordInputProps> = () => {
  const [input, setInput] = useState<string>('');
  const [questID, setQuestID] = useState<number>(0);
  
  const [postHidden, setPostHidden] = useState<boolean>(false);
  const [richInputKey, setRichInputKey] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [postSettingsOpen, setPostSettingsOpen] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuthorization);
  const { game, quests, suggestions } = useAppSelector(selectCurrentGame);
  const player = useAppSelector(selectPlayerInfo);

  const showPostSettings = (quests && quests.length > 0) || (player?.id === game?.gmID);


  useEffect(() => {
  
  }, [suggestions]);

  const handleSubmit = () => {
    if (input.trim() === '' || !suggestions) return;
    console.log(game);
    console.log(player);
    if (!game || !player) return;
    setIsSubmitting(true);
    const enrichedText = enrichMentionInput(input, convertSuggestionDataToRender(suggestions))
    //onSubmit(enrichedText, postHidden, questID);
    dispatch(postNewRecord({
      auth,
      content: enrichedText,
      gameID: game?.id,
      playerID: player.id,
      hidden: postHidden,
      questID
    }));
    setInput('');
    setRichInputKey(prev => prev + 1);
    setIsSubmitting(false);
  };

  const handleFieldChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-2">
        <RichInput 
          key={richInputKey} 
          label='Что нового?' 
          value={input} 
          entityEdit={{ handleFieldChange }} 
          suggestionData={convertSuggestionDataToRender(suggestions)}
        />
      </div>
      {showPostSettings && postSettingsOpen && <div className='flex justify-between gap-6 items-center my-2'>
        {quests && quests.length > 0 && <SelectInput 
          key={"recordinput_questselect"}
          className='w-full'
          options={quests.map((quest) => { return { key: quest.id, value: quest.name } })} 
          label='Связанный квест' 
          labelBGColor='bg-gray-900'
          setKey={questID} 
          entityEdit={{ handleFieldChange: (value) => {setQuestID(value)} }} 
          nullable={true}
        />}
        {player?.id === game?.gmID && <div className='w-62.5 justify-items-end'>
          <ToggleSwitch 
            key={"recordinput_hiddenswitch"} 
            label='Скрыть пост' 
            labelPosition='left' 
            className=''
            entityEdit={{ handleFieldChange : (value) => setPostHidden(value) }} 
            setValue={postHidden} 
          />
        </div>}
      </div>}
      <div className="flex justify-between items-center mt-2">    
        {showPostSettings && <button
          className={`px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer`}
          onClick={() => setPostSettingsOpen(!postSettingsOpen)}
        >
          <Icon name={`${postSettingsOpen ? 'arrowUp' : 'arrowDown'}`} />
        </button>}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || input.trim() === ''}
          className={`px-4 py-2 rounded-md text-white 
            ${ isSubmitting || input.trim() === ''
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 cursor-pointer' } 
            ${ showPostSettings ? '' : 'w-full' }
          `}
        >
          {isSubmitting ? 'Публикуется...' : 'Опубликовать'}
        </button>
      </div>
      
    </div>
  );
};
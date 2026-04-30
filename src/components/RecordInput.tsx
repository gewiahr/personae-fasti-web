import { useEffect, useState } from 'react';
import { RichInput } from './lib/Inputs/RichInput';
import { enrichMentionInput } from '../types/mention';
import { ToggleSwitch } from './lib/ToggleSwitch';
import { SelectInput } from './lib/Inputs/SelectInput';
import { useAppDispatch, useAppSelector } from '../store';
import { postNewRecord, selectCurrentGame } from '../reducers/CurrentGameSlice';
import { selectAuthorization, selectPlayerInfo } from '../reducers/PlayerSlice';
import { convertSuggestionDataToRender } from '../types/suggestion';
import SubmitButton from './lib/SubmitButton';
import { LuChevronDown, LuChevronUp } from 'react-icons/lu';

type RecordInputProps = {

};

export const RecordInput: React.FC<RecordInputProps> = () => {
  const [input, setInput] = useState<string>('');
  const [questID, setQuestID] = useState<number>(0);
  
  const [postHidden, setPostHidden] = useState<boolean>(false);
  const [inputKey, setInputKey] = useState<number>(0);
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
    if (!game || !player) return;

    setIsSubmitting(true);

    const enrichedText = enrichMentionInput(input, convertSuggestionDataToRender(suggestions));
    dispatch(postNewRecord({
      auth,
      content: enrichedText,
      gameID: game?.id,
      playerID: player.id,
      hidden: postHidden,
      questID
    }));

    setInput('');
    setQuestID(0);
    setPostHidden(false);
    setInputKey(prev => prev + 1);

    setIsSubmitting(false);
  };

  const handleFieldChange = (value: string) => {
    setInput(value);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col space-y-2">
        <RichInput 
          key={`recordinput_richinput_${inputKey}`} 
          label='Что нового?'
          value={input} 
          entityEdit={{ handleFieldChange }} 
          suggestionData={convertSuggestionDataToRender(suggestions)}
        />
      </div>
      {showPostSettings && postSettingsOpen && <div className='flex justify-between gap-6 items-center my-2'>
        {quests && quests.length > 0 && <SelectInput 
          key={`recordinput_questselect_${inputKey}`}
          className='w-full'
          options={quests.map((quest) => { return { key: quest.id, value: quest.name } })} 
          label='Связанный квест'
          setKey={questID} 
          entityEdit={{ handleFieldChange: (value) => setQuestID(value) }} 
          nullable={true}
        />}
        {player?.id === game?.gmID && <div className={`${quests && quests.length > 0 ? 'w-62.5 justify-items-end' : 'w-full'}`}>
          <ToggleSwitch 
            key={`recordinput_hiddenswitch_${inputKey}`} 
            label='Скрыть пост' 
            labelPosition={quests && quests.length > 0 ? 'left' : 'right'}
            className=''
            entityEdit={{ handleFieldChange : (value) => setPostHidden(value) }} 
            setValue={postHidden} 
          />
        </div>}
      </div>}
      <div className="flex justify-between items-center mt-2">    
        {showPostSettings && postSettingsOpen ? <LuChevronUp 
          className='icon-button-accented size-10' 
          onClick={() => setPostSettingsOpen(!postSettingsOpen)}
        /> : <LuChevronDown 
          className='icon-button-accented size-10' 
          onClick={() => setPostSettingsOpen(!postSettingsOpen)}
        />}

        <SubmitButton
          onClick={handleSubmit}
          className={`${ showPostSettings ? '' : 'w-full' }`}
          disabled={isSubmitting || input.trim() === ''}
        >
          {isSubmitting ? 'Публикуется...' : 'Опубликовать'}
        </SubmitButton>
      </div>
      
    </div>
  );
};
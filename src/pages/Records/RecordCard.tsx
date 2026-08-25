import { Link } from 'react-router-dom';
import Icon from '@/components/icons/Icon';
import { type Record } from '@/types/record'
import type { QuestBrief } from '@/types/quest';
import type { SuggestionEntity } from '@/types/suggestion';
import MarkdownText from '@lib/RichText/MarkdownText';

interface RecordCardProps {
  record: Record;
  label?: string;
  accented?: boolean;
  editable?: boolean;
  quest?: QuestBrief;
  suggestions: SuggestionEntity[];
  onEdit?: (record : Record) => void;
};

const RecordCard = ({ record, label="", accented=false, editable=false, quest, suggestions, onEdit } : RecordCardProps) => {
  return (
    <div>
      <div
        key={record.id}
        className={`record-card-container ${accented ? 'record-card-container-accented' : 'record-card-container-dimmed'}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <MarkdownText key={`recordcard_richtext-${record.id}`} text={record.text} uid={`recordcard-${record.id}`} suggestions={suggestions} />
          </div>
        </div>
        <div className="flex justify-between items-end pt-2">
          
          {/* <span className='datestamp-label'>Обновлено: {new Date(record.updated).toLocaleDateString()}</span> */}
          <span className='datestamp-label'>{new Date(record.created).toLocaleDateString()}</span>

          <div className="flex items-center">
            {record.hidden && <div className='pr-4'>
              <Icon 
                key={`icon_hidden_${record.id}`} 
                name='hidden'
                className='icon-status'
              />
            </div>}
            {editable && onEdit && <button className='pr-4' onClick={() => onEdit(record)}>
              <Icon 
                key={`icon_edit_${record.id}`} 
                name='edit'
                className='icon-button-accented'/>
            </button>}
            {label !== "" && <span
              className={`card-label-container ${accented ? 'card-label-container-accented' : 'card-label-container-dimmed'}`}
            >
              {label}
            </span>}
          </div>
        </div>
      </div>

      {quest && 
        <Link to={`/quests/${record.questExt}`} >
          <div className={`record-card-quest-container ${accented ? 'record-card-quest-container-accented' : 'record-card-quest-container-dimmed'}`} >
            Квест: {quest.name}  
          </div>
        </Link>
      }
    </div>
  );
}

export default RecordCard;

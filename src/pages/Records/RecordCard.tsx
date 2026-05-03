import { Link } from 'react-router-dom';
import Icon from '@/components/icons/Icon';
import RichText from '@lib/RichText/RichText';
import { type Record } from '@/types/request'


interface RecordCardProps {
  record: Record;
  label?: string;
  accented?: boolean;
  editable?: boolean;
  showQuest?: boolean;
  onEdit?: (record : Record) => void;
};

const RecordCard = ({ record, label="", accented=false, editable=false, showQuest=true, onEdit } : RecordCardProps) => {
  return (
    <div>
      <div
        key={record.id}
        className={`record-card-container ${accented ? 'record-card-container-accented' : 'record-card-container-dimmed'}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <RichText key={`recordcard_richtext-${record.id}`} text={record.text} uid={`recordcard-${record.id}`} />
          </div>
        </div>
        <div className="flex justify-between items-end pt-2">
          <span className='datestamp-label'>Обновлено: {new Date(record.updated).toLocaleDateString()}</span>
          <div className="flex items-center">
            {record.hiddenBy > 0 && <div className='pr-4'>
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

      {showQuest && record.quest && 
        <Link to={`/quests/${record.quest.id}`} >
          <div className={`record-card-quest-container ${accented ? 'record-card-quest-container-accented' : 'record-card-quest-container-dimmed'}`} >
            Квест: {record.quest.name}  
          </div>
        </Link>
      }
    </div>
  );
}

export default RecordCard;

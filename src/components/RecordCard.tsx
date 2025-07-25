import { Link } from 'react-router-dom';
import { Record } from '../types/request';
import Icon from './icons/Icon';
import RichText from './RichText';

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
        className={`p-4 rounded-lg border ${accented
          ? 'border-blue-500 bg-gray-800'
          : 'border-gray-700 bg-gray-800'
          } relative z-40`}
      >
        <div className="flex justify-between items-start">
          <div>
            <RichText text={record.text} key={record.id} />
          </div>
        </div>
        <div className="flex justify-between items-end text-xs text-gray-400 pt-2">
          <span>Обновлено: {new Date(record.updated).toLocaleDateString()}</span>
          <div className="flex items-center">
            {record.hiddenBy > 0 && <div className='pr-4'>
              <Icon 
                key={`icon_hidden_${record.id}`} 
                name='hidden'/>
            </div>
            }
            {editable && onEdit && <button className='pr-4' onClick={() => onEdit(record)}>
              <Icon 
                key={`icon_edit_${record.id}`} 
                name='edit'
                className='text-blue-500 hover:fill-current hover:text-gray-400 cursor-pointer'/>
            </button>}
            {label !== "" && <span
              className={`text-xs px-2 py-1 rounded ${accented
                ? 'bg-blue-900 text-blue-200'
                : 'bg-gray-700 text-gray-300'
                }`}
            >
              {label}
            </span>}
          </div>
        </div>
      </div>

      {showQuest && record.quest && 
        <Link to={`/quest/${record.quest.id}`} >
          <div className={`relative -top-4 -mb-4 z-30 px-4 pt-6 pb-2 rounded-lg border ${accented
            ? 'border-blue-500 bg-gray-800'
            : 'border-gray-700 bg-gray-800'
            } text-xs cursor-pointer hover:text-blue-500`}
            
          >
            Квест: {record.quest.name}  
          </div>
        </Link>
      }
    </div>
  );
}

export default RecordCard;

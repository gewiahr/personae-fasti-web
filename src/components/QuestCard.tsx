import { Link } from 'react-router-dom';
import { QuestInfo } from '../types/request';

type QuestCardProps = {
  quest: QuestInfo;
  labelText?: string | null;
};

export const QuestCard = ({ quest, labelText=null }: QuestCardProps) => {

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <Link
      to={`/quest/${quest.id}`}
      className={`block border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-200 bg-gray-800 hover:bg-gray-750`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className=''>
          <h3 className="text-lg font-semibold text-white">{quest.name}</h3>
          
          {quest.title && <p className="text-gray-400 italic text-sm mt-1">
            {truncateDescription(quest.title)}
          </p>}
        </div>

        {labelText && <>
          <div className='flex-grow'></div>

          <div className="flex justify-end items-end text-xs text-gray-400">
            <span className={`px-2 py-1 rounded 
                ${!quest.finished || quest.finished && quest.successful
                ? 'bg-blue-900 text-blue-200'
                : 'bg-gray-700 text-gray-300'
                }`}>
              {labelText}
            </span>
          </div>
        </>}
      </div>
    </Link>
  );
};
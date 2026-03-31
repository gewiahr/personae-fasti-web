import { Link } from 'react-router-dom';
import type { QuestInfo } from '../types/request';

type QuestCardProps = {
  quest: QuestInfo;
  labelText?: string | null;
};

export const QuestCard = ({ quest, labelText = null }: QuestCardProps) => {

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const accented = !quest.finished || quest.finished && quest.successful;

  return (
    <Link
      to={`/quest/${quest.id}`}
      className={`entity-card-link-container`}
    >
      <div className="p-4 h-full flex flex-col">
        <div className=''>
          <h3 className="text-lg font-semibold text-white">{quest.name}</h3>
          
          {quest.title && <p className="text-gray-400 italic text-sm mt-1">
            {truncateDescription(quest.title)}
          </p>}
        </div>

        {labelText && <>
          <div className="flex justify-end items-end text-xs text-gray-400">
            <span className={`card-label-container ${accented ? 'card-label-container-accented' : 'card-label-container-dimmed'}`}>
              {labelText}
            </span>
          </div>
        </>}
      </div>
    </Link>
  );
};
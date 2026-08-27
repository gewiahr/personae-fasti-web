import { Link } from 'react-router-dom';
import Icon from '@/components/icons/Icon';
import type { EntityMetaData, EntityBrief } from '@/types/entities';

type EntityCardProps = {
  entity: EntityBrief;
  metaData: EntityMetaData;
  labelText?: string;
};

const EntityCard = ({ entity, metaData, labelText }: EntityCardProps) => {

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="h-full min-w-0 w-full">
      <Link
        to={`/${metaData.EntityTypePl}/${entity.ext}`}
        className="entity-card-link-container h-full min-w-0 w-full"
      >
        <div className="flex flex-col h-full p-4">
          <div className=''>

            <div className='flex justify-between items-center'>
              <h3 className="text-lg font-semibold text-white mb-1">{entity.name}</h3>
              {!labelText && entity.hidden && <div className=''>
                <Icon 
                  key={`icon_hidden_${entity.ext}`}
                  className='icon-status'
                  name='hidden'
                />
              </div>}
            </div>
            
            {entity.title && (
              <p className="text-gray-400 text-sm italic">
                {truncateDescription(entity.title)}
              </p>
            )}
          </div>

          {labelText && <>
            <div className="flex justify-between items-end mt-auto pt-3">
              <span className='datestamp-label'>Обновлено: {new Date().toLocaleDateString()}</span>
              <div className="flex items-center">
                {entity.hidden && <div className='pr-4'>
                  <Icon 
                    key={`icon_hidden_${entity.ext}`}
                    className='icon-status'
                    name='hidden'
                  />
                </div>}
                {labelText && <span className="card-label-container card-label-container-dimmed">
                  {labelText}
                </span>}
              </div>
            </div>
          </>}
        </div>
      </Link>
    </div>
  );
};

export default EntityCard;

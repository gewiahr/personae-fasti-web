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
    <div>
      <Link
        to={`/${metaData.EntityTypePl}/${entity.ext}`}
        className="entity-card-link-container"
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

          {/* Special fields for characters */}
          {/*'stats' in entity && entity?.stats && (
            <div className="flex flex-wrap gap-2 mb-3">
              {Object.entries(entity.stats).map(([key, value]) => (
                <span 
                  key={key} 
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  {key}: {value}
                </span>
              ))}
            </div>
          )*/}

          {/* Special fields for places */}
          {/*'map' in entity && entity.map && (
            <div className="text-xs text-blue-400 mb-2">
              Map: {entity.map}
            </div>
          )*/}

          {labelText && <>
            <div className='grow mt-3'></div>

            <div className="flex justify-between items-end">
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

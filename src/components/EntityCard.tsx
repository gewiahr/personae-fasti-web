// components/EntityCard.tsx
import { Link } from 'react-router-dom';
import { EntityMetaData } from '../types/entities';
import { EntityInfo } from '../types/request';
import Icon from './icons/Icon';

type EntityCardProps = {
  entity: EntityInfo;
  metaData: EntityMetaData;
  labelText?: string;
};

export const EntityCard = ({ entity, metaData, labelText }: EntityCardProps) => {
  //const [ labelText, setLabelText ] = useState<string>();

  // Helper function to truncate long descriptions
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // useEffect(() => {
  //   // Set label text
  //   switch (entityType) {
  //     case 'char':
  //       setLabelText(labelText);
  //     //case 'npc':
  //     //case 'location':
  //   };
  // });

  return (
    <Link
      to={`/${metaData.EntityType}/${entity.id}`}
      className="block border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors duration-200 bg-gray-800 hover:bg-gray-750"
    >
      <div className="p-4 h-full flex flex-col">
        <div className=''>
          <h3 className="text-lg font-semibold text-white mb-1">{entity.name}</h3>
          
          {entity.title && ( /*title in entity && (*/
            <p className="text-gray-300 text-sm">
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
          <div className='flex-grow mt-3'></div>

          <div className="flex justify-between items-end text-xs text-gray-400">
            {/* <div className='flex-grow'></div> */}
            <span>Обновлено: {new Date().toLocaleDateString()}</span>
            {/* <span>Обновлено: {entity.updated}</span> */}
            <div className="flex items-center">
              {entity.hiddenBy > 0 && <Icon 
                key={`icon_hidden_${entity.id}`} 
                name='hidden'/>
              }
              {labelText && <span className="bg-gray-700 px-2 py-1 rounded">
                {labelText}
              </span>}
            </div>
          </div>
        </>}
      </div>
    </Link>
  );
};
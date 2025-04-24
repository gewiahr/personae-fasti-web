// components/EntityCard.tsx
import { Link } from 'react-router-dom';
import { EntityMetaData } from '../types/entities';
import { EntityInfo } from '../types/request';

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
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2">{entity.name}</h3>
        
        {entity.title && ( /*title in entity && (*/
          <p className="text-gray-300 text-sm mb-3">
            {truncateDescription(entity.title)}
          </p>
        )}

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

        <div className="flex justify-between items-center text-xs text-gray-400">
          <span>Обновлено: {new Date().toLocaleDateString()}</span>
          {labelText && <span className="bg-gray-700 px-2 py-1 rounded">
            {labelText}
          </span>}
        </div>
      </div>
    </Link>
  );
};
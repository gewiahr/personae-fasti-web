import { entityToMetaData, type EntityType } from "@/types/entities";

type HyperlinkProps = {
  id: string,
  type: EntityType,
  mentionText: string
}

const Hyperlink: React.FC<HyperlinkProps> = ({ id, type, mentionText }) => {
  let typeColor = "";
  switch (type) {
    case "char":
      typeColor = "text-blue-500";
      break;
    case "npc":
      typeColor = "text-yellow-500";
      break;
    case "location":
      typeColor = "text-green-500";
      break;
  }

  return (
    <a
      key={`hyperlink-${type}-${id}`}
      href={`/${entityToMetaData[type].metaData}/${id}`}
      className={`${typeColor} text-sans mention-link hover:underline`}
      // onClick={(e) => {
      //   e.preventDefault();
      //   window.location.href = `/${entityConfig[type].EntityTypePl}/${id}`;
      // }}
    >
      {mentionText}
    </a>
  )
}

export default Hyperlink

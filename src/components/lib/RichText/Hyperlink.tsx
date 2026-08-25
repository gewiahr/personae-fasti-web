import { entityToMetaData, getEntityMetaData, type EntityType } from "@/types/entities";

type HyperlinkProps = {
  ext: string,
  type: EntityType,
  mentionText: string
}

const Hyperlink: React.FC<HyperlinkProps> = ({ ext, type, mentionText }) => {
  const typeColor = getEntityMetaData(type)?.MentionColor.TextClass ?? "";

  return (
    <a
      key={`hyperlink-${type}-${ext}`}
      href={`/${entityToMetaData[type].metaData}/${ext}`}
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

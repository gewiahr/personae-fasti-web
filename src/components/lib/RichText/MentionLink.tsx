import { useState } from "react";
import { entityToMetaData, getEntityMetaData, type EntityType } from "@/types/entities";

type MentionLinkProps = {
  ext: string;
  type: EntityType;
  mentionText: string;
};

const MentionLink: React.FC<MentionLinkProps> = ({ ext, type, mentionText }) => {
  // Hover-info extension point for later — wire a popover/tooltip off
  // isHovered (or the data-hovered attribute below) when you build that.
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`/${entityToMetaData[type].metaData}/${ext}`}
      className={`${getEntityMetaData(type)?.MentionColor.TextClass ?? ""} text-sans mention-link hover:underline`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-hovered={isHovered || undefined}
    >
      {mentionText}
    </a>
  );
};

export default MentionLink;

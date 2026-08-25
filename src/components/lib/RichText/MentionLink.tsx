import { useState } from "react";
import { entityToMetaData, type EntityType } from "@/types/entities";

type MentionLinkProps = {
  ext: string;
  type: EntityType;
  mentionText: string;
};

const TYPE_COLOR: Record<EntityType, string> = {
  char: "text-blue-500",
  npc: "text-yellow-500",
  location: "text-green-500",
};

const MentionLink: React.FC<MentionLinkProps> = ({ ext, type, mentionText }) => {
  // Hover-info extension point for later — wire a popover/tooltip off
  // isHovered (or the data-hovered attribute below) when you build that.
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={`/${entityToMetaData[type].metaData}/${ext}`}
      className={`${TYPE_COLOR[type] ?? ""} text-sans mention-link hover:underline`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-hovered={isHovered || undefined}
    >
      {mentionText}
    </a>
  );
};

export default MentionLink;
import React from 'react';
import EditIcon from './EditIcon';
import HiddenIcon from './HiddenIcon';

// Define all possible icon names
export type IconName = 
  | 'hidden'
  | 'edit'

type IconProps = {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  onClick?: () => void;
};

const svgComponents: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  hidden: HiddenIcon,
  edit: EditIcon,
  // Map all icons
};

const Icon: React.FC<IconProps> = ({ name, className = '', size = 20, ...props }) => {
  const SvgComponent = svgComponents[name];

  const emojiMap: Record<IconName, string> = {
    hidden: '✅',
    edit: '❌',
  };
  
  return SvgComponent ? (
    <SvgComponent
      className={className}
      width={size}
      height={size}
      {...props}
    />
  ) : (
    <span className={className} style={{ fontSize: size }}>
      {emojiMap[name]}
    </span>
  );
};

export default Icon;
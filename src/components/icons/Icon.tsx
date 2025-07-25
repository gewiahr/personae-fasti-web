import React from 'react';
import EditIcon from './EditIcon';
import HiddenIcon from './HiddenIcon';
import SubmitIcon from './SubmitIcon';
import TrashIcon from './TrashIcon';

// Define all possible icon names
export type IconName = 
  | 'hidden'
  | 'edit'
  | 'submit'
  | 'trash'

type IconProps = {
  name: IconName;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  onClick?: () => void;
};

// https://www.flaticon.com/uicons/interface-icons
const svgComponents: Record<IconName, React.FC<React.SVGProps<SVGSVGElement>>> = {
  hidden: HiddenIcon,
  edit: EditIcon,
  submit: SubmitIcon,
  trash: TrashIcon,
};

const Icon: React.FC<IconProps> = ({ name, className = '', size = 20, ...props }) => {
  const SvgComponent = svgComponents[name];

  const emojiMap: Record<IconName, string> = {
    hidden: '👁️',
    edit: '📝', //❌
    submit: '✅',
    trash: '🗑️',
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
type FloatingLabelProps = {
  id: string;
  label: React.ReactNode;
  placeholder: boolean;
  labelBGColor: string; 
  error?: string;
};

const FloatingLabel: React.FC<FloatingLabelProps> = ({ 
  id,
  label,
  placeholder,
  labelBGColor,
  error
 }) => {
  return (<label
    htmlFor={id}
    className={`
            floating-label-container
            ${placeholder ? 'floating-label-container-position-placeholder' : 'floating-label-container-position-label'}
            ${error && placeholder ? 'floating-label-container-placeholder-error' : ''}
            ${placeholder ? labelBGColor : ""}
          `}
  >
    {label}
  </label>);
};

export default FloatingLabel;
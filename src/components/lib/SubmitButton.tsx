type SubmitButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ children, onClick, className = "", danger = false, disabled = false }) => {
  return (<button
    className={`submit-button-container ${disabled ? `submit-button-container-disabled` : danger ? `submit-button-container-danger` : `submit-button-container-regular`} ${className}`}
    onClick={onClick}
  >
    {children}
  </button>);
};

export default SubmitButton;
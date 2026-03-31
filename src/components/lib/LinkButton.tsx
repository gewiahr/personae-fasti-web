import { Link, type To } from "react-router-dom";

type LinkButtonProps = {
  children: React.ReactNode;
  to: To;
  className?: string;
  danger?: boolean;
  disabled?: boolean;
};

const LinkButton: React.FC<LinkButtonProps> = ({ children, to, className = "", danger = false, disabled = false }) => {
  return (
    <Link
      className={`submit-button-container ${disabled ? `submit-button-container-disabled` : danger ? `submit-button-container-danger` : `submit-button-container-regular`} ${className}`}
      to={to}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
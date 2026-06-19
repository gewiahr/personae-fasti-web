import { useEffect, useRef, useState } from 'react'
import SubmitButton from './SubmitButton';

type ConfirmButtonProps = {
  children: React.ReactNode;
  onClickConfirm: () => void;
  confirmation?: React.ReactNode;
  className?: string;  
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ children, onClickConfirm, confirmation = 'Подтвердить', className }) => {
  const [confirmDelay, setConfirmDelay] = useState<boolean>(false);
  const [confirmRequested, setConfirmRequested] = useState<boolean>(false);

  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setConfirmRequested(false);
      }
    };

    if (confirmRequested && !confirmDelay) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [confirmDelay, confirmRequested]);

  const handleConfirmRequest = () => {
    setConfirmDelay(true);
    setConfirmRequested(true);
    setTimeout(() => {
      setConfirmDelay(false);
    }, 500) 
  };

  const handleOnClickConfirm = () => {
    setConfirmDelay(true);
    onClickConfirm();
    setConfirmDelay(false);
    setConfirmRequested(false);
  };

  return (
    confirmDelay ? <SubmitButton className={`${className}`} onClick={() => {}} ref={buttonRef} disabled>
        {"Загрузка..."}
    </SubmitButton> : confirmRequested ? <SubmitButton className={`${className}`} onClick={handleOnClickConfirm} ref={buttonRef} danger>
        {confirmation}
    </SubmitButton> : <SubmitButton className={`${className}`} onClick={handleConfirmRequest} ref={buttonRef} >
        {children}
    </SubmitButton>
  )
};

export default ConfirmButton;

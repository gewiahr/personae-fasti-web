// components/Modal.tsx
import { ReactNode, useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export const Modal = ({
  onClose,
  title,
  children,
  className = ''
}: ModalProps) => {
  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center z-50" 
      onClick={onClose}
    >
      <div 
        className={`p-4 rounded-lg border border-blue-500 bg-gray-800 relative max-w-2xl w-[90%] mx-4 animate-in fade-in zoom-in-95 duration-300 ease-out ${className}`}
        onClick={(e) => e.stopPropagation()}
      >

          <h3 className="font-bold text-lg">{title}</h3>
          <button 
            onClick={onClose}
            className="modal-close absolute right-4 top-2 text-2xl hover:text-gray-600 transition-colors duration-150"
          >
            x
          </button>
        {children}
      </div>
    </div>
  );
};
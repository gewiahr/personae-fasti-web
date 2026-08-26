import { useState } from 'react';

type FoldableCategoryProps = {
  title: string;
  children: React.ReactNode;
}

const FoldableCategory = ({ title, children }: FoldableCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=''>
      {/* Header with animated lines */}
      <button
        type="button"
        aria-expanded={isOpen}
        className="w-full transition-all duration-300"
        onClick={toggleOpen}
      >
        <div className='relative flex items-center justify-center p-4 cursor-pointer group'>
          {/* Left line */}
          <div 
            className={`absolute left-0 top-1/2 h-px bg-(--color-gray) group-hover:bg-(--color-accent) transition-all duration-300 ${
              isOpen ? 'w-[25%] opacity-100' : 'w-[5%] opacity-100'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
          
          {/* Title */}
          <h3 className={`text-lg font-medium ${isOpen ? 'text-(--color-accent)' : 'text-(--color-gray) group-hover:text-(--color-accent)'}`}>{title}</h3>
          
          {/* Right line */}
          <div 
            className={`absolute right-0 top-1/2 h-px bg-(--color-gray) group-hover:bg-(--color-accent) transition-all duration-300 ${
              isOpen ? 'w-[25%] opacity-100' : 'w-[5%] opacity-100'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
        </div>        
      </button>

      {/* Content with smooth height transition */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-80'
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-px py-2">
            {children}
          </div>
        </div>
      </div>

      {<div 
        className={`h-px bg-(--color-gray) transition-all duration-300 ${
          isOpen ? 'w-full opacity-100 my-6' : 'w-0 opacity-0'
        }`}
        style={{ transform: 'translateY(-50%)' }}
      />}
    </div>
  );
};

export default FoldableCategory;

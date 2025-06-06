import { useState, useRef } from 'react';

interface FoldableCategoryProps {
  title: string;
  children: React.ReactNode;
}

const FoldableCategory = ({ title, children }: FoldableCategoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=''>
      {/* Header with animated lines */}
      <div 
        ref={headerRef}
        className={` transition-all duration-300 ${
          isOpen ? '' : ''
        }`}
        onClick={toggleOpen}
      >
        <div className='relative flex items-center justify-center p-4 cursor-pointer group'>
          {/* Left line */}
          <div 
            className={`absolute left-0 top-1/2 h-px bg-gray-300 group-hover:bg-blue-500 transition-all duration-300 ${
              isOpen ? 'w-[25%] opacity-100' : 'w-[5%] opacity-100'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
          
          {/* Title */}
          <h3 className={`text-lg font-medium ${isOpen ? 'text-blue-500' : 'text-gray-500 group-hover:text-blue-500'}`}>{title}</h3>
          
          {/* Right line */}
          <div 
            className={`absolute right-0 top-1/2 h-px bg-gray-300 group-hover:bg-blue-500 transition-all duration-300 ${
              isOpen ? 'w-[25%] opacity-100' : 'w-[5%] opacity-100'
            }`}
            style={{ transform: 'translateY(-50%)' }}
          />
          
          {/* Chevron icon */}
          <div className="text-gray-500">
            {/* {isOpen ? (
              <FiChevronUp className="w-5 h-5" />
            ) : (
              <FiChevronDown className="w-5 h-5" />
            )} */}
          </div>
        </div>        
      </div>

      {/* Content with smooth height transition */}
      <div
        ref={contentRef}
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-80'
        }`}
        style={{
          transitionProperty: 'max-height, opacity'
        }}
      >
        {/* <div className="p-4 pt-2 border-t border-gray-100"> */}
          {children}
        {/* </div> */}
      </div>

      {<div 
        className={`h-px bg-gray-300 transition-all duration-300 ${
          isOpen ? 'w-[100%] opacity-100 my-6' : 'w-0 opacity-0'
        }`}
        style={{ transform: 'translateY(-50%)' }}
      />}
    </div>
  );
};

export default FoldableCategory;
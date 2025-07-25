import { useState, forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import { EntityEdit } from '../types/entities';
import { SelectKeyValue } from '../types/utils';
import Icon from './icons/Icon';

type SelectInputProps = {
  options: SelectKeyValue[];
  setKey?: any;
  setValue?: string;
  nullable?: boolean;
  label?: string;
  bgColor?: string;
  entityEdit?: EntityEdit; 
  className?: string; 
  error?: string;
};

export const SelectInput = forwardRef<HTMLDivElement, SelectInputProps>(
  ({ options, setKey, setValue, nullable=false, label, entityEdit, className = '', bgColor='bg-gray-800', error }, outerRef) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);

    // Combine innerRef and outerRef
    useImperativeHandle(outerRef, () => innerRef.current as HTMLDivElement);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setIsFocused(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    if (setKey != null || setKey != undefined) {
      let foundOptionByKey = options.find((option) => (option.key == setKey));
      if (foundOptionByKey) setValue = foundOptionByKey.value;
    };

    const handleChange = (value: any) => {
      entityEdit?.handleFieldChange(value, entityEdit?.fieldName || "", entityEdit.arrayIndex);
      setIsOpen(false);
    };

    const handleClearSelect = () => {
      handleChange(0);
      //setIsOpen(false);
    }

    return (
      <div className={`relative ${className}`} ref={innerRef}>
        {/* Input-like trigger  min-h-12 */}
        <div className={`flex justify-between items-center
              w-full px-4 py-3 border rounded-lg
              focus:outline-none focus:ring-2 cursor-pointer
              ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
              bg-transparent
            `}
            onClick={() => {
              setIsOpen(!isOpen);
              setIsFocused(true);
            }}      
        >
          <div className='h-full' 
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              setTimeout(() => setIsOpen(false), 200);
            }}     
            tabIndex={0}
          >
            {setValue || '\u00A0'} 
          </div>
          {/* <div className='relative'
            onClick={(e) => { e.stopPropagation(); handleClearSelect(); }}
          >
            X
          </div> */}
          {nullable && setValue && <button onClick={(e) => { e.stopPropagation(); handleClearSelect(); setIsFocused(false); }} >
            <Icon 
              name='trash'
              className='text-red-500 hover:fill-current hover:text-gray-400 cursor-pointer'/>
          </button>}
        </div>
        

        {/* Floating label */}
        <label
          className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused || setValue ?
              '-top-2 text-xs' :
              'top-3.5 text-gray-500'}
            ${error && (isFocused || setValue) ? 'text-red-600' : ''}
            peer-focus:-top-2 peer-focus:text-xs 
            ${(isFocused || setValue) ? bgColor : ""}
          `}
        >
          {label}
        </label>

        {/* Dropdown options */}
        {isOpen && (
          <div 
            className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} >
            {options.map((option) => (
              <div
                key={option.key}
                className={`px-4 py-2 hover:bg-blue-700 rounded-lg cursor-pointer ${setValue === option.value ? 'bg-blue-800' : ''
                  }`}
                onClick={() => handleChange(option.key)}
              >
                {option.value}
              </div>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

SelectInput.displayName = 'SelectInput';
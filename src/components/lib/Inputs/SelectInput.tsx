import { useState, useEffect, useRef } from 'react';
import type { SelectKeyValue } from '../../../types/utils';
import Icon from '../../icons/Icon';
import type { TextInputProps } from './InputProps';

type SelectInputProps = TextInputProps & {
  options: SelectKeyValue[];
  setKey?: any;
  nullable?: boolean;
};

export const SelectInput: React.FC<SelectInputProps> = (
  { options, setKey, value = '', nullable=false, label, entityEdit, className = '', labelBGColor='bg-gray-800', error }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);

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
    if (foundOptionByKey) value = foundOptionByKey.value;
  };

  const handleChange = (value: any) => {
    entityEdit?.handleFieldChange(value, entityEdit?.fieldName || "", entityEdit.arrayIndex);
    setIsOpen(false);
  };

  const handleClearSelect = () => {
    handleChange(0);
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
          {value || '\u00A0'}
        </div>
        {/* <div className='relative'
            onClick={(e) => { e.stopPropagation(); handleClearSelect(); }}
          >
            X
          </div> */}
        {nullable && value && <button onClick={(e) => { e.stopPropagation(); handleClearSelect(); setIsFocused(false); }} >
          <Icon
            name='trash'
            className='text-red-500 hover:fill-current hover:text-gray-400 cursor-pointer' />
        </button>}
      </div>


      {/* Floating label */}
      <label
        className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused || value ?
            '-top-2 text-xs' :
            'top-3.5 text-gray-500'}
            ${error && (isFocused || value) ? 'text-red-600' : ''}
            peer-focus:-top-2 peer-focus:text-xs 
            ${(isFocused || value) ? labelBGColor : ""}
          `}
      >
        {label}
      </label>

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="absolute z-50 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-y-auto max-h-60"
          onClick={(e) => e.stopPropagation()} >
          {options.map((option) => (
            <div
              key={option.key}
              className={`px-4 py-2 hover:bg-blue-700 rounded-lg cursor-pointer ${value === option.value ? 'bg-blue-800' : ''
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
};
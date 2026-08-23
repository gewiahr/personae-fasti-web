import { useState, useEffect, useRef } from 'react';
import type { SelectKeyValue } from '../../../types/utils';
import Icon from '../../icons/Icon';
import type { TextInputProps } from './InputProps';
import FloatingLabel from './FloatingLabel';

type SelectInputProps = TextInputProps & {
  options: SelectKeyValue[];
  setKey?: any;
  nullable?: boolean;
};

export const SelectInput: React.FC<SelectInputProps> = (
  { options, setKey, value = '', nullable=false, label, entityEdit, className = '', labelBGColor='bg-(--color-bg-primary)', error }) => {
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
    handleChange('');
  }

  return (
    <div className={`relative ${className}`} ref={innerRef}>
      {/* Input-like trigger  min-h-12 */}
      <div className={`select-input-container ${error ? 'select-input-container-border-error' : 'select-input-container-border'}`}
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
            className='icon-button-danger' />
        </button>}
      </div>


      {/* Floating label */}
      <FloatingLabel
        label={label}
        labelBGColor={labelBGColor}
        placeholder={isFocused || value != ""}
      />

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="select-input-dropdown-container scroll-thin"
          onClick={(e) => e.stopPropagation()} >
          {options.map((option) => (
            <div
              key={option.key}
              className={`select-input-dropdown-option ${value === option.value ? 'select-input-dropdown-option-selected' : ''}`}
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

import { useState, useEffect, useRef } from 'react';
import type { SelectKeyValue } from '../../../types/utils';
import Icon from '../../icons/Icon';
import type { TextInputProps } from './InputProps';
//import FloatingLabel from './FloatingLabel';

type ListInputProps = TextInputProps & {
  addLabel?: string;
  suggestions?: SelectKeyValue[];
  setOptions?: SelectKeyValue[];
};

export const ListInput: React.FC<ListInputProps> = (
  { suggestions = [], setOptions = [], value = '', label, addLabel = '+', entityEdit, className = '', labelBGColor = 'bg-(--color-bg-primary)', error }) => {

  const [isEditing, switchEditing] = useState<boolean>(false);
  const [listItems, setListItems] = useState<SelectKeyValue[]>(setOptions);
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
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // if (setKey != null || setKey != undefined) {
  //   let foundOptionByKey = options.find((option) => (option.key == setKey));
  //   if (foundOptionByKey) value = foundOptionByKey.value;
  // };

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
      <div className={`list-input-container ${error ? 'list-input-container-border-error' : 'list-input-container-border'}`}
        onClick={() => {
          setIsOpen(!isOpen);
          setIsFocused(true);
        }}
      >
        <div className='list-input-item-list'>

          {listItems.map((item) => <div className='list-input-item'>
            {item.value}
          </div>)}

          {isEditing ? <input
            className={`list-input-item`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            //onChange={handleChange}
            value={value}
          /> : <div className='list-input-item list-input-item-add'
            onClick={() => switchEditing(true)}
            // onFocus={() => setIsFocused(true)}
            // onBlur={() => {
            //   setIsFocused(false);
            //   setTimeout(() => setIsOpen(false), 200);
            // }}
            tabIndex={0}
          >
            {addLabel}
          </div>}

        </div>

        {/* <div className='relative'
            onClick={(e) => { e.stopPropagation(); handleClearSelect(); }}
          >
            X
          </div> */}

        {value && <button onClick={(e) => { e.stopPropagation(); handleClearSelect(); setIsFocused(false); }} >
          <Icon
            name='trash'
            className='text-red-500 hover:fill-current hover:text-gray-400 cursor-pointer' />
        </button>}

      </div>

      <label
        className={`
            floating-label-container floating-label-container-position-placeholder
            ${error ? 'floating-label-container-placeholder-error' : ''}
            ${labelBGColor}
          `}
      >
        {error ? error : label}
      </label>

      {/* Floating label */}
      {/* <FloatingLabel
        label={label}
        labelBGColor={labelBGColor}
        placeholder={isFocused || value != ""}
      /> */}

      {/* Dropdown options */}
      {isOpen && (
        <div
          className="select-input-dropdown-container"
          onClick={(e) => e.stopPropagation()} >
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.key}
              className={`select-input-dropdown-option ${value === suggestion.value ? 'select-input-dropdown-option-selected' : ''}`}
              onClick={() => handleChange(suggestion.key)}
            >
              {suggestion.value}
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
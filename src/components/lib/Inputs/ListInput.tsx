import { useState, useEffect, useRef } from 'react';
import Icon from '../../icons/Icon';
import type { TextInputProps } from './InputProps';
import SubmitButton from '../SubmitButton';

type ListInputProps = TextInputProps & {
  addButtonLabel?: string;
  setOptions?: ListInputItem[];
  // suggestions?: ListInputItem[];
  onAdd?: (value: string) => Promise<string>;
  onAddLabel?: string;
  onAddStatus?: string;
};

export type ListInputItem = {
  key: any;
  value: string;
  status?: string;
  onDelete?: () => void;
}

export const ListInput: React.FC<ListInputProps> = ({ 
  // suggestions = [], 
  setOptions = [], 
  // value = '', 
  label, 
  addButtonLabel = 'Добавить', 
  // entityEdit, 
  className = '', 
  labelBGColor = 'bg-(--color-bg-primary)', 
  error, 
  onAdd,
  onAddLabel = 'Добавить',
  onAddStatus = ""
}) => {

  // const [isAdding, setAdding] = useState<boolean>(false);
  

  const [state, setState] = useState<'view' | 'add' | 'remove'>('view');

  const [addValue, setAddValue] = useState<string>("");
  const [_, setAddingFocused] = useState<boolean>(false);

  const [listItems, setListItems] = useState<ListInputItem[]>(setOptions);
  //const [constainerFocused, setContainerFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setAddingFocused(false);
      }

      if (addValue == "") setState('view'); 
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    };

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, addValue]);

  useEffect(() => {
    if (state === 'add' && inputRef.current) {
      inputRef.current.focus();
    }
    setAddValue("");
  }, [state]);

  // if (setKey != null || setKey != undefined) {
  //   let foundOptionByKey = options.find((option) => (option.key == setKey));
  //   if (foundOptionByKey) value = foundOptionByKey.value;
  // };

  // const handleChange = (value: any) => {
  //   entityEdit?.handleFieldChange(value, entityEdit?.fieldName || "", entityEdit.arrayIndex);
  //   setIsOpen(false);
  // };

  // const handleClearSelect = () => {
  //   handleChange(0);
  // }

  const handleAdd = async () => {
    const newKey = listItems.at(-1);
    setListItems([...listItems, { key: newKey, value: addValue, status: onAddStatus } ]);
    setState('view');
    setAddingFocused(false);
    setAddValue("");
    const added = await onAdd?.(addValue);
    if (added) setListItems(prevItems => 
      prevItems.map(item => 
        item.key === newKey 
          ? { ...item, status: added }
          : item
      )
    );
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Input-like trigger  min-h-12 */}
      <div className={`list-input-container ${error ? 'list-input-container-border-error' : 'list-input-container-border'}`}
        onClick={() => {
          setIsOpen(!isOpen);
          //setContainerFocused(true);
        }}
      >
        <div className='list-input-item-list'>

          {listItems.map((item) => <>
            <div className='list-input-item'>
              <p>{item.value}</p> 
              <div className='flex gap-4'>
                <p className='text-(--color-text-gray) italic'>{item.status}</p>
                {item.onDelete ? <Icon name='trash' className='icon-button-danger' size={24} onClick={() => setState('remove')} /> : <div className='w-6' ></div>}
              </div>     
            </div>
            <hr className='px-1 items-center w-full text-gray-600' />      
          </>)}

          {state === 'add' ? <div className={`list-input-item`}>
            <input
              ref={inputRef}
              className='flex flex-1 outline-0'
              onFocus={() => setAddingFocused(true)}
              onBlur={() => setAddingFocused(false)}
              onChange={(e) => setAddValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && addValue.trim()) handleAdd() }}
              value={addValue}
            />
            <button className='icon-button-accented' onClick={handleAdd}>
              {onAddLabel}
            </button>
          </div> : state === 'remove' ? <div className='flex'>
            <button className='flex-1 px-4 py-3 rounded-bl-lg text-(--color-text) bg-(--color-button-danger)'>Удалить</button>
            <button className='flex-1 px-4 py-3 rounded-br-lg text-(--color-text) bg-(--color-button-primary)'>Отменить</button>
          </div> : <button className='list-input-item list-input-item-add'
            onClick={() => setState('add')}
            // onFocus={() => setContainerFocused(true)}
            // onBlur={() => {
            //   setContainerFocused(false);
            //   setTimeout(() => setIsOpen(false), 200);
            // }}
          >
            {addButtonLabel}
          </button>}

        </div>

        {/* <div className='relative'
            onClick={(e) => { e.stopPropagation(); handleClearSelect(); }}
          >
            X
          </div> */}

        {/* {value && <button onClick={(e) => { e.stopPropagation(); handleClearSelect(); setContainerFocused(false); }} >
          <Icon
            name='trash'
            className='text-red-500 hover:fill-current hover:text-gray-400 cursor-pointer' />
        </button>} */}

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

      {/* Dropdown options */}
      {/* {isOpen && suggestions.length > 0 && (
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
      )} */}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
import { useState, forwardRef } from 'react';
import { EntityEdit } from '../types/entities';
import { SelectKeyValue } from '../types/utils';

type SelectInputProps = {
  options: SelectKeyValue[];
  value?: string;
  label?: string;
  entityEdit?: EntityEdit; 
  className?: string;
  error?: string;
};

export const SelectInput = forwardRef<HTMLDivElement, SelectInputProps>(
  ({ label, value, options, entityEdit, className = '', error }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleChange = (value: string) => {
      entityEdit?.handleFieldChange(value, entityEdit?.fieldName || "");
      setIsOpen(false);
    };

    return (
      <div className={`relative ${className}`} ref={ref}>
        {/* Input-like trigger */}
        <div
          className={`
            w-full px-4 py-3 border rounded-lg
            focus:outline-none focus:ring-2 cursor-pointer
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
            bg-transparent
          `}
          onClick={() => setIsOpen(!isOpen)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            setTimeout(() => setIsOpen(false), 200);
          }}
          tabIndex={0}
        >
          {value}
        </div>

        {/* Floating label */}
        <label
          className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused || value ?
              '-top-2.5 text-xs' :
              'top-3.5 text-gray-500'}
            ${error && (isFocused || value) ? 'text-red-600' : ''}
            peer-focus:-top-2.5 peer-focus:text-xs 
            ${(isFocused || value) ? "bg-[#242424]" : ""}
          `}
        >
          {label}
        </label>

        {/* Dropdown options */}
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
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
  }
);

SelectInput.displayName = 'SelectInput';
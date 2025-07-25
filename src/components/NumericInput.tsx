import { useState, useId, InputHTMLAttributes, forwardRef, useEffect } from 'react';
import { EntityEdit } from '../types/entities';

type NumericInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  setValue?: number;
  entityEdit?: EntityEdit;
  error?: string;  
};

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  ({ label = '', setValue = 0, entityEdit, error, className = '', ...props }, ref ) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    useEffect(() => {
      //setHasValue(!!initValue);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        entityEdit?.handleFieldChange(Number(e.target.value), entityEdit?.fieldName || "", entityEdit.arrayIndex);
    };

    const increment = () => entityEdit?.handleFieldChange(setValue + 1, entityEdit?.fieldName || "", entityEdit.arrayIndex);
    const decrement = () => entityEdit?.handleFieldChange(Math.max(setValue - 1, 0), entityEdit?.fieldName || "", entityEdit.arrayIndex);

    return (
      <div className={`relative ${className} number-input-container`}>
        <input
          ref={ref}
          id={id}
          type='number'
          className={`
            w-full px-2! pr-6! py-3! border rounded-lg
            focus:outline-none focus:ring-2
            peer
            ${error ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'}
            bg-transparent
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange} 
          value={setValue}         
          {...props}
        />

        <div className="number-input-arrows">
          <button 
            type="button"
            onClick={increment}
            className="number-input-arrow"
            aria-label="Increase value">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button 
            type="button"
            onClick={decrement}
            className="number-input-arrow"
            aria-label="Decrease value">
            <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
   
        <label
          htmlFor={id}
          className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused ? 
              '-top-2 text-xs' : 
              'top-3.5 text-gray-500'}
            ${error && (isFocused) ? 'text-red-600' : ''}
            peer-focus:-top-2 peer-focus:text-xs ${isFocused ? "bg-gray-900" : ""}

          `}
        >
          {label}
        </label>

        {/*error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )*/}
      </div>
    );
  }
);

NumericInput.displayName = 'NumericInput';
import { useState, useId, InputHTMLAttributes, forwardRef, useEffect } from 'react';
import { EntityEdit } from '../types/entities';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  number?: boolean;
  setValue?: string;
  entityEdit?: EntityEdit;
  error?: string;  
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, number = false, setValue = "", entityEdit, error, className = '', ...props }, ref ) => {
    const [isFocused, setIsFocused] = useState(false);
    const id = useId();

    useEffect(() => {
      //setHasValue(!!initValue);
    }, []);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (entityEdit) {
        entityEdit?.handleFieldChange(e.target.value, entityEdit?.fieldName, entityEdit.arrayIndex);
      };
    };

    return (
      <div className={`relative ${className}`}>
        <input
          ref={ref}
          id={id}
          className={`
            w-full px-4 py-3 border rounded-lg
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
        
        <label
          htmlFor={id}
          className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused || setValue.length ? 
              '-top-2 text-xs' : 
              'top-3.5 text-gray-500'}
            ${error && (isFocused || setValue.length) ? 'text-red-600' : ''}
            peer-focus:-top-2 peer-focus:text-xs ${isFocused || setValue.length ? "bg-gray-900" : ""}

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

InputField.displayName = 'InputField';
import { useState, useId, InputHTMLAttributes, forwardRef, useEffect } from 'react';
import { EntityEdit } from '../types/entities';

type NumericInputInlineProps = InputHTMLAttributes<HTMLInputElement> & {
  setValue?: number;
  entityEdit?: EntityEdit;
};

export const NumericInputInline = forwardRef<HTMLInputElement, NumericInputInlineProps>(
  ({ setValue = 0, entityEdit, className = '', ...props }, ref) => {
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
      <div className={`relative ${className} flex justify-between content-center`}>
        {/* <div className="flex items-center border-b border-gray-200 focus-within:border-blue-500 transition-colors"> */}
        <button
          onClick={decrement}
          className="px-2 text-gray-500 hover:text-blue-600 focus:outline-none"
          aria-label="Decrease"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 12H4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <div className='relative flex items-center justify-center h-full'>
          <input
            ref={ref}
            id={id}
            type='number'
            className={`w-12 text-center border-none focus:ring-0 focus:outline-none bg-transparent`}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={handleChange}
            value={setValue}
            {...props}
          />
        </div>
        
        <button
          onClick={increment}
          className="px-2 text-gray-500 hover:text-blue-600 focus:outline-none"
          aria-label="Increase"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 4V20M20 12H4" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
      </div>
    );
  }
);

NumericInputInline.displayName = 'NumericInputInline';
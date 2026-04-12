import { useState, useId } from 'react';
import type { TextInputProps } from './InputProps';
import FloatingLabel from './FloatingLabel';

type InputFieldProps = TextInputProps & {
  htmlType?: React.HTMLInputTypeAttribute;
};

export const InputField: React.FC<InputFieldProps> = ({ label = '', value = "", entityEdit, error, labelBGColor = 'bg-(--color-bg-primary)', className = '', htmlType = undefined }) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  const shortError = error && error.length <= 25 ? error : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (entityEdit) {
      entityEdit?.handleFieldChange(e.target.value, entityEdit?.fieldName, entityEdit.arrayIndex);
    };
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type={htmlType}
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
        value={value}
      />

      <FloatingLabel 
        id={id}
        label={label}
        placeholder={isFocused || value.length > 0} 
        labelBGColor={labelBGColor}    
        error={shortError}    
      />

      {/* <label
        htmlFor={id}
        className={`
            absolute left-4 px-1
            transition-all duration-200 ease-in-out
            pointer-events-none
            ${isFocused || value.length ?
            '-top-2 text-xs' :
            'top-3.5 text-gray-500'}
            ${error && (isFocused || value.length) ? 'text-red-600' : ''}
            peer-focus:-top-2 peer-focus:text-xs ${isFocused || value.length ? labelBGColor : ""}

          `}
      >
        {label}
      </label> */}

      {error && !shortError && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};
import { useState, useId } from 'react';
import type { TextInputProps } from './InputProps';
import FloatingLabel from './FloatingLabel';
import { countSymbols } from '@/utils/validation';

type InputFieldProps = TextInputProps & {
  htmlType?: React.HTMLInputTypeAttribute;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export const InputField: React.FC<InputFieldProps> = ({ 
  label = '', 
  min,
  max,
  maxLength,
  value = "", 
  entityEdit, 
  error, 
  labelBGColor = 'bg-(--color-bg-primary)', 
  className = '', 
  htmlType, 
  inputRef 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const id = useId();

  const shortError = error && error.length <= 25 ? error : undefined;
  const remaining = maxLength === undefined ? undefined : maxLength - countSymbols(value);
  const showRemaining = remaining !== undefined && remaining < 10;
  const overLimit = remaining !== undefined && remaining < 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (entityEdit) {
      entityEdit?.handleFieldChange(e.target.value, entityEdit?.fieldName, entityEdit.arrayIndex);
    };
  };

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        type={htmlType}
        id={id}
        className={`input-field peer ${showRemaining ? 'pr-12!' : ''} ${error || overLimit ? 'input-field-border-error' : 'input-field-border'} `}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={handleChange}     
        min={min}
        max={max}
        value={value}
      />

      {showRemaining && (
        <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-sm pointer-events-none ${overLimit ? 'text-(--color-text-danger)' : 'text-(--color-text-gray)'}`}>
          {remaining}
        </span>
      )}

      <FloatingLabel 
        id={id}
        label={label}
        placeholder={!!(isFocused || value.length > 0 || shortError)} 
        labelBGColor={labelBGColor}    
        error={shortError}    
      />

      {error && !shortError && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

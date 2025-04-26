import { useState } from 'react';
import { EntityEdit } from '../types/entities';

interface ToggleSwitchProps {
  label: string;
  labelPosition?: 'left' | 'right';
  setValue?: boolean;
  entityEdit?: EntityEdit;
}

export const ToggleSwitch = ({
  label,
  labelPosition = 'left',
  setValue = false,
  entityEdit
}: ToggleSwitchProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [toggleValue, switchToggleValue] = useState<boolean>(setValue);

  const handleInputChange = () => {
    entityEdit?.handleFieldChange(String(!toggleValue));
    switchToggleValue(!toggleValue)
  };

  return (
    <div className="flex items-center gap-3">
      {/* Left label */}
      {labelPosition === 'left' && (
        <label className={`text-sm ${isFocused ? 'text-blue-500' : 'text-gray-600'}`}>
          {label}
        </label>
      )}

      {/* Square iOS-style switch */}
      <button
        type="button"
        onClick={handleInputChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`
          relative w-12 h-6 rounded-md transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-blue-200
          ${toggleValue ? 'bg-blue-500' : 'bg-gray-300'}
        `}
      >
        {/* Thumb */}
        <span
          className={`
            absolute top-0.5 h-5 w-5 rounded-[4px] bg-white shadow-sm
            transition-transform duration-200
            ${toggleValue ? 'translate-x-0.5' : '-translate-x-5.5'}
          `}
        />
      </button>

      {/* Right label */}
      {labelPosition === 'right' && (
        <label className={`text-sm ${isFocused ? 'text-blue-500' : 'text-gray-600'}`}>
          {label}
        </label>
      )}
    </div>
  );
};
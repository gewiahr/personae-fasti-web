import { useState } from 'react';
import type { EntityEdit } from '../../types/entities';

interface ToggleSwitchProps {
  label: string;
  labelPosition?: 'left' | 'right';
  setValue?: boolean;
  entityEdit?: EntityEdit;
  className?: string;
}

export const ToggleSwitch = ({
  label,
  labelPosition = 'left',
  setValue = false,
  entityEdit,
  className = ''
}: ToggleSwitchProps) => {
  const [toggleValue, switchToggleValue] = useState<boolean>(setValue);

  const handleInputChange = () => {
    if (entityEdit) entityEdit?.handleFieldChange(!toggleValue, entityEdit?.fieldName || "", entityEdit.arrayIndex);
    switchToggleValue(!toggleValue)
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>

      {labelPosition === 'left' && (
        <label className={`text-md ${toggleValue ? 'switch-label-on' : 'switch-label-off'}`}>
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={handleInputChange}
        className={`switch ${toggleValue ? 'switch-active' : 'switch-disabled'}`}
      >
        <span
          className={`
            absolute top-0.5 h-5 w-5 rounded-sm bg-white shadow-sm
            transition-transform duration-200
            ${toggleValue ? 'translate-x-0.5' : '-translate-x-5.5'}
          `}
        />
      </button>

      {labelPosition === 'right' && (
        <label className={`text-md ${toggleValue ? 'switch-label-on' : 'switch-label-off'}`}>
          {label}
        </label>
      )}

    </div>
  );
};
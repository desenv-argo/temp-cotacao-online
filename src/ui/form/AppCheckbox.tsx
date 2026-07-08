import React from 'react';
import { Checkbox } from 'primereact/checkbox';
import './form.css';

interface AppCheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  inputId?: string;
}

const AppCheckbox: React.FC<AppCheckboxProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  invalid = false,
  className = '',
  inputId,
}) => {
  return (
    <div className={`app-form-check ${className}`.trim()}>
      <Checkbox
        inputId={inputId}
        checked={checked}
        disabled={disabled}
        invalid={invalid}
        onChange={(event) => onChange?.(!!event.checked)}
      />
      {label ? <label htmlFor={inputId} className="app-form-check__label">{label}</label> : null}
    </div>
  );
};

export default AppCheckbox;

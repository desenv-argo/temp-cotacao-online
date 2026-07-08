import React from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import './form.css';

interface AppSwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const AppSwitch: React.FC<AppSwitchProps> = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`app-form-check ${className}`.trim()}>
      <InputSwitch
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(!!event.value)}
      />
      {label ? <span className="app-form-check__label">{label}</span> : null}
    </div>
  );
};

export default AppSwitch;

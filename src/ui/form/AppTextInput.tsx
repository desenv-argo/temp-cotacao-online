import React from 'react';
import { InputText } from 'primereact/inputtext';
import './form.css';

export interface AppTextInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  type?: string;
  maxLength?: number;
  /** Evita autofill do gestor de senhas em telas onde a senha deve começar vazia (ex.: edição de usuário). */
  autoComplete?: string;
  name?: string;
  id?: string;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

const AppTextInput = React.forwardRef<HTMLInputElement, AppTextInputProps>(
  ({ value = '', onChange, className = '', invalid = false, ...props }, ref) => {
    return (
      <InputText
        {...props}
        ref={ref}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
      />
    );
  }
);

AppTextInput.displayName = 'AppTextInput';

export default AppTextInput;

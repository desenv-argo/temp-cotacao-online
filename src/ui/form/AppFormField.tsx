import React from 'react';
import './form.css';

interface AppFormFieldProps {
  label?: React.ReactNode;
  required?: boolean;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AppFormField: React.FC<AppFormFieldProps> = ({
  label,
  required = false,
  helperText,
  errorText,
  children,
  className = '',
}) => {
  const message = errorText || helperText;

  return (
    <div className={`app-form-field ${className}`.trim()}>
      {label ? (
        <label className="app-form-field__label">
          {label}
          {required ? <span className="app-form-field__required">*</span> : null}
        </label>
      ) : null}
      {children}
      <div className={`app-form-field__message ${errorText ? 'is-error' : ''}`.trim()}>
        {message}
      </div>
    </div>
  );
};

export default AppFormField;

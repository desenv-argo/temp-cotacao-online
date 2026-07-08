import React, { useId } from 'react';
import { FloatLabel } from 'primereact/floatlabel';
import { InputTextarea } from 'primereact/inputtextarea';
import './form.css';

interface AppTextareaProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  rows?: number;
  autoResize?: boolean;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  /** Rótulo no estilo outlined (Prime FloatLabel), alinhado aos demais campos da linha. */
  label?: string;
}

const AppTextarea: React.FC<AppTextareaProps> = ({
  value = '',
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  rows = 4,
  autoResize: autoResizeProp,
  label,
  ...props
}) => {
  const id = useId();
  const autoResize =
    autoResizeProp ?? (label ? false : true);

  const controlClass = `app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim();

  const field = (
    <InputTextarea
      {...props}
      id={id}
      rows={rows}
      autoResize={autoResize}
      value={value}
      placeholder={label ? (placeholder ?? ' ') : placeholder}
      disabled={disabled}
      invalid={invalid}
      onChange={(event) => onChange?.(event.target.value)}
      className={controlClass}
    />
  );

  if (label) {
    const compactFloatClass = rows <= 1 ? ' app-form-control-float-label--match-input-row' : '';

    return (
      <div className={`app-form-control-float-label${compactFloatClass}`}>
        <FloatLabel>
          {field}
          <label htmlFor={id}>{label}</label>
        </FloatLabel>
      </div>
    );
  }

  return field;
};

export default AppTextarea;

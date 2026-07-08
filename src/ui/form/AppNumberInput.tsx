import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import './form.css';

interface AppNumberInputProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  min?: number;
  max?: number;
  minFractionDigits?: number;
  maxFractionDigits?: number;
  useGrouping?: boolean;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  suffix?: string;
  prefix?: string;
}

const AppNumberInput: React.FC<AppNumberInputProps> = ({
  value = null,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  min,
  max,
  minFractionDigits,
  maxFractionDigits,
  useGrouping = false,
  onBlur,
  onFocus,
  suffix,
  prefix,
}) => {
  const [showEmptyWhileFocused, setShowEmptyWhileFocused] = React.useState(false);
  const numericValue = typeof value === 'number' ? value : (value ?? null);
  const displayValue = showEmptyWhileFocused && (numericValue === 0 || numericValue === null)
    ? null
    : numericValue;

  return (
    <InputNumber
      value={displayValue}
      onValueChange={(event) => {
        setShowEmptyWhileFocused(false);
        onChange?.(event.value ?? null);
      }}
      placeholder={placeholder}
      disabled={disabled}
      min={min}
      max={max}
      minFractionDigits={minFractionDigits}
      maxFractionDigits={maxFractionDigits}
      useGrouping={useGrouping}
      suffix={suffix}
      prefix={prefix}
      onBlur={(event) => {
        setShowEmptyWhileFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        if (numericValue === 0 || numericValue === null) {
          setShowEmptyWhileFocused(true);
        }
        onFocus?.(event);
      }}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
      inputClassName={invalid ? 'is-invalid' : undefined}
    />
  );
};

export default AppNumberInput;

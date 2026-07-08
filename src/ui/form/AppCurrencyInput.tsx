import React from 'react';
import { InputNumber } from 'primereact/inputnumber';
import './form.css';

interface AppCurrencyInputProps {
  value?: number | null;
  onChange?: (value: number | null) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  currency?: string;
  locale?: string;
  min?: number;
  max?: number;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  useGrouping?: boolean;
  /** Prime `InputNumber` — para foco/scroll em validação. */
  inputRef?: React.Ref<HTMLInputElement>;
  inputId?: string;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  inputStyle?: React.CSSProperties;
}

const AppCurrencyInput: React.FC<AppCurrencyInputProps> = ({
  value = null,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  currency = 'BRL',
  locale = 'pt-BR',
  min,
  max,
  onBlur,
  onFocus,
  useGrouping = true,
  inputRef,
  inputId,
  onKeyDown,
  inputStyle,
}) => {
  const [showEmptyWhileFocused, setShowEmptyWhileFocused] = React.useState(false);
  const numericValue = typeof value === 'number' ? value : (value ?? null);
  const displayValue = showEmptyWhileFocused && (numericValue === 0 || numericValue === null)
    ? null
    : numericValue;

  return (
    <InputNumber
      inputId={inputId}
      inputRef={inputRef}
      value={displayValue}
      onKeyDown={onKeyDown}
      inputStyle={inputStyle}
      onValueChange={(event) => {
        setShowEmptyWhileFocused(false);
        onChange?.(event.value ?? null);
      }}
      placeholder={placeholder}
      disabled={disabled}
      mode="currency"
      currency={currency}
      locale={locale}
      min={min}
      max={max}
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
      useGrouping={useGrouping}
      minFractionDigits={2}
      maxFractionDigits={2}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
      inputClassName={invalid ? 'is-invalid' : undefined}
    />
  );
};

export default AppCurrencyInput;

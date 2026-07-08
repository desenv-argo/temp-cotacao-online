import React, { useMemo } from 'react';
import { Calendar } from 'primereact/calendar';
import './form.css';

export interface AppYearPickerProps {
  value: number;
  onChange?: (year: number) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | null;
}

const AppYearPicker: React.FC<AppYearPickerProps> = ({
  value,
  onChange,
  label = 'Ano',
  helperText = '',
  placeholder = 'Selecione o ano',
  disabled = false,
  invalid = false,
  className = '',
  minYear: minYearProp,
  maxYear: maxYearProp,
  appendTo,
}) => {
  const todayYear = useMemo(() => new Date().getFullYear(), []);
  const minYear = minYearProp ?? todayYear - 2;
  const maxYear = maxYearProp ?? todayYear + 15;
  const yearRange = `${minYear}:${maxYear}`;
  const dateValue = useMemo(() => new Date(value, 0, 1), [value]);

  return (
    <div className={`app-year-picker ${className}`.trim()}>
      {label ? <label className="app-form-field__label">{label}</label> : null}
      <Calendar
        value={dateValue}
        onChange={(event) => {
          const next = event.value as Date | null;
          if (next && !Number.isNaN(next.getTime())) {
            onChange?.(next.getFullYear());
          }
        }}
        view="year"
        dateFormat="yy"
        formatDateTime={(date) => String(date.getFullYear())}
        yearRange={yearRange}
        showIcon={false}
        readOnlyInput
        disabled={disabled}
        placeholder={placeholder}
        className={`app-form-control${invalid ? ' is-invalid' : ''}`.trim()}
        {...(appendTo != null ? { appendTo } : {})}
      />
      {helperText ? (
        <div className={`app-form-field__message${invalid ? ' is-error' : ''}`.trim()}>{helperText}</div>
      ) : null}
    </div>
  );
};

export default AppYearPicker;

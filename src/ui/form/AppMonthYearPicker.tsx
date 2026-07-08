import React, { useMemo } from 'react';
import { Calendar } from 'primereact/calendar';
import './form.css';

export interface AppMonthYearPickerProps {
  month: number;
  year: number;
  onChange?: (month: number, year: number) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  minYear?: number;
  maxYear?: number;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | null;
  baseZIndex?: number;
  panelClassName?: string;
}

/** Seletor mês/ano (PrimeReact `Calendar` com `view="month"`). */
const AppMonthYearPicker: React.FC<AppMonthYearPickerProps> = ({
  month,
  year,
  onChange,
  placeholder = 'mm/aa',
  disabled = false,
  invalid = false,
  className = '',
  minYear = 2000,
  maxYear = 2100,
  appendTo,
  baseZIndex,
  panelClassName,
}) => {
  const dateValue = useMemo(() => {
    const m = Math.min(12, Math.max(1, Math.trunc(month) || 1));
    const y = Math.min(maxYear, Math.max(minYear, Math.trunc(year) || minYear));
    return new Date(y, m - 1, 1);
  }, [month, year, minYear, maxYear]);

  const minDate = useMemo(() => new Date(minYear, 0, 1), [minYear]);
  const maxDate = useMemo(() => new Date(maxYear, 11, 31), [maxYear]);

  return (
    <Calendar
      value={dateValue}
      onChange={(event) => {
        const next = event.value as Date | null;
        if (next && !Number.isNaN(next.getTime())) {
          onChange?.(next.getMonth() + 1, next.getFullYear());
        }
      }}
      view="month"
      dateFormat="mm/yy"
      minDate={minDate}
      maxDate={maxDate}
      showIcon
      readOnlyInput
      disabled={disabled}
      placeholder={placeholder}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
      appendTo={appendTo ?? (typeof document !== 'undefined' ? document.body : undefined)}
      baseZIndex={baseZIndex}
      panelClassName={panelClassName}
    />
  );
};

export default AppMonthYearPicker;

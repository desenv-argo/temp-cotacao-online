import React from 'react';
import { Calendar } from 'primereact/calendar';
import './form.css';

export type AppDatePickerValue = Date | null | (Date | null)[];

interface AppDatePickerProps<TValue extends AppDatePickerValue = Date | null> {
  value: TValue;
  onChange?: (value: TValue) => void;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  showIcon?: boolean;
  dateFormat?: string;
  selectionMode?: 'single' | 'multiple' | 'range';
  /** Prime `Calendar` — para foco/scroll em validação. */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Garante que o overlay do calendário fique acima de Dialog/Drawer.
   * Por padrão, anexamos no `document.body` (evita clipping) e deixamos o z-index configurável.
   */
  appendTo?: HTMLElement | 'self' | null;
  baseZIndex?: number;
  panelClassName?: string;
  footerTemplate?: () => React.ReactNode;
}

const AppDatePicker = <TValue extends AppDatePickerValue = Date | null>({
  value,
  onChange,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  showIcon = true,
  dateFormat = 'dd/mm/yy',
  selectionMode = 'single',
  inputRef,
  appendTo,
  baseZIndex,
  panelClassName,
  footerTemplate,
}: AppDatePickerProps<TValue>) => {
  return (
    <Calendar
      value={value}
      onChange={(event) => onChange?.((event.value ?? null) as TValue)}
      placeholder={placeholder}
      disabled={disabled}
      showIcon={showIcon}
      dateFormat={dateFormat}
      selectionMode={selectionMode}
      inputRef={inputRef}
      appendTo={appendTo ?? (typeof document !== 'undefined' ? document.body : undefined)}
      baseZIndex={baseZIndex}
      panelClassName={panelClassName}
      footerTemplate={footerTemplate}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
    />
  );
};

export default AppDatePicker;

import React from 'react';
import { AutoComplete } from 'primereact/autocomplete';
import { Button } from 'primereact/button';
import './form.css';

interface AppAutocompleteProps {
  value: any | null;
  onChange?: (value: any | null) => void;
  suggestions: any[];
  completeMethod?: (query: string) => void;
  field?: string;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  dropdown?: boolean;
  forceSelection?: boolean;
  quickCreateLabel?: string;
  onQuickCreate?: () => void;
}

const AppAutocomplete: React.FC<AppAutocompleteProps> = ({
  value,
  onChange,
  suggestions,
  completeMethod,
  field,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  dropdown = false,
  forceSelection = true,
  quickCreateLabel = 'Novo cadastro',
  onQuickCreate,
}) => {
  const panelFooterTemplate = onQuickCreate
    ? () => (
        <div className="app-form-control__quick-create">
          <Button
            type="button"
            label={quickCreateLabel}
            icon="pi pi-plus-circle"
            text
            rounded
            onClick={onQuickCreate}
          />
        </div>
      )
    : undefined;

  return (
    <AutoComplete
      value={value}
      suggestions={suggestions}
      completeMethod={(event) => completeMethod?.(event.query)}
      field={field}
      placeholder={placeholder}
      disabled={disabled}
      dropdown={dropdown}
      forceSelection={forceSelection}
      onChange={(event) => onChange?.(event.value ?? null)}
      panelFooterTemplate={panelFooterTemplate}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
    />
  );
};

export default AppAutocomplete;

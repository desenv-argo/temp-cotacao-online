import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import type { DropdownProps } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import type { VirtualScrollerProps } from 'primereact/virtualscroller';
import './form.css';

interface AppSelectProps<TValue, TOption = TValue> {
  value: TValue | null | undefined;
  onChange?: (value: TValue | null) => void;
  /** Linhas do dropdown; podem ser o próprio `TValue` (ex.: entidade) ou objetos com `optionValue` (ex.: `{ label, value }`). */
  options: TOption[];
  optionLabel?: string;
  optionValue?: string;
  /** Uniq key field when value is an object (avoids empty selection when instances differ). */
  dataKey?: string;
  /** Comma-separated fields for client filter (Prime `filterBy`). */
  filterBy?: string;
  itemTemplate?: (option: TOption) => React.ReactNode;
  valueTemplate?: (option: TOption) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  className?: string;
  filter?: boolean;
  /** Se omitido, segue o filtro ativo (foco no campo de busca ao abrir). Use `false` para abrir o painel sem roubar foco. */
  filterInputAutoFocus?: boolean;
  showClear?: boolean;
  filterPlaceholder?: string;
  emptyMessage?: string;
  emptyFilterMessage?: string;
  quickCreateLabel?: string;
  /** Recebe o texto digitado no filtro (quando `filter` está ativo). */
  onQuickCreate?: (search?: string) => void;
  appendTo?: 'self' | HTMLElement | (() => HTMLElement) | null;
  loading?: boolean;
  virtualScrollerOptions?: VirtualScrollerProps;
  onShow?: () => void;
  onHide?: () => void;
  panelClassName?: string;
  scrollHeight?: string;
}

const SEARCH_LIST_ITEM_HEIGHT = 44;
const SEARCH_LIST_MAX_VISIBLE_ITEMS = 3;
const SEARCH_LIST_MAX_HEIGHT = `${SEARCH_LIST_ITEM_HEIGHT * SEARCH_LIST_MAX_VISIBLE_ITEMS}px`;

function AppSelect<TValue, TOption = TValue>({
  value,
  onChange,
  options,
  optionLabel,
  optionValue,
  dataKey,
  filterBy,
  itemTemplate,
  valueTemplate,
  placeholder,
  disabled = false,
  invalid = false,
  className = '',
  filter = false,
  filterInputAutoFocus,
  showClear = false,
  filterPlaceholder,
  emptyMessage = 'Nenhum registro encontrado',
  emptyFilterMessage = 'Nenhum resultado encontrado',
  quickCreateLabel = 'Novo cadastro',
  onQuickCreate,
  appendTo,
  loading = false,
  virtualScrollerOptions,
  onShow,
  onHide,
  panelClassName = '',
  scrollHeight,
}: AppSelectProps<TValue, TOption>) {
  const filterRef = React.useRef('');

  /** PrimeReact chama `valueTemplate` com `null` quando não há seleção — templates devem ser nulos-safe. */
  const safeValueTemplate = React.useMemo(() => {
    if (!valueTemplate) return undefined;
    return ((option: unknown) => {
      if (option == null) return null;
      return valueTemplate(option as TOption);
    }) as DropdownProps['valueTemplate'];
  }, [valueTemplate]);

  const safeItemTemplate = React.useMemo(() => {
    if (!itemTemplate) return undefined;
    return ((option: unknown) => {
      if (option == null) return null;
      return itemTemplate(option as TOption);
    }) as DropdownProps['itemTemplate'];
  }, [itemTemplate]);

  const panelFooterTemplate = onQuickCreate
    ? () => (
        <div className="app-form-control__quick-create">
          <div className="app-form-control__quick-create-hint">
            Cadastro rapido
          </div>
          <Button
            type="button"
            label={quickCreateLabel}
            icon="pi pi-plus-circle"
            text
            onClick={() => onQuickCreate(filterRef.current.trim() || undefined)}
          />
        </div>
      )
    : undefined;

  return (
    <Dropdown
      value={value ?? null}
      onChange={(event) => onChange?.((event.value ?? null) as TValue | null)}
      options={options}
      optionLabel={optionLabel}
      optionValue={optionValue}
      dataKey={dataKey}
      filterBy={filterBy}
      itemTemplate={safeItemTemplate}
      valueTemplate={safeValueTemplate}
      placeholder={placeholder}
      disabled={disabled}
      filter={filter}
      filterInputAutoFocus={filterInputAutoFocus ?? filter}
      onFilter={(ev) => {
        filterRef.current = (ev.filter ?? '') as string;
      }}
      showClear={showClear}
      scrollHeight={
        scrollHeight ??
        (virtualScrollerOptions ? '200px' : filter ? SEARCH_LIST_MAX_HEIGHT : undefined)
      }
      pt={{
        clearIcon: { tabIndex: -1 },
      }}
      filterPlaceholder={filterPlaceholder}
      emptyMessage={emptyMessage}
      emptyFilterMessage={emptyFilterMessage}
      panelFooterTemplate={panelFooterTemplate}
      appendTo={appendTo}
      loading={loading}
      virtualScrollerOptions={virtualScrollerOptions}
      onShow={onShow}
      onHide={onHide}
      panelClassName={`app-form-select-panel${loading ? ' app-form-select-panel--soft-loading' : ''} ${panelClassName}`.trim()}
      className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
    />
  );
}

export default AppSelect;

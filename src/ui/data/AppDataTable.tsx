import React from 'react';
import { useMediaQuery } from '@mui/material';
import {
  DataTable,
  type DataTableSortEvent,
  type DataTableSelectionMultipleChangeEvent,
  type DataTableSelectionSingleChangeEvent,
  type DataTableValueArray,
} from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import './data.css';

type AppDataTableAlign = 'left' | 'center' | 'right';

export interface AppDataTableColumn {
  field: string;
  /** Incluir estado externo para forçar remount se o body não atualizar (Prime DataTable). */
  columnKey?: string;
  header: React.ReactNode;
  /** Rótulo no cartão mobile quando `header` não é texto simples. */
  mobileLabel?: string;
  body?: (rowData: any) => React.ReactNode;
  sortable?: boolean;
  style?: React.CSSProperties;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  align?: AppDataTableAlign;
}

interface AppDataTableProps<TValue extends DataTableValueArray> {
  value: TValue;
  columns: AppDataTableColumn[];
  loading?: boolean;
  emptyMessage?: React.ReactNode;
  dataKey?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  stripedRows?: boolean;
  showGridlines?: boolean;
  size?: 'small' | 'normal' | 'large';
  sortField?: string;
  sortOrder?: 1 | 0 | -1 | null | undefined;
  onSort?: (event: DataTableSortEvent) => void;
  rowClassName?: (rowData: TValue[number]) => string | object;
  /** Seleção (Prime DataTable). Quando informado, habilita seleção. */
  selection?: TValue[number] | TValue;
  onSelectionChange?: (selection: TValue[number] | TValue | null) => void;
  /** Por padrão, as telas usam checkbox (seleção múltipla). */
  selectionMode?: 'single' | 'multiple' | 'checkbox';
  /**
   * Quando muda, remonta a tabela (desktop e cartões mobile). Útil quando células com estado externo
   * (ex.: checkbox controlado fora do Prime) não atualizam visualmente após `setState`.
   */
  remountKey?: string;
}

function resolveAlignClassName(align?: AppDataTableAlign): string {
  if (!align || align === 'left') return '';
  return `app-data-table__align--${align}`;
}

function resolveMobileLabel(column: Pick<AppDataTableColumn, 'header' | 'field' | 'mobileLabel'>): string {
  if (column.mobileLabel) return column.mobileLabel;
  const header = column.header;
  if (typeof header === 'string') return header;
  if (typeof header === 'number') return String(header);
  return column.field;
}

function resolveRowKey(rowData: unknown, index: number, dataKey?: string): string {
  if (dataKey && rowData && typeof rowData === 'object' && dataKey in (rowData as any)) {
    return String((rowData as Record<string, unknown>)[dataKey] ?? index);
  }
  return String(index);
}

function isRowSelected<TValue extends DataTableValueArray>(
  selection: TValue[number] | TValue | undefined,
  row: TValue[number],
  rowKey: string,
  dataKey?: string
): boolean {
  if (!selection) return false;
  if (Array.isArray(selection)) {
    return selection.some((item, idx) => {
      const itemKey = resolveRowKey(item, idx, dataKey);
      return itemKey === rowKey;
    });
  }
  // seleção single
  return resolveRowKey(selection, 0, dataKey) === rowKey;
}

function toggleRowSelection<TValue extends DataTableValueArray>(
  selection: TValue[number] | TValue | undefined,
  row: TValue[number],
  rowKey: string,
  dataKey?: string
): TValue {
  const current = Array.isArray(selection) ? selection : selection ? [selection] : [];
  const exists = current.some((item, idx) => resolveRowKey(item, idx, dataKey) === rowKey);
  if (exists) {
    return current.filter((item, idx) => resolveRowKey(item, idx, dataKey) !== rowKey) as TValue;
  }
  return [...current, row] as TValue;
}

function AppDataTable<TValue extends DataTableValueArray>({
  value,
  columns,
  loading = false,
  emptyMessage = 'Nenhum registro encontrado.',
  dataKey,
  header,
  footer,
  className = '',
  stripedRows = true,
  showGridlines = false,
  size = 'small',
  sortField,
  sortOrder,
  onSort,
  rowClassName,
  selection,
  onSelectionChange,
  selectionMode,
  remountKey,
}: AppDataTableProps<TValue>) {
  const hasRows = Array.isArray(value) && value.length > 0;
  const isMobile = useMediaQuery('(max-width: 960px)');
  const effectiveSelectionMode =
    selectionMode ?? (onSelectionChange ? 'checkbox' : undefined);
  const enableSelection = !!onSelectionChange && !!effectiveSelectionMode;

  return (
    <div className="app-data-table-responsive">
      {isMobile ? (
        <div
          key={remountKey ?? 'app-data-table-mobile'}
          className={`app-data-table app-data-table--mobile ${className}`.trim()}
        >
          {loading ? (
            <div className="app-data-table__mobile-state">Carregando...</div>
          ) : !hasRows ? (
            <div className="app-data-table__mobile-state">{emptyMessage}</div>
          ) : (
            value.map((rowData, index) => {
              const rowKey = resolveRowKey(rowData, index, dataKey);

              const customRowClassName = rowClassName?.(rowData);
              const resolvedRowClassName =
                typeof customRowClassName === 'string'
                  ? customRowClassName
                  : '';

              return (
                <article
                  key={rowKey}
                  className={`app-data-table__mobile-card ${resolvedRowClassName}`.trim()}
                >
                  {enableSelection && effectiveSelectionMode === 'checkbox' ? (
                    <div
                      className="app-data-table__mobile-row"
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                      }}
                    >
                      <span className="app-data-table__mobile-label">Selecionar</span>
                      <div className="app-data-table__mobile-value">
                        <Checkbox
                          inputId={`app-table-select-${rowKey}`}
                          checked={isRowSelected(selection as any, rowData as any, rowKey, dataKey)}
                          onChange={() => {
                            const next = toggleRowSelection(
                              selection as any,
                              rowData as any,
                              rowKey,
                              dataKey
                            );
                            onSelectionChange?.(next as any);
                          }}
                        />
                      </div>
                    </div>
                  ) : null}
                  {columns.map((column) => {
                    const content = column.body
                      ? column.body(rowData)
                      : String(
                          (rowData as Record<string, unknown>)?.[column.field] ?? '-'
                        );
                    const colKey = column.columnKey ?? column.field;

                    return (
                      <div
                        key={colKey}
                        className={`app-data-table__mobile-row ${column.field === 'actions' ? 'is-actions' : ''}`.trim()}
                      >
                        <span className="app-data-table__mobile-label">
                          {resolveMobileLabel(column)}
                        </span>
                        <div
                          className={`app-data-table__mobile-value ${resolveAlignClassName(column.align)}`.trim()}
                        >
                          {content}
                        </div>
                      </div>
                    );
                  })}
                </article>
              );
            })
          )}
        </div>
      ) : (
        <DataTable
          key={remountKey ?? 'app-data-table-desktop'}
          value={value}
          dataKey={dataKey}
          loading={loading}
          emptyMessage={emptyMessage}
          header={header}
          footer={footer}
          stripedRows={stripedRows}
          showGridlines={showGridlines}
          size={size}
          sortField={sortField}
          sortOrder={sortOrder}
          onSort={onSort}
          rowClassName={rowClassName}
          className={`app-data-table app-data-table--desktop ${className}`.trim()}
          responsiveLayout="scroll"
          selection={enableSelection ? (selection as any) : undefined}
          selectionMode={enableSelection ? (effectiveSelectionMode as any) : undefined}
          onSelectionChange={
            enableSelection
              ? (
                  event:
                    | DataTableSelectionMultipleChangeEvent<TValue>
                    | DataTableSelectionSingleChangeEvent<TValue>
                ) =>
                  onSelectionChange?.((event.value ?? null) as any)
              : undefined
          }
        >
          {enableSelection && effectiveSelectionMode === 'checkbox' ? (
            <Column
              selectionMode="multiple"
              headerStyle={{ width: '3rem' }}
              bodyStyle={{ width: '3rem' }}
              className="app-data-table__align--center"
              headerClassName="app-data-table__align--center"
            />
          ) : null}
          {columns.map((column) => {
            const alignClassName = resolveAlignClassName(column.align);
            const colKey = column.columnKey ?? column.field;

            return (
              <Column
                key={colKey}
                field={column.field}
                header={column.header}
                body={column.body}
                sortable={column.sortable}
                style={column.style}
                className={`${column.className || ''} ${alignClassName}`.trim()}
                headerClassName={`${column.headerClassName || ''} ${alignClassName}`.trim()}
                bodyClassName={`${column.bodyClassName || ''} ${alignClassName}`.trim()}
              />
            );
          })}
        </DataTable>
      )}
    </div>
  );
}

export default AppDataTable;

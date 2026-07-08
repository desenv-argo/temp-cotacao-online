import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, type DropdownProps } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import type { PaginatedApiResponse } from '../../types/api';
import './form.css';

const PAGE_SIZE = 50;
const LIST_ITEM_HEIGHT = 44;
const LIST_MAX_VISIBLE_ITEMS = 3;
const LIST_MAX_HEIGHT = `${LIST_ITEM_HEIGHT * LIST_MAX_VISIBLE_ITEMS}px`;

export type FetchPaginatedEntityFn<T> = (
  pageNumber: number,
  pageSize: number,
  searchTerm?: string
) => Promise<PaginatedApiResponse<T>>;

type Row<T> = T & { scrollLabel: string };

function defaultScrollLabel<T extends { id: number }>(item: T): string {
  const r = item as Record<string, unknown>;
  const code = String(r.code ?? '');
  const desc = String(r.description ?? '');
  if (code && desc) return `${code} - ${desc}`;
  return desc || code || String(r.id ?? '');
}

function toRow<T extends { id: number }>(item: T, itemLabel?: (item: T) => string): Row<T> {
  const scrollLabel = itemLabel ? itemLabel(item) : defaultScrollLabel(item);
  return { ...item, scrollLabel };
}

function stripRow<T>(row: Row<T> | null): T | null {
  if (!row) return null;
  const { scrollLabel: _s, ...rest } = row;
  return rest as T;
}

function readPage<T>(response: PaginatedApiResponse<T>): { page: T[]; hasNext: boolean } {
  if (!response || typeof response !== 'object') {
    return { page: [], hasNext: false };
  }
  const data = response.data;
  const page = Array.isArray(data?.page) ? data.page : [];
  const meta = data?.metadata as
    | { hasNext?: boolean; currentPage?: number; totalPages?: number }
    | undefined;
  let hasNext = Boolean(meta?.hasNext);
  if (
    !hasNext &&
    meta &&
    typeof meta.currentPage === 'number' &&
    typeof meta.totalPages === 'number'
  ) {
    hasNext = meta.currentPage < meta.totalPages;
  }
  if (!hasNext && page.length >= PAGE_SIZE) {
    hasNext = true;
  }
  return { page, hasNext };
}

export interface AppPaginatedEntitySelectProps<T extends { id: number }> {
  value: T | null;
  onChange: (value: T | null) => void;
  fetchPaginated: FetchPaginatedEntityFn<T>;
  placeholder?: string;
  disabled?: boolean;
  invalid?: boolean;
  filterPlaceholder?: string;
  emptyMessage?: string;
  emptyFilterMessage?: string;
  quickCreateLabel?: string;
  quickCreateHint?: string;
  /**
   * Habilita o rodapé de "cadastro rápido" no dropdown.
   * Recebe o texto atual digitado no filtro (mesmo que o valor ainda não exista).
   */
  onQuickCreate?: (search: string) => void;
  className?: string;
  appendTo?: DropdownProps['appendTo'];
  panelClassName?: string;
  /** Texto da opção e do valor exibido. Padrão: `código — descrição` quando existirem no item. */
  itemLabel?: (item: T) => string;
  /** Campos para o filtro client-side do Dropdown (padrão: `code,description,scrollLabel`). */
  filterBy?: string;
  /** Quando true, não busca no mount — só na primeira abertura do painel (ou ao filtrar). */
  loadOptionsOnOpen?: boolean;
}

/**
 * Combobox PrimeReact: 1ª página no mount + ao filtrar; próximas páginas ao rolar o listbox.
 * Sem VirtualScroller lazy (evita spinner até o usuário chegar no fim).
 */
function AppPaginatedEntitySelect<T extends { id: number }>({
  value,
  onChange,
  fetchPaginated,
  placeholder = 'Selecione…',
  disabled = false,
  invalid = false,
  filterPlaceholder = 'Buscar…',
  emptyMessage = 'Nenhum registro encontrado',
  emptyFilterMessage = 'Nenhum resultado encontrado',
  quickCreateLabel = 'Novo cadastro',
  quickCreateHint = 'Cadastro rapido',
  onQuickCreate,
  className = '',
  appendTo,
  panelClassName = '',
  itemLabel,
  filterBy = 'code,description,scrollLabel',
  loadOptionsOnOpen = false,
}: AppPaginatedEntitySelectProps<T>) {
  const [options, setOptions] = useState<Row<T>[]>([]);
  const [busyInitial, setBusyInitial] = useState(false);
  const [busyMore, setBusyMore] = useState(false);
  const filterRef = useRef('');
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingRemoteRef = useRef(false);
  /** Scroll container is `.p-dropdown-items-wrapper` (div), not the `ul` — see PrimeReact Dropdown. */
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const restoreScrollTopRef = useRef<number | null>(null);
  const previousOptionsLengthRef = useRef(0);
  const optionsLenRef = useRef(0);
  const filterDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const displayValue = useMemo(
    () => (value ? toRow(value, itemLabel) : null),
    [value, itemLabel]
  );

  const mergedOptions = useMemo(() => {
    if (!displayValue) return options;
    if (options.some((o) => o.id === displayValue.id)) return options;
    return [displayValue, ...options];
  }, [displayValue, options]);

  useEffect(() => {
    optionsLenRef.current = options.length;
  }, [options.length]);

  const runFetch = useCallback(
    async (page: number, append: boolean, search: string) => {
      if (loadingRemoteRef.current) return;
      loadingRemoteRef.current = true;
      if (append) {
        setBusyMore(true);
      } else {
        setBusyInitial(true);
      }
      try {
        const res = await fetchPaginated(page, PAGE_SIZE, search.trim() ? search.trim() : undefined);
        const { page: chunk, hasNext } = readPage(res);
        hasMoreRef.current = hasNext;
        const rows = chunk.map((item) => toRow(item, itemLabel));
        setOptions((prev) => {
          if (append) {
            const existing = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            for (const r of rows) {
              if (!existing.has(r.id)) {
                existing.add(r.id);
                merged.push(r);
              }
            }
            optionsLenRef.current = merged.length;
            return merged;
          }
          optionsLenRef.current = rows.length;
          return rows;
        });
        pageRef.current = page;
      } catch (err) {
        console.error('AppPaginatedEntitySelect fetch error:', err);
        hasMoreRef.current = false;
        if (!append) {
          setOptions([]);
          optionsLenRef.current = 0;
        }
      } finally {
        loadingRemoteRef.current = false;
        setBusyInitial(false);
        setBusyMore(false);
      }
    },
    [fetchPaginated, itemLabel]
  );

  const loadFirstPage = useCallback(
    (search: string) => {
      filterRef.current = search;
      void runFetch(1, false, search);
    },
    [runFetch]
  );

  const scheduleFilterFetch = useCallback(
    (filter: string) => {
      if (filterDebounceRef.current) {
        clearTimeout(filterDebounceRef.current);
      }
      filterDebounceRef.current = setTimeout(() => {
        loadFirstPage(filter);
      }, 300);
    },
    [loadFirstPage]
  );

  useEffect(() => {
    if (loadOptionsOnOpen) {
      return () => {
        if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
      };
    }
    loadFirstPage('');
    return () => {
      if (filterDebounceRef.current) clearTimeout(filterDebounceRef.current);
    };
  }, [loadFirstPage, loadOptionsOnOpen]);

  const handleItemsWrapperScroll = useCallback(
    (e: React.UIEvent<HTMLElement>) => {
      const el = e.currentTarget;
      scrollContainerRef.current = el as HTMLDivElement;
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;
      if (!nearBottom || !hasMoreRef.current || loadingRemoteRef.current) {
        return;
      }
      restoreScrollTopRef.current = el.scrollTop;
      previousOptionsLengthRef.current = optionsLenRef.current;
      void runFetch(pageRef.current + 1, true, filterRef.current);
    },
    [runFetch]
  );

  const virtualScrollerOptions = useMemo(
    () => ({
      itemSize: LIST_ITEM_HEIGHT,
      numToleratedItems: 12,
      onScroll: handleItemsWrapperScroll,
    }),
    [handleItemsWrapperScroll]
  );

  useLayoutEffect(() => {
    if (restoreScrollTopRef.current === null) return;
    const wrap = scrollContainerRef.current;
    if (!wrap) return;
    if (options.length <= previousOptionsLengthRef.current) {
      restoreScrollTopRef.current = null;
      return;
    }
    const target = restoreScrollTopRef.current;
    wrap.scrollTop = target;
    requestAnimationFrame(() => {
      if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = target;
    });
    restoreScrollTopRef.current = null;
  }, [options.length]);

  const handlePanelShow = useCallback(() => {
    if (optionsLenRef.current === 0 && !loadingRemoteRef.current) {
      void runFetch(1, false, filterRef.current);
    }
  }, [runFetch]);

  const onFilter: DropdownProps['onFilter'] = (ev) => {
    const next = ev.filter ?? '';
    filterRef.current = next;
    scheduleFilterFetch(next);
  };

  const itemTemplate = useCallback(
    (row: Row<T>) => (
      <span className="app-paginated-entity-select__item-text" title={row.scrollLabel}>
        {row.scrollLabel}
      </span>
    ),
    []
  );

  const loadingMoreFooter = useCallback(
    () => (
      <div className="app-paginated-entity-select__loading-more" role="status">
        Carregando mais…
      </div>
    ),
    []
  );

  const quickCreateFooter = useCallback(() => {
    if (!onQuickCreate) return null;
    const search = (filterRef.current ?? '').trim();
    return (
      <div className="app-form-control__quick-create">
        <div className="app-form-control__quick-create-hint">{quickCreateHint}</div>
        <Button
          type="button"
          label={quickCreateLabel}
          icon="pi pi-plus-circle"
          text
          onClick={() => onQuickCreate(search)}
        />
      </div>
    );
  }, [onQuickCreate, quickCreateHint, quickCreateLabel]);

  const panelFooterTemplate = useMemo(() => {
    if (busyMore) return loadingMoreFooter;
    if (onQuickCreate) return quickCreateFooter;
    return undefined;
  }, [busyMore, loadingMoreFooter, onQuickCreate, quickCreateFooter]);

  return (
    <div className="app-paginated-entity-select-root">
      <Dropdown
        value={displayValue}
        onChange={(ev) => onChange(stripRow((ev.value ?? null) as Row<T> | null))}
        options={mergedOptions}
        optionLabel="scrollLabel"
        dataKey="id"
        itemTemplate={itemTemplate}
        filter
        filterBy={filterBy}
        onFilter={onFilter}
        filterPlaceholder={filterPlaceholder}
        filterInputAutoFocus
        showClear
        scrollHeight={LIST_MAX_HEIGHT}
        virtualScrollerOptions={virtualScrollerOptions}
        pt={{
          clearIcon: { tabIndex: -1 },
        }}
        placeholder={placeholder}
        disabled={disabled}
        emptyMessage={emptyMessage}
        emptyFilterMessage={emptyFilterMessage}
        onShow={handlePanelShow}
        loading={busyInitial}
        panelFooterTemplate={panelFooterTemplate}
        appendTo={appendTo === undefined ? 'self' : appendTo}
        className={`app-form-control${invalid ? ' is-invalid' : ''} ${className}`.trim()}
        panelClassName={`app-form-select-panel app-paginated-entity-select-panel ${panelClassName}`.trim()}
      />
    </div>
  );
}

export default AppPaginatedEntitySelect;

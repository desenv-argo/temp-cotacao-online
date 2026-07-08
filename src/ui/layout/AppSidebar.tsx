import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { ScrollPanel } from 'primereact/scrollpanel';
import { Sidebar } from 'primereact/sidebar';
import { useLocation, useNavigate } from 'react-router-dom';
import './layout.css';

export interface AppSidebarItem {
  id?: string;
  label: string;
  icon?: string;
  path?: string;
  disabled?: boolean;
  badge?: string | number;
  onClick?: () => void;
  /** Quando presente, o item vira um subgrupo expansível (sem navegação própria). */
  items?: AppSidebarItem[];
}

export interface AppSidebarGroup {
  id?: string;
  label: string;
  icon?: string;
  items: AppSidebarItem[];
  badge?: string | number;
}

interface AppSidebarProps {
  brandName: string;
  brandLogoSrc?: string;
  brandIcon?: string;
  showBrand?: boolean;
  homeItem?: AppSidebarItem;
  quickAccessItems?: AppSidebarItem[];
  groups: AppSidebarGroup[];
  footerItems?: AppSidebarItem[];
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
  mobileVisible?: boolean;
  onHideMobile?: () => void;
  /** Chamado ao navegar por item com `path` (ex.: contagem de “Mais usados” na sessão). */
  onMenuPathNavigate?: (path: string) => void;
}

const getItemKey = (item: AppSidebarItem) => item.id || item.path || item.label;
const getGroupKey = (group: AppSidebarGroup) => group?.id ?? group?.label ?? '';

const isSubgroup = (item: AppSidebarItem): boolean =>
  Array.isArray(item.items) && item.items.length > 0;

/** Achata uma árvore de itens nas folhas navegáveis (para o modo recolhido e contagem). */
const collectLeafItems = (items: AppSidebarItem[]): AppSidebarItem[] =>
  items.flatMap((item) => (isSubgroup(item) ? collectLeafItems(item.items as AppSidebarItem[]) : [item]));

const QUICK_ACCESS_COLLAPSED_STORAGE_KEY = 'argo.sidebar.quickAccessCollapsed';

function readQuickAccessCollapsedPreference(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(QUICK_ACCESS_COLLAPSED_STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  brandName,
  brandLogoSrc,
  brandIcon = 'pi pi-box',
  showBrand = true,
  homeItem,
  quickAccessItems = [],
  groups,
  footerItems = [],
  collapsed = false,
  onToggleCollapsed,
  mobileVisible = false,
  onHideMobile,
  onMenuPathNavigate,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const resolveItemActive = useCallback(
    (item: AppSidebarItem) => !!item.path && location.pathname.startsWith(item.path),
    [location.pathname]
  );

  // Ativo em profundidade: um subgrupo está ativo quando qualquer descendente está.
  const isItemActiveDeep = useCallback(
    function check(item: AppSidebarItem): boolean {
      return isSubgroup(item)
        ? (item.items as AppSidebarItem[]).some(check)
        : resolveItemActive(item);
    },
    [resolveItemActive]
  );

  const initialExpandedGroup = useMemo(() => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/dashboard/') {
      return null;
    }
    const activeGroup = groups.find((group) => group.items.some(isItemActiveDeep));
    if (activeGroup) return getGroupKey(activeGroup);
    const first = groups[0];
    return first ? getGroupKey(first) : null;
  }, [groups, isItemActiveDeep, location.pathname]);

  const [expandedGroup, setExpandedGroup] = useState<string | null>(initialExpandedGroup);

  // Subgrupos abertos por padrão: os que contêm a rota ativa.
  const initialExpandedSubgroups = useMemo(() => {
    const keys = new Set<string>();
    groups.forEach((group) => {
      const groupKey = getGroupKey(group);
      group.items.forEach((item) => {
        if (isSubgroup(item) && isItemActiveDeep(item)) {
          keys.add(`${groupKey}/${getItemKey(item)}`);
        }
      });
    });
    return keys;
  }, [groups, isItemActiveDeep]);

  const [expandedSubgroups, setExpandedSubgroups] = useState<Set<string>>(initialExpandedSubgroups);

  useEffect(() => {
    setExpandedSubgroups(initialExpandedSubgroups);
  }, [initialExpandedSubgroups]);

  const toggleSubgroup = useCallback((key: string) => {
    setExpandedSubgroups((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const [quickAccessCollapsed, setQuickAccessCollapsed] = useState(readQuickAccessCollapsedPreference);

  useEffect(() => {
    setExpandedGroup(initialExpandedGroup);
  }, [initialExpandedGroup]);

  const toggleQuickAccessCollapsed = useCallback(() => {
    setQuickAccessCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(QUICK_ACCESS_COLLAPSED_STORAGE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  const flattenedItems = useMemo(
    () => collectLeafItems(groups.flatMap((group) => group.items)),
    [groups]
  );

  const handleItemClick = (item: AppSidebarItem) => {
    if (item.disabled) return;
    item.onClick?.();
    if (item.path) {
      onMenuPathNavigate?.(item.path);
      // Fecha o drawer antes da navegação para resposta imediata no mobile.
      onHideMobile?.();
      navigate(item.path);
      return;
    }
    onHideMobile?.();
  };

  const renderItem = (item: AppSidebarItem, iconOnly = false) => {
    const isActive = resolveItemActive(item);
    const className = [
      'app-sidebar__item',
      isActive ? 'is-active' : '',
      item.disabled ? 'is-disabled' : '',
    ].filter(Boolean).join(' ');

    return (
      <button
        key={getItemKey(item)}
        type="button"
        className={`${className} p-ripple`}
        onClick={() => handleItemClick(item)}
        title={iconOnly ? item.label : undefined}
      >
        {item.icon ? <i className={`${item.icon} app-sidebar__item-icon`} /> : null}
        {!iconOnly ? <span className="app-sidebar__item-label">{item.label}</span> : null}
        {!iconOnly && item.badge != null ? (
          <span className="app-sidebar__badge p-badge">{item.badge}</span>
        ) : null}
        <Ripple />
      </button>
    );
  };

  const renderSubgroup = (item: AppSidebarItem, parentKey: string) => {
    const key = `${parentKey}/${getItemKey(item)}`;
    const isExpanded = expandedSubgroups.has(key);
    const isActive = isItemActiveDeep(item);

    return (
      <div key={key} className="app-sidebar__subgroup">
        <button
          type="button"
          className={`app-sidebar__subgroup-trigger ${isActive ? 'is-active' : ''}`.trim()}
          onClick={() => toggleSubgroup(key)}
          aria-expanded={isExpanded ? 'true' : 'false'}
        >
          {item.icon ? <i className={`${item.icon} app-sidebar__item-icon`} /> : null}
          <span className="app-sidebar__item-label">{item.label}</span>
          {item.badge != null ? (
            <span className="app-sidebar__badge p-badge">{item.badge}</span>
          ) : null}
          <i className={`pi pi-angle-down app-sidebar__group-chevron ${isExpanded ? 'is-expanded' : ''}`} />
        </button>
        {isExpanded ? (
          <div className="app-sidebar__subgroup-items">
            {item.items?.map((child) =>
              isSubgroup(child) ? renderSubgroup(child, key) : renderItem(child)
            )}
          </div>
        ) : null}
      </div>
    );
  };

  const renderExpandedGroups = () => (
    <>
      {groups.map((group) => {
        const groupKey = getGroupKey(group);
        const isExpanded = expandedGroup === groupKey;
        const isActive = group.items.some(isItemActiveDeep);

        return (
          <div key={groupKey}>
            <button
              type="button"
              className={`app-sidebar__group-trigger ${isActive ? 'is-active' : ''}`.trim()}
              onClick={() => setExpandedGroup((current) => current === groupKey ? null : groupKey)}
            >
              {group.icon ? <i className={`${group.icon} app-sidebar__group-icon`} /> : null}
              <span className="app-sidebar__group-label">{group.label}</span>
              {group.badge != null ? (
                <span className="app-sidebar__group-badge">{group.badge}</span>
              ) : null}
              <i className={`pi pi-angle-down app-sidebar__group-chevron ${isExpanded ? 'is-expanded' : ''}`} />
            </button>
            {isExpanded ? (
              <div className="app-sidebar__group-items">
                {group.items.map((item) =>
                  isSubgroup(item) ? renderSubgroup(item, groupKey) : renderItem(item)
                )}
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );

  /** Função factory: cada chamada cria um elemento novo (evita um único nó React em desktop + Sidebar). */
  const renderPanel = () => (
    <div className={`app-sidebar app-sidebar__panel${collapsed ? ' app-sidebar--collapsed' : ''}`}>
      {showBrand ? (
        <div className="app-sidebar__brand">
          <div className="app-sidebar__brand-main">
            {brandLogoSrc ? (
              <img src={brandLogoSrc} alt={brandName} className="app-sidebar__brand-logo" />
            ) : (
              <i className={`${brandIcon} app-sidebar__brand-icon`} />
            )}
            {!collapsed ? <span className="app-sidebar__brand-name">{brandName}</span> : null}
          </div>
          {onToggleCollapsed ? (
            <Button
              type="button"
              icon={collapsed ? 'pi pi-angle-right' : 'pi pi-angle-left'}
              text
              rounded
              aria-label="Alternar menu"
              onClick={onToggleCollapsed}
            />
          ) : null}
        </div>
      ) : null}

      <ScrollPanel className="app-sidebar__scroll">
        {homeItem ? (
          <>
            <div className="app-sidebar__section-title">Principal</div>
            {renderItem(homeItem, collapsed)}
          </>
        ) : null}

        {quickAccessItems.length > 0 ? (
          <>
            {!collapsed ? (
              <button
                type="button"
                id="sidebar-quick-access-heading"
                className="app-sidebar__section-title app-sidebar__section-title--toggle"
                onClick={toggleQuickAccessCollapsed}
                aria-expanded={!quickAccessCollapsed}
                aria-controls="sidebar-quick-access-list"
              >
                <span>Mais usados</span>
                <i
                  className={`pi ${quickAccessCollapsed ? 'pi-angle-down' : 'pi-angle-up'} app-sidebar__section-chevron`}
                  aria-hidden
                />
              </button>
            ) : null}
            <div id="sidebar-quick-access-list" hidden={quickAccessCollapsed}>
              {!quickAccessCollapsed ? quickAccessItems.map((item) => renderItem(item, collapsed)) : null}
            </div>
          </>
        ) : null}

        <div className="app-sidebar__section-title">Navegacao</div>
        {collapsed
          ? flattenedItems.map((item) => renderItem(item, true))
          : renderExpandedGroups()}
      </ScrollPanel>

      {footerItems.length > 0 ? (
        <div className="app-sidebar__footer">
          {footerItems.map((item) => renderItem(item, collapsed))}
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div className={`app-sidebar__desktop${collapsed ? ' app-sidebar__desktop--collapsed' : ''}`.trim()}>
        {renderPanel()}
      </div>
      <Sidebar
        visible={mobileVisible}
        onHide={() => onHideMobile?.()}
        showCloseIcon
        dismissable
        className="app-sidebar__mobile"
      >
        {renderPanel()}
      </Sidebar>
    </>
  );
};

export default AppSidebar;

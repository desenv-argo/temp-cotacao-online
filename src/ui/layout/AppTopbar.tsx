import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import type { MenuItem } from 'primereact/menuitem';
import type { MenuSearchEntry } from '../../utils/menuSearchItems';
import './layout.css';

interface AppTopbarProps {
  brandName: string;
  brandLogoSrc?: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  /** Itens permitidos ao usuário (resultados da busca do menu). */
  searchResults?: MenuSearchEntry[];
  onSearchResultSelect?: (path: string) => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  searchPlaceholder?: string;
  notificationsBadge?: string | number;
  onNotificationsClick?: () => void;
  onSettingsClick?: () => void;
  userName?: string;
  userAvatarLabel?: string;
  userAvatarImage?: string;
  userMenuItems?: MenuItem[];
  actionsStart?: React.ReactNode;
  actionsEnd?: React.ReactNode;
  /** Substitui o sino padrão por um componente customizado (ex: CrmNotificationBell). */
  notificationsBellSlot?: React.ReactNode;
}

const getInitials = (name?: string) => {
  if (!name) return 'UE';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
};

const AppTopbar: React.FC<AppTopbarProps> = ({
  brandName,
  brandLogoSrc,
  onMenuClick,
  showSearch = true,
  searchValue = '',
  onSearchChange,
  searchResults = [],
  onSearchResultSelect,
  searchInputRef,
  searchPlaceholder = 'Buscar no menu...',
  notificationsBadge,
  onNotificationsClick,
  onSettingsClick,
  userName = 'Usuario ERP',
  userAvatarLabel,
  userAvatarImage,
  userMenuItems = [],
  actionsStart,
  actionsEnd,
  notificationsBellSlot,
}) => {
  const menuRef = useRef<Menu | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const normalizedUserMenuItems = useMemo<MenuItem[]>(
    () => (userMenuItems.length > 0 ? userMenuItems : [{ label: 'Perfil', icon: 'pi pi-user' }]),
    [userMenuItems]
  );

  const q = searchValue.trim();
  const hasResults = searchResults.length > 0;
  const showSearchPanel = searchFocused && q.length > 0 && showSearch && Boolean(onSearchResultSelect);
  const canSubmitFirst = hasResults && onSearchResultSelect;

  const selectPath = useCallback(
    (path: string) => {
      onSearchResultSelect?.(path);
      setSearchFocused(false);
    },
    [onSearchResultSelect]
  );

  const handleSearchKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        event.currentTarget.blur();
        setSearchFocused(false);
        return;
      }
      if (event.key === 'Enter' && canSubmitFirst) {
        event.preventDefault();
        selectPath(searchResults[0].path);
      }
    },
    [canSubmitFirst, searchResults, selectPath]
  );

  return (
    <header className="app-topbar">
      <div className="app-topbar__start">
        <Button
          type="button"
          icon="pi pi-bars"
          text
          rounded
          aria-label="Abrir menu"
          className="app-topbar__icon-button"
          onClick={onMenuClick}
        />
        <div className="app-topbar__brand">
          {brandLogoSrc ? (
            <img src={brandLogoSrc} alt={brandName} className="app-topbar__brand-logo" />
          ) : (
            <Avatar label={brandName[0]?.toUpperCase() || 'A'} shape="circle" />
          )}
          <span className="app-topbar__brand-name">{brandName}</span>
        </div>
        {actionsStart}
      </div>

      <div className="app-topbar__center">
        {showSearch ? (
          <div className="app-topbar__search-wrap">
            <div className="app-topbar__search">
              <IconField iconPosition="left">
                <InputIcon className="pi pi-search" />
                <InputText
                  ref={searchInputRef}
                  value={searchValue}
                  onChange={(event) => onSearchChange?.(event.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => {
                    window.setTimeout(() => setSearchFocused(false), 180);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={searchPlaceholder}
                  aria-label="Buscar no menu principal"
                  autoComplete="off"
                  spellCheck={false}
                />
              </IconField>
            </div>
            {showSearchPanel ? (
              <div className="app-topbar__search-panel" role="list" aria-label="Resultados da busca">
                {hasResults ? (
                  searchResults.map((entry) => (
                    <button
                      key={entry.path}
                      type="button"
                      className="app-topbar__search-option"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        selectPath(entry.path);
                      }}
                    >
                      {entry.icon ? <i className={entry.icon} aria-hidden /> : null}
                      <span className="app-topbar__search-option-main">
                        <span className="app-topbar__search-option-label">{entry.label}</span>
                        <span className="app-topbar__search-option-group">{entry.groupLabel}</span>
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="app-topbar__search-empty">Nenhum item encontrado</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="app-topbar__end">
        {actionsEnd}
        {notificationsBellSlot ?? (
          <>
            <Button
              type="button"
              icon="pi pi-bell"
              text
              rounded
              aria-label="Notificacoes"
              className="app-topbar__icon-button"
              onClick={onNotificationsClick}
            />
            {notificationsBadge ? (
              <Badge value={String(notificationsBadge)} severity="danger" />
            ) : null}
          </>
        )}
        {onSettingsClick ? (
          <Button
            type="button"
            icon="pi pi-cog"
            text
            rounded
            aria-label="Configuracoes"
            className="app-topbar__icon-button"
            onClick={onSettingsClick}
          />
        ) : null}
        <button
          type="button"
          className="app-topbar__user"
          onClick={(event) => menuRef.current?.toggle(event)}
        >
          <Avatar
            className="app-topbar__user-avatar"
            image={userAvatarImage}
            label={userAvatarLabel || getInitials(userName)}
            shape="circle"
          />
          <span className="app-topbar__user-name">{userName}</span>
          <i className="pi pi-angle-down" />
        </button>
        <Menu model={normalizedUserMenuItems} popup ref={menuRef} />
      </div>
    </header>
  );
};

export default AppTopbar;

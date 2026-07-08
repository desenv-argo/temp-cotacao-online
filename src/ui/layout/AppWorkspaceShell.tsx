import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { MenuItem } from 'primereact/menuitem';
import AppToast, { type AppToastRef } from '../feedback/AppToast';
import AppShell from './AppShell';
import AppSidebar from './AppSidebar';
import AppTopbar from './AppTopbar';
import { APP_BRAND_LOGO_SRC, APP_BRAND_NAME } from './appBrand';
import { AppWorkspaceProvider, useIsInsideAppWorkspace } from './AppWorkspaceContext';
import {
  APP_SIDEBAR_GROUPS,
  APP_SIDEBAR_HOME_ITEM,
  APP_SIDEBAR_QUICK_ACCESS_ITEMS,
} from './appNavigation';
import { filterMenuSearchEntries, flattenNavigableMenuItems } from '../../utils/menuSearchItems';

interface AppWorkspaceShellProps {
  children: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  showSearch?: boolean;
  userName?: string;
}

const AppWorkspaceShell: React.FC<AppWorkspaceShellProps> = ({
  children,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar no menu (Ctrl+B)',
  showSearch = true,
  userName = 'Ana Paula Silva',
}) => {
  const isInsideWorkspace = useIsInsideAppWorkspace();
  const navigate = useNavigate();
  const [internalMenuSearch, setInternalMenuSearch] = useState('');
  const isSearchControlled = onSearchChange !== undefined;
  const menuSearchQuery = isSearchControlled ? (searchValue ?? '') : internalMenuSearch;
  const setMenuSearchQuery = isSearchControlled ? onSearchChange! : setInternalMenuSearch;
  const globalToastRef = useRef<AppToastRef>(null);
  const mainMenuSearchInputRef = useRef<HTMLInputElement>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarVisible, setMobileSidebarVisible] = useState(false);

  const menuSearchEntries = useMemo(
    () => flattenNavigableMenuItems(APP_SIDEBAR_HOME_ITEM, APP_SIDEBAR_QUICK_ACCESS_ITEMS, APP_SIDEBAR_GROUPS),
    []
  );

  const menuSearchFiltered = useMemo(
    () => filterMenuSearchEntries(menuSearchEntries, menuSearchQuery),
    [menuSearchEntries, menuSearchQuery]
  );

  const handleMainMenuSearchSelect = useCallback(
    (path: string) => {
      navigate(path);
      setMenuSearchQuery('');
    },
    [navigate, setMenuSearchQuery]
  );

  useEffect(() => {
    if (!showSearch) return undefined;
    const input = mainMenuSearchInputRef.current;
    const onKeyDown = (e: KeyboardEvent) => {
      const isShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b';
      if (!isShortcut) return;
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target === input) return;
      const tag = target.tagName;
      if (tag === 'TEXTAREA') return;
      if (tag === 'INPUT' && target !== input) return;
      if (target.isContentEditable) return;
      e.preventDefault();
      input?.focus();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [showSearch]);

  const userMenuItems = useMemo<MenuItem[]>(
    () => [{ label: 'Perfil', icon: 'pi pi-user' }],
    []
  );

  if (isInsideWorkspace) {
    return <>{children}</>;
  }

  return (
    <AppWorkspaceProvider>
      <AppToast ref={globalToastRef} position="bottom-right" />
      <AppShell
        sidebarCollapsed={sidebarCollapsed}
        topbar={
          <AppTopbar
            brandName={APP_BRAND_NAME}
            brandLogoSrc={APP_BRAND_LOGO_SRC}
            showSearch={showSearch}
            searchValue={menuSearchQuery}
            onSearchChange={setMenuSearchQuery}
            searchResults={menuSearchFiltered}
            onSearchResultSelect={handleMainMenuSearchSelect}
            searchInputRef={mainMenuSearchInputRef}
            searchPlaceholder={searchPlaceholder}
            notificationsBadge={0}
            userName={userName}
            userAvatarLabel="AP"
            userMenuItems={userMenuItems}
            onMenuClick={() => {
              if (window.matchMedia('(max-width: 960px)').matches) {
                setMobileSidebarVisible(true);
                return;
              }
              setSidebarCollapsed((current) => !current);
            }}
          />
        }
        sidebar={
          <AppSidebar
            brandName={APP_BRAND_NAME}
            brandLogoSrc={APP_BRAND_LOGO_SRC}
            showBrand={false}
            homeItem={APP_SIDEBAR_HOME_ITEM}
            quickAccessItems={APP_SIDEBAR_QUICK_ACCESS_ITEMS}
            groups={APP_SIDEBAR_GROUPS}
            collapsed={sidebarCollapsed}
            onToggleCollapsed={() => setSidebarCollapsed((current) => !current)}
            mobileVisible={mobileSidebarVisible}
            onHideMobile={() => setMobileSidebarVisible(false)}
          />
        }
      >
        {children}
      </AppShell>
    </AppWorkspaceProvider>
  );
};

export default AppWorkspaceShell;

import type { AppSidebarGroup, AppSidebarItem } from './AppSidebar';

export const APP_SIDEBAR_HOME_ITEM: AppSidebarItem = {
  id: 'home',
  label: 'Home',
  icon: 'pi pi-home',
  path: '/cotacoes',
};

export const APP_SIDEBAR_QUICK_ACCESS_ITEMS: AppSidebarItem[] = [];

export const APP_SIDEBAR_GROUPS: AppSidebarGroup[] = [
  {
    id: 'comercial',
    label: 'Comercial',
    icon: 'pi pi-shopping-cart',
    items: [
      {
        label: 'Cotações',
        icon: 'pi pi-file-edit',
        items: [
          { label: 'Dashboard', icon: 'pi pi-chart-bar', path: '/cotacoes' },
          { label: 'Lista', icon: 'pi pi-list', path: '/cotacoes/lista' },
          { label: 'Importar PDF', icon: 'pi pi-file-pdf', path: '/cotacoes/nova' },
          { label: 'Analytics', icon: 'pi pi-chart-line', path: '/cotacoes/analytics' },
        ],
      },
    ],
  },
];

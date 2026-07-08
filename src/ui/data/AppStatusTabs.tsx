import React, { useMemo } from 'react';
import { TabMenu, type TabMenuTabChangeEvent } from 'primereact/tabmenu';
import type { MenuItem } from 'primereact/menuitem';
import './data.css';

export interface AppStatusTabItem {
  value: number;
  label: string;
}

type PrimeTabMenuTemplateOptions = {
  className: string;
  labelClassName?: string;
  iconClassName?: string;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
};

interface AppStatusTabsProps {
  items: AppStatusTabItem[];
  value: number;
  onChange?: (value: number) => void;
  className?: string;
  /** Permite customizar o conteúdo do item (ex.: botões ao lado do label). */
  renderItem?: (
    item: AppStatusTabItem,
    defaultLabel: React.ReactNode,
    options: PrimeTabMenuTemplateOptions
  ) => React.ReactNode;
}

const AppStatusTabs: React.FC<AppStatusTabsProps> = ({
  items,
  value,
  onChange,
  className = '',
  renderItem,
}) => {
  const model = useMemo<MenuItem[]>(
    () =>
      items.map((item) => ({
        label: item.label,
        ...(renderItem
          ? {
              template: (menuItem: MenuItem, options: unknown) =>
                renderItem(
                  item,
                  menuItem?.label ?? item.label,
                  options as PrimeTabMenuTemplateOptions
                ),
            }
          : {}),
      })),
    [items, renderItem]
  );

  const activeIndex = Math.max(
    items.findIndex((item) => item.value === value),
    0
  );

  const handleTabChange = (event: TabMenuTabChangeEvent) => {
    const nextItem = items[event.index];
    if (nextItem) {
      onChange?.(nextItem.value);
    }
  };

  return (
    <TabMenu
      model={model}
      activeIndex={activeIndex}
      onTabChange={handleTabChange}
      className={`app-status-tabs ${className}`.trim()}
    />
  );
};

export default AppStatusTabs;

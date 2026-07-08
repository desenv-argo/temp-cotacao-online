import React from 'react';

export interface AppContentTabItem {
  value: number;
  label: string;
  icon?: React.ReactNode;
  id?: string;
}

interface AppContentTabsProps {
  items: AppContentTabItem[];
  value: number;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

const AppContentTabs: React.FC<AppContentTabsProps> = ({
  items,
  value,
  onChange,
  ariaLabel,
  className = '',
}) => (
  <div
    className={`app-content-tabs ${className}`.trim()}
    role="tablist"
    aria-label={ariaLabel}
  >
    {items.map((item) => {
      const isActive = item.value === value;

      return (
        <button
          key={item.value}
          id={item.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          className={`app-content-tabs__item${isActive ? ' is-active' : ''}`}
          onClick={() => onChange?.(item.value)}
        >
          {item.icon ? (
            <span className="app-content-tabs__icon" aria-hidden="true">
              {item.icon}
            </span>
          ) : null}
          <span className="app-content-tabs__label">{item.label}</span>
        </button>
      );
    })}
  </div>
);

export default AppContentTabs;

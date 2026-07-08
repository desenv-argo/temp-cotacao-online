import React from 'react';
import './data.css';

interface AppFiltersBarProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

const AppFiltersBar: React.FC<AppFiltersBarProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  compact = false,
}) => {
  return (
    <div className={`app-filters-bar${compact ? ' app-filters-bar--compact' : ''} ${className}`.trim()}>
      <div className="app-filters-bar__main">
        {(title || subtitle) ? (
          <div className="app-filters-bar__head">
            {title ? <h3 className="app-filters-bar__title">{title}</h3> : null}
            {subtitle ? <p className="app-filters-bar__subtitle">{subtitle}</p> : null}
          </div>
        ) : null}
        <div className="app-filters-bar__content">{children}</div>
      </div>
      {actions ? <div className="app-filters-bar__actions">{actions}</div> : null}
    </div>
  );
};

export default AppFiltersBar;

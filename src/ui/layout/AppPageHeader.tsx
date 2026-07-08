import React from 'react';
import './layout.css';

interface AppPageHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const AppPageHeader: React.FC<AppPageHeaderProps> = ({
  title,
  subtitle,
  icon,
  actions,
  className = '',
}) => {
  return (
    <header className={`app-page__header ${className}`.trim()}>
      <div className="app-page__header-main">
        <div className="app-page__title-wrap">
          {icon ? <span className="app-page__title-icon">{icon}</span> : null}
          <div>
            <h1 className="app-page__title">{title}</h1>
            {subtitle ? <p className="app-page__subtitle">{subtitle}</p> : null}
          </div>
        </div>
      </div>
      {actions ? <div className="app-page__header-actions">{actions}</div> : null}
    </header>
  );
};

export default AppPageHeader;

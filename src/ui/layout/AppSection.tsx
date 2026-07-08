import React from 'react';
import './layout.css';

interface AppSectionProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  flat?: boolean;
}

const AppSection: React.FC<AppSectionProps> = ({
  children,
  title,
  subtitle,
  actions,
  className = '',
  flat = false,
}) => {
  const rootClassName = `app-section${flat ? ' app-section--flat' : ''} ${className}`.trim();

  return (
    <section className={rootClassName}>
      {(title || subtitle || actions) ? (
        <div className="app-section__header">
          <div>
            {title ? <h2 className="app-section__title">{title}</h2> : null}
            {subtitle ? <p className="app-section__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div className="app-section__actions">{actions}</div> : null}
        </div>
      ) : null}
      <div className="app-section__content">{children}</div>
    </section>
  );
};

export default AppSection;

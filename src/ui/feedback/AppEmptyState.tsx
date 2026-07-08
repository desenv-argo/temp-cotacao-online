import React from 'react';
import './feedback.css';

/** Classes PrimeIcons no formato `pi pi-*` passadas como string viram `<i className="…" />`. */
function resolveEmptyStateIcon(icon: React.ReactNode | string | undefined): React.ReactNode {
  if (icon === undefined) {
    return <i className="pi pi-inbox" aria-hidden />;
  }
  if (typeof icon === 'string') {
    const c = icon.trim();
    if (/^pi(\s+pi-[\w-]+)+$/.test(c)) {
      return <i className={c} aria-hidden />;
    }
  }
  return icon;
}

interface AppEmptyStateProps {
  title: React.ReactNode;
  message: React.ReactNode;
  /** Elemento React ou classes PrimeIcons (`pi pi-nome-do-icone`). */
  icon?: React.ReactNode | string;
  action?: React.ReactNode;
  className?: string;
}

const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  title,
  message,
  icon,
  action,
  className = '',
}) => {
  const resolvedIcon = resolveEmptyStateIcon(icon);
  return (
    <div className={`app-empty-state ${className}`.trim()}>
      <div className="app-empty-state__icon">{resolvedIcon}</div>
      <h3 className="app-empty-state__title">{title}</h3>
      <div className="app-empty-state__message">{message}</div>
      {action ? <div className="app-empty-state__action">{action}</div> : null}
    </div>
  );
};

export default AppEmptyState;

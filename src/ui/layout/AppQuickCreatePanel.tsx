import React from 'react';
import { Sidebar } from 'primereact/sidebar';
import './layout.css';

interface AppQuickCreatePanelProps {
  visible: boolean;
  onHide: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  /** Força o panel acima de dialogs/painéis (ex.: baixa). */
  baseZIndex?: number;
}

const AppQuickCreatePanel: React.FC<AppQuickCreatePanelProps> = ({
  visible,
  onHide,
  title,
  subtitle,
  icon,
  children,
  footer,
  className = '',
  baseZIndex = 170000,
}) => {
  return (
    <Sidebar
      visible={visible}
      onHide={onHide}
      position="right"
      blockScroll
      baseZIndex={baseZIndex}
      className={`app-quick-create-panel ${className}`.trim()}
      showCloseIcon
      header={
        <div className="app-quick-create-panel__header">
          {icon ? <div className="app-quick-create-panel__icon">{icon}</div> : null}
          <div className="app-quick-create-panel__header-copy">
            <h2 className="app-quick-create-panel__title">{title}</h2>
            {subtitle ? <p className="app-quick-create-panel__subtitle">{subtitle}</p> : null}
          </div>
        </div>
      }
    >
      <div className="app-quick-create-panel__body">
        <div className="app-quick-create-panel__content">{children}</div>
        {footer ? <div className="app-quick-create-panel__footer">{footer}</div> : null}
      </div>
    </Sidebar>
  );
};

export default AppQuickCreatePanel;

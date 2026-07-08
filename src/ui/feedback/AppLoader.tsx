import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';
import './feedback.css';

interface AppLoaderProps {
  fullscreen?: boolean;
  title?: string;
  subtitle?: string;
  inline?: boolean;
}

const AppLoader: React.FC<AppLoaderProps> = ({
  fullscreen = false,
  title = 'Carregando...',
  subtitle,
  inline = false,
}) => {
  if (inline) {
    return (
      <div className="app-loader">
        <ProgressSpinner style={{ width: '28px', height: '28px' }} strokeWidth="6" />
        <span>{title}</span>
      </div>
    );
  }

  const content = (
    <div className="app-loader__panel">
      <ProgressSpinner style={{ width: '56px', height: '56px' }} strokeWidth="5" />
      <p className="app-loader__title">{title}</p>
      {subtitle ? <p className="app-loader__subtitle">{subtitle}</p> : null}
    </div>
  );

  if (fullscreen) {
    return <div className="app-loader__overlay">{content}</div>;
  }

  return content;
};

export default AppLoader;

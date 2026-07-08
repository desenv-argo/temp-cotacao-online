import React from 'react';
import './layout.css';

interface AppPageProps {
  children: React.ReactNode;
  className?: string;
}

const AppPage: React.FC<AppPageProps> = ({ children, className = '' }) => {
  return (
    <div className={`app-page ${className}`.trim()}>
      {children}
    </div>
  );
};

export default AppPage;

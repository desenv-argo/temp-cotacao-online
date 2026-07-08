import React from 'react';
import './form.css';

interface AppFormGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

interface AppFormGridItemProps {
  children: React.ReactNode;
  span?: number;
  className?: string;
}

const AppFormGridRoot: React.FC<AppFormGridProps> = ({
  children,
  columns = 12,
  className = '',
}) => {
  return (
    <div
      className={`app-form-grid ${className}`.trim()}
      style={{ ['--app-form-grid-columns' as string]: columns }}
    >
      {children}
    </div>
  );
};

const AppFormGridItem: React.FC<AppFormGridItemProps> = ({
  children,
  span = 12,
  className = '',
}) => {
  return (
    <div
      className={`app-form-grid__item ${className}`.trim()}
      style={{ ['--app-form-grid-span' as string]: span }}
    >
      {children}
    </div>
  );
};

const AppFormGrid = Object.assign(AppFormGridRoot, {
  Item: AppFormGridItem,
});

export default AppFormGrid;

import React from 'react';
import './data.css';

type AppTagTone = 'neutral' | 'success' | 'info' | 'warning' | 'danger' | 'contrast';

interface AppTagProps {
  value: React.ReactNode;
  tone?: AppTagTone;
  rounded?: boolean;
  className?: string;
}

const AppTag: React.FC<AppTagProps> = ({
  value,
  tone = 'neutral',
  rounded = true,
  className = '',
}) => {
  return (
    <span
      className={`app-tag app-tag--${tone}${rounded ? ' app-tag--rounded' : ''} ${className}`.trim()}
    >
      {value}
    </span>
  );
};

export default AppTag;

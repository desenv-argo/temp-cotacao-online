import React from 'react';
import { Button, type ButtonProps } from 'primereact/button';
import './actions.css';

type AppIconButtonProps = Omit<ButtonProps, 'label'>;

const AppIconButton: React.FC<AppIconButtonProps> = ({
  className = '',
  rounded = true,
  text = false,
  ...props
}) => {
  return (
    <Button
      {...props}
      rounded={rounded}
      text={text}
      className={`app-icon-button ${className}`.trim()}
    />
  );
};

export default AppIconButton;

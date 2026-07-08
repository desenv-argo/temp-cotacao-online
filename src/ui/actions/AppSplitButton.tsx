import React from 'react';
import { SplitButton, type SplitButtonProps } from 'primereact/splitbutton';
import './actions.css';

type AppSplitButtonProps = SplitButtonProps;

const AppSplitButton: React.FC<AppSplitButtonProps> = ({
  className = '',
  ...props
}) => {
  return (
    <SplitButton
      {...props}
      rounded={props.rounded ?? true}
      className={`app-split-button ${className}`.trim()}
    />
  );
};

export default AppSplitButton;

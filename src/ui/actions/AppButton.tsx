import React from 'react';
import { Button, type ButtonProps } from 'primereact/button';
import './actions.css';

type AppButtonProps = ButtonProps & {
  fullWidth?: boolean;
  shape?: 'pill' | 'standard';
  iconBubble?: boolean;
};

const AppButton: React.FC<AppButtonProps> = ({
  className = '',
  fullWidth = false,
  shape = 'pill',
  iconBubble = true,
  ...props
}) => {
  const hasOnlyIcon = !props.label && !props.children && !!props.icon;

  return (
    <Button
      {...props}
      rounded={props.rounded ?? shape === 'pill'}
      raised={props.raised ?? (!props.text && !props.outlined && !props.link)}
      className={[
        'app-button',
        `app-button--${shape}`,
        iconBubble && props.icon ? 'app-button--icon-bubble' : '',
        hasOnlyIcon ? 'app-button--icon-only' : '',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        width: fullWidth ? '100%' : undefined,
        ...(props.style || {}),
      }}
    />
  );
};

export default AppButton;

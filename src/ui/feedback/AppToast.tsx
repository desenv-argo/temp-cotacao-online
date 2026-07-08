import React, { forwardRef } from 'react';
import { Toast, type ToastProps } from 'primereact/toast';
import './feedback.css';

export type AppToastRef = Toast;

const AppToast = forwardRef<AppToastRef, ToastProps>(function AppToast(
  { className = '', ...props },
  ref
) {
  return (
    <Toast
      {...props}
      ref={ref}
      className={`app-toast ${className}`.trim()}
    />
  );
});

export default AppToast;

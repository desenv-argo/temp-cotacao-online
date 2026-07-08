import React from 'react';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AppButton } from '../actions';
import './feedback.css';

type ConfirmSeverity = 'warning' | 'danger' | 'info';

interface AppConfirmDialogProps {
  visible: boolean;
  onHide: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  severity?: ConfirmSeverity;
  loading?: boolean;
}

const severityIconMap: Record<ConfirmSeverity, string> = {
  warning: 'pi pi-exclamation-triangle',
  danger: 'pi pi-trash',
  info: 'pi pi-info-circle',
};

const AppConfirmDialog: React.FC<AppConfirmDialogProps> = ({
  visible,
  onHide,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  severity = 'warning',
  loading = false,
}) => {
  const footer = (
    <>
      <AppButton
        label={cancelLabel}
        outlined
        onClick={onHide}
        disabled={loading}
      />
      <AppButton
        label={loading ? 'Processando...' : confirmLabel}
        icon={loading ? undefined : severity === 'danger' ? 'pi pi-trash' : 'pi pi-check'}
        severity={severity === 'danger' ? 'danger' : severity === 'info' ? 'info' : 'warning'}
        onClick={onConfirm}
        disabled={loading}
      />
    </>
  );

  return (
    <Dialog
      visible={visible}
      onHide={onHide}
      header={title}
      footer={footer}
      modal
      draggable={false}
      resizable={false}
      maskClassName="app-confirm-dialog-mask--stack-top"
      style={{ width: 'min(92vw, 32rem)' }}
      className="app-confirm-dialog"
    >
      <div className="app-confirm-dialog__message">
        <span className={`app-confirm-dialog__icon app-confirm-dialog__icon--${severity}`}>
          {loading ? (
            <ProgressSpinner
              style={{ width: '24px', height: '24px' }}
              strokeWidth="6"
              animationDuration=".8s"
            />
          ) : (
            <i className={severityIconMap[severity]} />
          )}
        </span>
        <div>
          <p className="app-confirm-dialog__title">{title}</p>
          <div className="app-confirm-dialog__text">{message}</div>
        </div>
      </div>
    </Dialog>
  );
};

export default AppConfirmDialog;

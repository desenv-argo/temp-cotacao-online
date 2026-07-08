import React, { useMemo } from 'react';
import type { MenuItem } from 'primereact/menuitem';
import AppButton from './AppButton';
import AppSplitButton from './AppSplitButton';
import './actions.css';

export type AppSpeedDialAction = MenuItem & {
  tone?: 'default' | 'danger';
};

type AppSpeedDialProps = {
  model: Array<AppSpeedDialAction | null | undefined | false>;
  className?: string;
  'aria-label'?: string;
};

const AppSpeedDial: React.FC<AppSpeedDialProps> = ({
  model,
  className = '',
  ...props
}) => {
  const normalizedModel = useMemo(
    () =>
      model.filter((item): item is AppSpeedDialAction => {
        if (!item) return false;
        return item.visible !== false;
      }),
    [model]
  );

  const [primaryAction, ...secondaryActions] = normalizedModel;

  if (!primaryAction) {
    return null;
  }

  if (secondaryActions.length === 0) {
    return (
      <AppButton
        label={primaryAction.label}
        icon={typeof primaryAction.icon === 'string' ? primaryAction.icon : undefined}
        severity={primaryAction.tone === 'danger' ? 'danger' : undefined}
        outlined={primaryAction.tone !== 'danger'}
        shape="standard"
        iconBubble={false}
        size="small"
        className={`app-row-actions__single ${className}`.trim()}
        onClick={(event) => primaryAction.command?.({ originalEvent: event, item: primaryAction })}
        aria-label={props['aria-label'] || primaryAction.label}
      />
    );
  }

  return (
    <AppSplitButton
      label={primaryAction.label}
      icon={typeof primaryAction.icon === 'string' ? primaryAction.icon : undefined}
      model={secondaryActions}
      outlined={primaryAction.tone !== 'danger'}
      severity={primaryAction.tone === 'danger' ? 'danger' : undefined}
      size="small"
      className={`app-split-button--compact app-row-actions ${className}`.trim()}
      onClick={(event) => primaryAction.command?.({ originalEvent: event, item: primaryAction })}
      aria-label={props['aria-label'] || primaryAction.label}
    />
  );
};

export default AppSpeedDial;

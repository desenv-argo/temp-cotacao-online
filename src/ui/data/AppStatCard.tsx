import React from 'react';
import './data.css';

type AppStatCardTrendTone = 'neutral' | 'success' | 'danger';
type AppStatCardSize = 'default' | 'compact' | 'compact-tight';

interface AppStatCardProps {
  title: React.ReactNode;
  value: React.ReactNode;
  subtitle?: React.ReactNode;
  icon?: React.ReactNode;
  iconToneStyle?: React.CSSProperties;
  footer?: React.ReactNode;
  trend?: React.ReactNode;
  trendTone?: AppStatCardTrendTone;
  /** Quando fornecido, o trend é renderizado como pill badge + este rótulo ao lado (ex.: "vs. mês anterior"). */
  trendLabel?: React.ReactNode;
  size?: AppStatCardSize;
  className?: string;
}

const TREND_ICON: Record<AppStatCardTrendTone, string | null> = {
  success: 'pi pi-arrow-up',
  danger: 'pi pi-arrow-down',
  neutral: null,
};

const AppStatCard: React.FC<AppStatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconToneStyle,
  footer,
  trend,
  trendTone = 'neutral',
  trendLabel,
  size = 'default',
  className = '',
}) => {
  const trendNode = trend ? (
    trendLabel ? (
      <div className="app-stat-card__trend-row">
        <span className={`app-stat-card__trend-badge app-stat-card__trend-badge--${trendTone}`}>
          {TREND_ICON[trendTone] ? <i className={TREND_ICON[trendTone]!} /> : null}
          {trend}
        </span>
        <span className="app-stat-card__trend-label">{trendLabel}</span>
      </div>
    ) : (
      <div className={`app-stat-card__trend app-stat-card__trend--${trendTone}`}>
        {trend}
      </div>
    )
  ) : null;

  return (
    <div className={`app-stat-card app-stat-card--${size} ${className}`.trim()}>
      <div className="app-stat-card__top">
        <div className="app-stat-card__meta">
          <p className="app-stat-card__title">{title}</p>
          <p className="app-stat-card__value">{value}</p>
        </div>
        {icon ? (
          <div className="app-stat-card__icon" style={iconToneStyle}>
            {icon}
          </div>
        ) : null}
      </div>
      {subtitle ? <p className="app-stat-card__subtitle">{subtitle}</p> : null}
      {(trendNode || footer) ? (
        <div className="app-stat-card__footer">
          {trendNode ?? <span />}
          {footer}
        </div>
      ) : null}
    </div>
  );
};

export default AppStatCard;

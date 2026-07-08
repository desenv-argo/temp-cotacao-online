import React, { useLayoutEffect, useRef } from 'react';
import './layout.css';

interface AppShellProps {
  topbar?: React.ReactNode;
  sidebar?: React.ReactNode;
  children: React.ReactNode;
  sidebarCollapsed?: boolean;
  contentClassName?: string;
}

const AppShell: React.FC<AppShellProps> = ({
  topbar,
  sidebar,
  children,
  sidebarCollapsed = false,
  contentClassName = '',
}) => {
  const shellRef = useRef<HTMLDivElement>(null);
  const topbarWrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const wrap = topbarWrapRef.current;
    let frameId: number | null = null;
    let lastInset = -1;

    if (!shell) {
      return;
    }

    if (!topbar || !wrap) {
      shell.style.setProperty('--app-shell-content-inset-top', '0px');
      return;
    }

    const apply = () => {
      const nextInset = wrap.offsetHeight;
      if (nextInset === lastInset) {
        return;
      }

      lastInset = nextInset;
      shell.style.setProperty('--app-shell-content-inset-top', `${nextInset}px`);
    };

    const scheduleApply = () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        apply();
      });
    };

    apply();

    const ro = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          scheduleApply();
        })
      : null;
    ro?.observe(wrap);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      ro?.disconnect();
    };
  }, [topbar]);

  return (
    <div ref={shellRef} className={`app-shell${sidebarCollapsed ? ' app-shell--collapsed' : ''}`}>
      {topbar ? (
        <div ref={topbarWrapRef} className="app-shell__topbar">
          {topbar}
        </div>
      ) : null}
      <div className="app-shell__body">
        {sidebar ? <aside className="app-shell__sidebar">{sidebar}</aside> : null}
        <main className={`app-shell__content ${contentClassName}`.trim()}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;

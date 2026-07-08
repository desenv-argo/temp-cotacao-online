import React, { useRef, useState } from 'react';
import { Tooltip } from 'primereact/tooltip';
import './data.css';

export interface AppTableTextClampProps {
  /** Texto completo (tooltip + copiar). */
  copyText: string;
  /** Quantidade máxima de linhas visíveis na célula. */
  lines?: 2 | 3;
  children: React.ReactNode;
  className?: string;
}

/**
 * Texto na grade com truncamento em N linhas, tooltip com texto completo (só string no Prime)
 * e botão copiar quando o texto é longo o bastante para provável truncagem.
 */
function AppTableTextClamp({
  copyText,
  lines = 2,
  className = '',
  children,
}: AppTableTextClampProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [copiedFlash, setCopiedFlash] = useState(false);

  const normalized = copyText.trim();
  const showRichTip = normalized.length > 0 && normalized !== '-';
  const showTruncateHint = normalized.length > 40;

  /** Prime Tooltip usa apenas texto em `content` (createTextNode); objetos viram "[object Object]". */
  const tooltipString = showRichTip ? copyText : '—';

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!showRichTip) return;
    void navigator.clipboard.writeText(copyText).then(() => {
      setCopiedFlash(true);
      window.setTimeout(() => setCopiedFlash(false), 1500);
    });
  };

  return (
    <>
      <Tooltip
        target={targetRef as unknown as React.RefObject<HTMLElement>}
        content={tooltipString}
        position="bottom"
        showDelay={350}
        hideDelay={120}
        className="app-table-text-clamp__tooltip"
      />
      <div
        ref={targetRef}
        className={`app-table-text-clamp app-table-text-clamp--lines-${lines}${showTruncateHint ? ' app-table-text-clamp--truncatable' : ''} ${className}`.trim()}
      >
        <div className="app-table-text-clamp__inner">{children}</div>
        {showTruncateHint && showRichTip ? (
          <div className="app-table-text-clamp__actions">
            <button
              type="button"
              className="app-table-text-clamp__copy-icon"
              title="Copiar texto completo"
              aria-label="Copiar texto completo"
              onClick={handleCopy}
            >
              <i className={copiedFlash ? 'pi pi-check' : 'pi pi-copy'} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default AppTableTextClamp;

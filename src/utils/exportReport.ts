export function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))];
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function printReportPdf(title: string, htmlContent: string) {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; padding: 32px; color: #1f2937; }
        h1 { font-size: 1.25rem; margin-bottom: 8px; }
        .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        th, td { padding: 10px 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
        th { background: #f9fafb; font-weight: 600; }
        .right { text-align: right; }
        @media print { body { padding: 16px; } }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">Êxito Representações · Gerado em ${new Date().toLocaleString('pt-BR')}</p>
      ${htmlContent}
    </body>
    </html>
  `);
  win.document.close();
  win.focus();
  setTimeout(() => {
    win.print();
  }, 300);
}

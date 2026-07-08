import React, { useMemo, useState } from 'react';
import { Toast } from 'primereact/toast';
import {
  AppButton,
  AppDataTable,
  type AppDataTableColumn,
  AppSection,
  AppSelect,
} from '../../ui';
import CotacaoAnaliseInteligente from './CotacaoAnaliseInteligente';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import {
  getRelatorioPorCliente,
  getRelatorioPorFornecedor,
  getRelatorioPorItem,
  getRelatorioPorPeriodo,
} from '../../mocks/relatorios';
import { MOCK_CLIENTES } from '../../mocks/clientes';
import { MOCK_FORNECEDORES } from '../../mocks/fornecedores';
import { downloadCsv, printReportPdf } from '../../utils/exportReport';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

const TIPOS = [
  { label: 'Por cliente', value: 'cliente' },
  { label: 'Por fornecedor', value: 'fornecedor' },
  { label: 'Por item', value: 'item' },
  { label: 'Por período', value: 'periodo' },
];

const CotacoesRelatoriosTab: React.FC = () => {
  const toastRef = React.useRef<Toast>(null);
  const { cotacoes } = useCotacaoDemo();
  const [tipo, setTipo] = useState('cliente');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroFornecedor, setFiltroFornecedor] = useState('');

  const filteredCotacoes = useMemo(() => {
    return cotacoes.filter((c) => {
      if (filtroCliente && String(c.clienteId) !== filtroCliente) return false;
      if (filtroFornecedor && String(c.fornecedorId) !== filtroFornecedor) return false;
      return true;
    });
  }, [cotacoes, filtroCliente, filtroFornecedor]);

  const clienteRows = useMemo(() => getRelatorioPorCliente(filteredCotacoes), [filteredCotacoes]);
  const fornecedorRows = useMemo(() => getRelatorioPorFornecedor(filteredCotacoes), [filteredCotacoes]);
  const itemRows = useMemo(() => getRelatorioPorItem(filteredCotacoes), [filteredCotacoes]);
  const periodoRows = useMemo(() => getRelatorioPorPeriodo(filteredCotacoes), [filteredCotacoes]);

  const columnsCliente: AppDataTableColumn[] = [
    { field: 'cliente', header: 'Cliente' },
    { field: 'quantidade', header: 'Qtd. cotações', align: 'center' },
    { field: 'valorTotal', header: 'Valor total', align: 'right', body: (r) => formatCurrency(r.valorTotal) },
    { field: 'ticketMedio', header: 'Ticket médio', align: 'right', body: (r) => formatCurrency(r.ticketMedio) },
    { field: 'ultimaCompra', header: 'Última compra' },
  ];

  const columnsFornecedor: AppDataTableColumn[] = [
    { field: 'fornecedor', header: 'Fornecedor' },
    { field: 'quantidade', header: 'Qtd.', align: 'center' },
    { field: 'valorTotal', header: 'Valor total', align: 'right', body: (r) => formatCurrency(r.valorTotal) },
    { field: 'percentual', header: '% do total', align: 'right', body: (r) => `${r.percentual.toFixed(1)}%` },
  ];

  const columnsItem: AppDataTableColumn[] = [
    { field: 'descricao', header: 'Item' },
    { field: 'quantidadeCotada', header: 'Qtd. cotada', align: 'center' },
    { field: 'valorMedio', header: 'Valor médio', align: 'right', body: (r) => formatCurrency(r.valorMedio) },
    { field: 'fornecedores', header: 'Fornecedores' },
  ];

  const columnsPeriodo: AppDataTableColumn[] = [
    { field: 'periodo', header: 'Período' },
    { field: 'quantidade', header: 'Qtd.', align: 'center' },
    { field: 'valorTotal', header: 'Valor total', align: 'right', body: (r) => formatCurrency(r.valorTotal) },
  ];

  const getCurrentData = () => {
    switch (tipo) {
      case 'fornecedor': return { rows: fornecedorRows, columns: columnsFornecedor, title: 'Relatório por fornecedor' };
      case 'item': return { rows: itemRows, columns: columnsItem, title: 'Relatório por item' };
      case 'periodo': return { rows: periodoRows, columns: columnsPeriodo, title: 'Relatório por período' };
      default: return { rows: clienteRows, columns: columnsCliente, title: 'Relatório por cliente' };
    }
  };

  const { rows, columns, title } = getCurrentData();

  const exportCsv = () => {
    const headers = columns.map((c) => String(c.header));
    const data = (rows as unknown as Array<Record<string, unknown>>).map((row) =>
      columns.map((col) => {
        const val = row[col.field];
        if (typeof val === 'number' && col.field.includes('valor')) return formatCurrency(val);
        return String(val ?? '');
      })
    );
    downloadCsv(`${title.toLowerCase().replace(/\s/g, '-')}.csv`, headers, data);
    toastRef.current?.show({ severity: 'success', summary: 'CSV exportado', life: 2500 });
  };

  const exportPdf = () => {
    const tableHtml = `
      <table>
        <thead><tr>${columns.map((c) => `<th>${c.header}</th>`).join('')}</tr></thead>
        <tbody>
          ${(rows as unknown as Array<Record<string, unknown>>).map((row) =>
            `<tr>${columns.map((col) => {
              const val = row[col.field];
              const display = typeof val === 'number' && String(col.field).includes('valor')
                ? formatCurrency(val)
                : String(val ?? '');
              return `<td>${display}</td>`;
            }).join('')}</tr>`
          ).join('')}
        </tbody>
      </table>`;
    printReportPdf(title, tableHtml);
    toastRef.current?.show({ severity: 'success', summary: 'PDF gerado', detail: 'Use a janela de impressão para salvar.', life: 3500 });
  };

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <CotacaoAnaliseInteligente />

      <div style={{ marginTop: 24 }}>
        <AppSection title="Relatórios">
        <div className="cotacao-relatorios-filters">
          <AppSelect value={tipo} onChange={(v) => setTipo(String(v ?? 'cliente'))} options={TIPOS} placeholder="Tipo de relatório" />
          <AppSelect
            value={filtroCliente}
            onChange={(v) => setFiltroCliente(String(v ?? ''))}
            options={[{ label: 'Todos os clientes', value: '' }, ...MOCK_CLIENTES.map((c) => ({ label: c.nome, value: String(c.id) }))]}
            placeholder="Filtrar cliente"
          />
          <AppSelect
            value={filtroFornecedor}
            onChange={(v) => setFiltroFornecedor(String(v ?? ''))}
            options={[{ label: 'Todos os fornecedores', value: '' }, ...MOCK_FORNECEDORES.map((f) => ({ label: f.nome, value: String(f.id) }))]}
            placeholder="Filtrar fornecedor"
          />
          <div className="cotacao-relatorios-actions">
            <AppButton label="Exportar CSV" icon="pi pi-file-excel" severity="secondary" outlined onClick={exportCsv} />
            <AppButton label="Exportar PDF" icon="pi pi-file-pdf" onClick={exportPdf} />
          </div>
        </div>

        <AppDataTable value={rows} columns={columns} dataKey={tipo === 'cliente' ? 'clienteId' : tipo === 'fornecedor' ? 'fornecedorId' : 'descricao'} />
        </AppSection>
      </div>
    </>
  );
};

export default CotacoesRelatoriosTab;

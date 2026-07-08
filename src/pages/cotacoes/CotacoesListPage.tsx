import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { PaginatorPageChangeEvent } from 'primereact/paginator';
import {
  AppButton,
  AppDataTable,
  type AppDataTableColumn,
  AppDatePicker,
  AppFiltersBar,
  AppPage,
  AppPageHeader,
  AppPaginator,
  AppSection,
  AppSelect,
  AppTextInput,
  AppWorkspaceShell,
} from '../../ui';
import CotacaoListaResumoCards from '../../components/cotacoes/CotacaoListaResumoCards';
import CotacaoStatusTag from '../../components/cotacoes/CotacaoStatusTag';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import { getCotacaoRouteForStatus } from '../../mocks/cotacoes';
import { computeListaResumo } from '../../mocks/analytics';
import { MOCK_CLIENTES, getClienteById } from '../../mocks/clientes';
import { MOCK_FORNECEDORES, getFornecedorById } from '../../mocks/fornecedores';
import { COTACAO_STATUS_LABELS } from '../../types/cotacao';
import { filterCotacoes } from '../../utils/listaFilters';
import { formatCurrency, formatDateTime } from '../../utils/format';
import '../../components/cotacoes/cotacoes.css';

const STATUS_OPTIONS = Object.entries(COTACAO_STATUS_LABELS).map(([value, label]) => ({
  label,
  value,
}));

const ROWS = 10;

const CotacoesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cotacoes } = useCotacaoDemo();

  const [clienteFilter, setClienteFilter] = useState('');
  const [fornecedorFilter, setFornecedorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [busca, setBusca] = useState('');
  const [periodo, setPeriodo] = useState<(Date | null)[] | null>(null);
  const [page, setPage] = useState(0);
  const [mesFilter, setMesFilter] = useState('');

  useEffect(() => {
    setClienteFilter(searchParams.get('cliente') ?? '');
    setFornecedorFilter(searchParams.get('fornecedor') ?? '');
    setStatusFilter(searchParams.get('status') ?? '');
    setBusca(searchParams.get('busca') ?? '');
    setMesFilter(searchParams.get('mes') ?? '');
    setPage(0);
  }, [searchParams]);

  const filtered = useMemo(() => {
    const periodoRange = Array.isArray(periodo) ? periodo : null;
    return filterCotacoes(cotacoes, {
      cliente: clienteFilter,
      fornecedor: fornecedorFilter,
      status: statusFilter,
      busca,
      mes: mesFilter,
      periodoInicio: periodoRange?.[0] ?? null,
      periodoFim: periodoRange?.[1] ?? null,
    });
  }, [cotacoes, clienteFilter, fornecedorFilter, statusFilter, busca, mesFilter, periodo]);

  const resumo = useMemo(() => computeListaResumo(filtered), [filtered]);
  const paginated = filtered.slice(page * ROWS, page * ROWS + ROWS);

  const columns: AppDataTableColumn[] = [
    { field: 'numero', header: 'Número', sortable: true },
    {
      field: 'cliente',
      header: 'Cliente',
      body: (row) => getClienteById(row.clienteId)?.nome ?? '—',
    },
    {
      field: 'fornecedor',
      header: 'Fornecedor',
      body: (row) => getFornecedorById(row.fornecedorId)?.nome ?? '—',
    },
    {
      field: 'itens',
      header: 'Itens',
      align: 'center',
      body: (row) => row.itens.length,
    },
    {
      field: 'valor',
      header: 'Valor',
      align: 'right',
      body: (row) => formatCurrency(row.valor),
    },
    {
      field: 'status',
      header: 'Status',
      body: (row) => <CotacaoStatusTag status={row.status} />,
    },
    { field: 'responsavel', header: 'Responsável' },
    {
      field: 'ultimaAtualizacao',
      header: 'Última atualização',
      body: (row) => formatDateTime(row.ultimaAtualizacao),
    },
    {
      field: 'acoes',
      header: 'Ações',
      body: (row) => (
        <AppButton
          icon="pi pi-arrow-right"
          label="Abrir"
          text
          onClick={() => navigate(getCotacaoRouteForStatus(row.id, row.status))}
        />
      ),
    },
  ];

  const handlePageChange = (e: PaginatorPageChangeEvent) => {
    setPage(e.page ?? 0);
  };

  const from = filtered.length ? page * ROWS + 1 : 0;
  const to = Math.min((page + 1) * ROWS, filtered.length);

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Lista de Cotações"
          icon={<i className="pi pi-list" />}
          actions={
            <AppButton label="Importar PDF" icon="pi pi-file-pdf" onClick={() => navigate('/cotacoes/nova')} />
          }
        />

        <CotacaoListaResumoCards resumo={resumo} />

        <AppFiltersBar>
          <AppSelect
            value={clienteFilter}
            onChange={(v) => { setClienteFilter(String(v ?? '')); setPage(0); }}
            options={[{ label: 'Todos os clientes', value: '' }, ...MOCK_CLIENTES.map((c) => ({ label: c.nome, value: String(c.id) }))]}
            placeholder="Cliente"
          />
          <AppSelect
            value={fornecedorFilter}
            onChange={(v) => { setFornecedorFilter(String(v ?? '')); setPage(0); }}
            options={[{ label: 'Todos os fornecedores', value: '' }, ...MOCK_FORNECEDORES.map((f) => ({ label: f.nome, value: String(f.id) }))]}
            placeholder="Fornecedor"
          />
          <AppSelect
            value={statusFilter}
            onChange={(v) => { setStatusFilter(String(v ?? '')); setPage(0); }}
            options={[{ label: 'Todos os status', value: '' }, ...STATUS_OPTIONS]}
            placeholder="Status"
          />
          <AppDatePicker
            value={periodo}
            onChange={(v) => { setPeriodo(v as (Date | null)[]); setPage(0); }}
            selectionMode="range"
            placeholder="Período"
            showIcon
          />
          <AppTextInput value={busca} onChange={(v) => { setBusca(v); setPage(0); }} placeholder="Buscar..." />
        </AppFiltersBar>

        <AppSection>
          <p className="cotacao-lista-count">
            Mostrando {from}–{to} de {filtered.length} cotações
          </p>
          <AppDataTable value={paginated} columns={columns} dataKey="id" />
          <AppPaginator
            first={page * ROWS}
            rows={ROWS}
            totalRecords={filtered.length}
            onPageChange={handlePageChange}
            rowsPerPageOptions={[10, 20, 50]}
          />
        </AppSection>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacoesListPage;

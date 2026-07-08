import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppButton,
  AppDataTable,
  type AppDataTableColumn,
  AppPage,
  AppPageHeader,
  AppSection,
  AppWorkspaceShell,
} from '../../ui';
import CotacaoChartsPanel from '../../components/cotacoes/CotacaoChartsPanel';
import CotacaoKpiGrid from '../../components/cotacoes/CotacaoKpiGrid';
import CotacaoStatusTag from '../../components/cotacoes/CotacaoStatusTag';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import { getCotacaoRouteForStatus } from '../../mocks/cotacoes';
import { computeDashboardKpis, getPrecisaAtencao } from '../../mocks/analytics';
import { getClienteById } from '../../mocks/clientes';
import { getFornecedorById } from '../../mocks/fornecedores';
import { buildListaUrl } from '../../utils/listaFilters';
import { formatCurrency, formatDateTime } from '../../utils/format';
import '../../components/cotacoes/cotacoes.css';

const CotacoesDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { cotacoes } = useCotacaoDemo();
  const kpis = computeDashboardKpis(cotacoes);
  const atencao = getPrecisaAtencao(cotacoes);

  const columns: AppDataTableColumn[] = useMemo(
    () => [
      {
        field: 'status',
        header: 'Status',
        body: (row) => <CotacaoStatusTag status={row.status} />,
      },
      {
        field: 'numero',
        header: 'Número',
      },
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
        field: 'valor',
        header: 'Valor',
        align: 'right',
        body: (row) => formatCurrency(row.valor),
      },
      {
        field: 'acoes',
        header: '',
        body: (row) => (
          <AppButton
            icon="pi pi-arrow-right"
            text
            onClick={() => navigate(getCotacaoRouteForStatus(row.id, row.status))}
          />
        ),
      },
    ],
    [navigate]
  );

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Cotações"
          subtitle="O que precisa da sua atenção agora"
          icon={<i className="pi pi-file-edit" />}
          actions={
            <AppButton label="Importar PDF" icon="pi pi-file-pdf" onClick={() => navigate('/cotacoes/nova')} />
          }
        />

        <CotacaoKpiGrid kpis={kpis} onNavigate={navigate} />
        <CotacaoChartsPanel cotacoes={cotacoes} onNavigate={navigate} />

        <div style={{ marginTop: 20 }}>
          <AppSection
            title="Precisa de atenção"
            subtitle="Cotações em revisão ou aguardando aprovação do cliente"
            actions={
              <AppButton
                label="Ver todas"
                text
                icon="pi pi-arrow-right"
                iconPos="right"
                onClick={() =>
                  navigate(
                    buildListaUrl({
                      status: 'em_revisao',
                    })
                  )
                }
              />
            }
          >
            <AppDataTable value={atencao} columns={columns} dataKey="id" emptyMessage="Nenhuma cotação pendente" />
          </AppSection>
        </div>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacoesDashboardPage;

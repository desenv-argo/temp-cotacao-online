import React, { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { AppContentTabs, AppPage, AppPageHeader, AppStatCard, AppWorkspaceShell } from '../../ui';
import CotacaoChartsPanel from '../../components/cotacoes/CotacaoChartsPanel';
import CotacoesRelatoriosTab from '../../components/cotacoes/CotacoesRelatoriosTab';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import {
  CHART_COLORS,
  getAnalyticsKpis,
  getPedidosPorFornecedor,
  getValorCotadoPorMes,
} from '../../mocks/analytics';
import { formatCurrency } from '../../utils/format';
import '../../components/cotacoes/cotacoes.css';

const TAB_ITEMS = [
  { value: 0, label: 'Indicadores', icon: <i className="pi pi-chart-line" /> },
  { value: 1, label: 'Relatórios', icon: <i className="pi pi-file" /> },
];

const CotacoesAnalyticsPage: React.FC = () => {
  const { cotacoes } = useCotacaoDemo();
  const [tab, setTab] = useState(0);
  const kpis = getAnalyticsKpis(cotacoes);
  const fornecedores = getPedidosPorFornecedor(cotacoes);
  const meses = getValorCotadoPorMes(cotacoes);

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Analytics"
          subtitle="Indicadores, relatórios e análise inteligente"
          icon={<i className="pi pi-chart-line" />}
        />

        <AppContentTabs items={TAB_ITEMS} value={tab} onChange={setTab} ariaLabel="Analytics" />

        {tab === 0 ? (
          <>
            <div className="cotacao-analytics-grid">
              <AppStatCard title="Ticket médio" value={formatCurrency(kpis.ticketMedio)} icon={<i className="pi pi-tag" />} />
              <AppStatCard title="Pedidos aprovados" value={kpis.quantidadePedidos} icon={<i className="pi pi-check-circle" />} />
              <AppStatCard title="Tempo médio de cotação" value={kpis.tempoMedioCotacao} icon={<i className="pi pi-clock" />} />
              <AppStatCard title="Tempo até aprovação" value={kpis.tempoMedioAprovacao} icon={<i className="pi pi-hourglass" />} />
            </div>

            <CotacaoChartsPanel cotacoes={cotacoes} onNavigate={() => {}} variant="analytics" />

            <div className="cotacao-analytics-charts">
              <div className="cotacao-chart-card">
                <h3>Fornecedores mais utilizados</h3>
                <BarChart
                  height={260}
                  series={[{ data: fornecedores.map((d) => d.quantidade), label: 'Cotações' }]}
                  xAxis={[{ data: fornecedores.map((d) => d.fornecedor.split(' ')[0]), scaleType: 'band' }]}
                  colors={[CHART_COLORS[2]]}
                />
              </div>
              <div className="cotacao-chart-card">
                <h3>Valor movimentado por mês</h3>
                <LineChart
                  height={260}
                  series={[{ data: meses.map((d) => d.valor), label: 'Valor', curve: 'natural' }]}
                  xAxis={[{ data: meses.map((d) => d.mes), scaleType: 'point' }]}
                  colors={[CHART_COLORS[0]]}
                />
              </div>
            </div>
          </>
        ) : (
          <CotacoesRelatoriosTab />
        )}
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacoesAnalyticsPage;

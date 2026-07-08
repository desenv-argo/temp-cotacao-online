import React from 'react';
import { AppStatCard } from '../../ui';
import { formatCurrency } from '../../utils/format';
import { buildListaUrl } from '../../utils/listaFilters';
import './cotacoes.css';

interface DashboardKpisData {
  emRevisao: number;
  aguardandoAprovacao: number;
  aprovadosMes: number;
  valorEmAndamento: number;
}

interface CotacaoKpiGridProps {
  kpis: DashboardKpisData;
  onNavigate: (url: string) => void;
}

const CotacaoKpiGrid: React.FC<CotacaoKpiGridProps> = ({ kpis, onNavigate }) => (
  <div className="cotacao-kpi-grid cotacao-kpi-grid--4">
    <button
      type="button"
      className="cotacao-kpi-clickable"
      onClick={() => onNavigate(buildListaUrl({ status: 'em_revisao' }))}
    >
      <AppStatCard
        title="Em revisão"
        value={kpis.emRevisao}
        subtitle="Precisa conferir"
        icon={<i className="pi pi-eye" />}
        iconToneStyle={{ background: '#e3f2fd', color: '#1976d2' }}
        footer={<span className="cotacao-drill-hint">Ver cotações <i className="pi pi-arrow-right" /></span>}
      />
    </button>
    <button
      type="button"
      className="cotacao-kpi-clickable"
      onClick={() => onNavigate(buildListaUrl({ status: 'aguardando_aprovacao' }))}
    >
      <AppStatCard
        title="Aguardando aprovação"
        value={kpis.aguardandoAprovacao}
        subtitle="Cliente precisa responder"
        icon={<i className="pi pi-hourglass" />}
        iconToneStyle={{ background: '#fff8e1', color: '#f59e0b' }}
        footer={<span className="cotacao-drill-hint">Ver cotações <i className="pi pi-arrow-right" /></span>}
      />
    </button>
    <button
      type="button"
      className="cotacao-kpi-clickable"
      onClick={() => onNavigate(buildListaUrl({ status: 'aprovado' }))}
    >
      <AppStatCard
        title="Aprovados no mês"
        value={kpis.aprovadosMes}
        icon={<i className="pi pi-check-circle" />}
        iconToneStyle={{ background: '#e8f5e9', color: '#22c55e' }}
        footer={<span className="cotacao-drill-hint">Ver cotações <i className="pi pi-arrow-right" /></span>}
      />
    </button>
    <button
      type="button"
      className="cotacao-kpi-clickable"
      onClick={() => onNavigate(buildListaUrl({}))}
    >
      <AppStatCard
        title="Valor em andamento"
        value={formatCurrency(kpis.valorEmAndamento)}
        icon={<i className="pi pi-dollar" />}
        iconToneStyle={{ background: '#e8eaf6', color: '#5c6bc0' }}
        footer={<span className="cotacao-drill-hint">Ver todas <i className="pi pi-arrow-right" /></span>}
      />
    </button>
  </div>
);

export default CotacaoKpiGrid;

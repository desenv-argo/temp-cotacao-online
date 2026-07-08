import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import {
  CHART_COLORS,
  getPedidosPorFornecedor,
  getValorCotadoPorMes,
} from '../../mocks/analytics';
import type { Cotacao } from '../../types/cotacao';
import { buildListaUrl } from '../../utils/listaFilters';
import './cotacoes.css';

interface CotacaoChartsPanelProps {
  cotacoes?: Cotacao[];
  onNavigate: (url: string) => void;
  variant?: 'dashboard' | 'analytics';
}

const CotacaoChartsPanel: React.FC<CotacaoChartsPanelProps> = ({
  cotacoes = [],
  onNavigate,
  variant = 'dashboard',
}) => {
  const fornecedores = getPedidosPorFornecedor(cotacoes);
  const meses = getValorCotadoPorMes(cotacoes);

  if (variant === 'analytics') {
    return (
      <div className="cotacao-analytics-charts">
        <div className="cotacao-chart-card">
          <h3>Valor por fornecedor</h3>
          <BarChart
            height={280}
            series={[{ data: fornecedores.map((d) => d.quantidade * 18500), label: 'Valor (R$)' }]}
            xAxis={[{ data: fornecedores.map((d) => d.fornecedor), scaleType: 'band' }]}
            colors={CHART_COLORS}
            margin={{ left: 60 }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cotacao-charts-grid cotacao-charts-grid--dashboard">
      <div className="cotacao-chart-card cotacao-chart-card--clickable">
        <h3>Valor cotado por mês</h3>
        <LineChart
          height={260}
          series={[{ data: meses.map((d) => d.valor), label: 'Valor', curve: 'natural' }]}
          xAxis={[{ data: meses.map((d) => d.mes), scaleType: 'point' }]}
          colors={[CHART_COLORS[0]]}
          onAxisClick={(_e, d) => {
            const idx = d?.dataIndex;
            if (idx != null && meses[idx]) {
              onNavigate(buildListaUrl({ mes: meses[idx].mesKey }));
            }
          }}
        />
        <p className="cotacao-drill-hint">Clique em um mês para ver as cotações</p>
      </div>
      <div className="cotacao-chart-card cotacao-chart-card--clickable">
        <h3>Top fornecedores</h3>
        <BarChart
          height={260}
          layout="horizontal"
          series={[{ data: fornecedores.map((d) => d.quantidade), label: 'Cotações' }]}
          yAxis={[{ data: fornecedores.map((d) => d.fornecedor.split(' ')[0]), scaleType: 'band' }]}
          colors={[CHART_COLORS[1]]}
          margin={{ left: 90 }}
          onItemClick={(_e, params) => {
            const idx = params?.dataIndex;
            if (idx != null && fornecedores[idx]) {
              onNavigate(buildListaUrl({ fornecedor: String(fornecedores[idx].fornecedorId) }));
            }
          }}
        />
        <p className="cotacao-drill-hint">Clique em um fornecedor para filtrar</p>
      </div>
    </div>
  );
};

export default CotacaoChartsPanel;

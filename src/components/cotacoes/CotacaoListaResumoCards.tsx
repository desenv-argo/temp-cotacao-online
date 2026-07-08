import React from 'react';
import { AppStatCard } from '../../ui';
import type { ListaResumo } from '../../types/cotacao';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

interface CotacaoListaResumoCardsProps {
  resumo: ListaResumo;
}

const CotacaoListaResumoCards: React.FC<CotacaoListaResumoCardsProps> = ({ resumo }) => (
  <div className="cotacao-lista-resumo-grid">
    <AppStatCard
      title="Total de cotações"
      value={resumo.totalCotacoes}
      icon={<i className="pi pi-file-edit" />}
      iconToneStyle={{ background: '#e3f2fd', color: '#1976d2' }}
    />
    <AppStatCard
      title="Valor total"
      value={formatCurrency(resumo.valorTotal)}
      icon={<i className="pi pi-dollar" />}
      iconToneStyle={{ background: '#e8f5e9', color: '#22c55e' }}
    />
    <AppStatCard
      title="Aguardando ação"
      value={resumo.aguardandoAcao}
      icon={<i className="pi pi-hourglass" />}
      iconToneStyle={{ background: '#fff8e1', color: '#f59e0b' }}
    />
    <AppStatCard
      title="Aprovadas"
      value={resumo.aprovadas}
      icon={<i className="pi pi-check-circle" />}
      iconToneStyle={{ background: '#e8eaf6', color: '#5c6bc0' }}
    />
  </div>
);

export default CotacaoListaResumoCards;

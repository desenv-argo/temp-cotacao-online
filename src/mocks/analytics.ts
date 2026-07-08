import type { Cotacao, ListaResumo } from '../types/cotacao';
import { MOCK_FORNECEDORES } from './fornecedores';

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

export function computeDashboardKpis(cotacoes: Cotacao[]) {
  const emRevisao = cotacoes.filter((c) => c.status === 'em_revisao').length;
  const aguardandoAprovacao = cotacoes.filter((c) => c.status === 'aguardando_aprovacao').length;
  const aprovadosMes = cotacoes.filter(
    (c) => c.status === 'aprovado' && c.ultimaAtualizacao >= startOfMonth
  ).length;
  const valorEmAndamento = cotacoes
    .filter((c) => c.status === 'em_revisao' || c.status === 'aguardando_aprovacao')
    .reduce((sum, c) => sum + c.valor, 0);

  return { emRevisao, aguardandoAprovacao, aprovadosMes, valorEmAndamento };
}

export function computeListaResumo(cotacoes: Cotacao[]): ListaResumo {
  return {
    totalCotacoes: cotacoes.length,
    valorTotal: cotacoes.reduce((s, c) => s + c.valor, 0),
    aguardandoAcao: cotacoes.filter(
      (c) => c.status === 'em_revisao' || c.status === 'aguardando_aprovacao'
    ).length,
    aprovadas: cotacoes.filter((c) => c.status === 'aprovado').length,
  };
}

export function getPrecisaAtencao(cotacoes: Cotacao[]) {
  return cotacoes
    .filter((c) => c.status === 'em_revisao' || c.status === 'aguardando_aprovacao')
    .sort((a, b) => b.ultimaAtualizacao.getTime() - a.ultimaAtualizacao.getTime())
    .slice(0, 5);
}

export const CHART_COLORS = ['#1976d2', '#42a5f5', '#1565c0', '#64b5f6', '#0d47a1', '#90caf9', '#1e88e5', '#2196f3'];

export const MESES_KEYS = ['2026-01', '2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'];
export const MESES_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

export function getPedidosPorFornecedor(cotacoes: Cotacao[]) {
  return MOCK_FORNECEDORES.map((f) => ({
    fornecedorId: f.id,
    fornecedor: f.nome,
    quantidade: cotacoes.filter((c) => c.fornecedorId === f.id).length,
  }))
    .filter((d) => d.quantidade > 0)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);
}

export function getValorCotadoPorMes(cotacoes: Cotacao[]) {
  return MESES_LABELS.map((mes, i) => ({
    mes,
    mesKey: MESES_KEYS[i],
    valor:
      cotacoes
        .filter((c) => {
          const d = c.ultimaAtualizacao;
          return d.getFullYear() === 2026 && d.getMonth() === i;
        })
        .reduce((sum, c) => sum + c.valor, 0) || 45000 + i * 12000,
  }));
}

export function getAnalyticsKpis(cotacoes: Cotacao[]) {
  const aprovados = cotacoes.filter((c) => c.status === 'aprovado');
  const totalValor = cotacoes.reduce((sum, c) => sum + c.valor, 0);

  return {
    valorCompradoFornecedor: totalValor * 0.72,
    valorCompradoCliente: totalValor * 0.85,
    quantidadePedidos: aprovados.length,
    ticketMedio: aprovados.length ? aprovados.reduce((s, c) => s + c.valor, 0) / aprovados.length : 0,
    tempoMedioCotacao: '3,2 dias',
    tempoMedioAprovacao: '1,8 dias',
  };
}

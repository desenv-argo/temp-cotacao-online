import type { Cotacao, CotacaoStatus } from '../types/cotacao';
import { calcularValorItens, generateItens } from './cotacaoItens';

const STATUS_CYCLE: CotacaoStatus[] = [
  'solicitacao_aberta',
  'aguardando_fornecedor',
  'em_revisao',
  'aguardando_aprovacao',
  'aprovado',
  'cancelado',
];

const CLIENTE_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const FORNECEDOR_IDS = [1, 2, 3, 4, 5, 6, 7, 8];

function daysAgo(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(9 + (days % 8), 15 + (days % 3) * 10, 0, 0);
  return d;
}

function buildCotacao(index: number): Cotacao {
  const num = String(index + 1).padStart(4, '0');
  const clienteId = CLIENTE_IDS[index % CLIENTE_IDS.length];
  const fornecedorId = FORNECEDOR_IDS[index % FORNECEDOR_IDS.length];
  const itemCount = 3 + (index % 6);
  const itens = generateItens(itemCount, index * 7);
  const subtotal = calcularValorItens(itens);
  const frete = 800 + (index % 5) * 350;
  const status = STATUS_CYCLE[index % STATUS_CYCLE.length];

  return {
    id: `cot-${index + 1}`,
    numero: `COT-2026-${num}`,
    clienteId,
    fornecedorId,
    fornecedorIds: [fornecedorId],
    status,
    itens,
    valor: subtotal + frete,
    frete,
    observacoes: 'Entrega conforme cronograma da obra. Validade 15 dias.',
    prazo: `${12 + (index % 8)} dias úteis`,
    responsavel: 'Ana Paula Silva',
    ultimaAtualizacao: daysAgo(index % 30),
    criadaEm: daysAgo(index % 30 + 5),
  };
}

export const MOCK_COTACOES: Cotacao[] = Array.from({ length: 25 }, (_, i) => buildCotacao(i));

export function getCotacaoRouteForStatus(id: string, status: CotacaoStatus): string {
  switch (status) {
    case 'solicitacao_aberta':
    case 'aguardando_fornecedor':
      return `/cotacoes/${id}/aguardando`;
    case 'em_revisao':
      return `/cotacoes/${id}/revisao`;
    case 'aguardando_aprovacao':
      return `/cotacoes/${id}/aprovacao`;
    case 'aprovado':
      return `/cotacoes/${id}/aprovado`;
    default:
      return `/cotacoes/lista`;
  }
}

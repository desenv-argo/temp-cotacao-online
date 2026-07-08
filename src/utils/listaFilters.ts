import type { Cotacao, CotacaoStatus } from '../types/cotacao';
import { getClienteById } from '../mocks/clientes';
import { getFornecedorById } from '../mocks/fornecedores';

export interface ListaFilterParams {
  cliente?: string;
  fornecedor?: string;
  status?: string;
  busca?: string;
  mes?: string;
  periodoInicio?: Date | null;
  periodoFim?: Date | null;
}

export function filterCotacoes(cotacoes: Cotacao[], params: ListaFilterParams): Cotacao[] {
  return cotacoes.filter((c) => {
    if (params.cliente && String(c.clienteId) !== params.cliente) return false;
    if (params.fornecedor && String(c.fornecedorId) !== params.fornecedor) return false;
    if (params.status && c.status !== params.status) return false;

    if (params.mes) {
      const [year, month] = params.mes.split('-').map(Number);
      const d = c.ultimaAtualizacao;
      if (d.getFullYear() !== year || d.getMonth() + 1 !== month) return false;
    }

    if (params.periodoInicio && params.periodoFim) {
      const start = new Date(params.periodoInicio);
      start.setHours(0, 0, 0, 0);
      const end = new Date(params.periodoFim);
      end.setHours(23, 59, 59, 999);
      if (c.ultimaAtualizacao < start || c.ultimaAtualizacao > end) return false;
    }

    if (params.busca) {
      const q = params.busca.toLowerCase();
      const cliente = getClienteById(c.clienteId)?.nome.toLowerCase() ?? '';
      const fornecedor = getFornecedorById(c.fornecedorId)?.nome.toLowerCase() ?? '';
      if (!c.numero.toLowerCase().includes(q) && !cliente.includes(q) && !fornecedor.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

export function buildListaUrl(filters: Record<string, string | undefined>): string {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const qs = params.toString();
  return qs ? `/cotacoes/lista?${qs}` : '/cotacoes/lista';
}

export function parseStatusFilter(value: string | null): CotacaoStatus | '' {
  if (!value) return '';
  return value as CotacaoStatus;
}

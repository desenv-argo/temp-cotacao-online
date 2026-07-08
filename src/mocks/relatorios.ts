import type { Cotacao } from '../types/cotacao';
import { MOCK_CLIENTES } from './clientes';
import { MOCK_FORNECEDORES } from './fornecedores';
import { formatCurrency, formatDate } from '../utils/format';

export interface RelatorioClienteRow {
  cliente: string;
  clienteId: number;
  quantidade: number;
  valorTotal: number;
  ticketMedio: number;
  ultimaCompra: string;
}

export interface RelatorioFornecedorRow {
  fornecedor: string;
  fornecedorId: number;
  quantidade: number;
  valorTotal: number;
  percentual: number;
}

export interface RelatorioItemRow {
  descricao: string;
  quantidadeCotada: number;
  valorMedio: number;
  fornecedores: string;
}

export interface RelatorioPeriodoRow {
  periodo: string;
  mesKey: string;
  quantidade: number;
  valorTotal: number;
}

export function getRelatorioPorCliente(cotacoes: Cotacao[]): RelatorioClienteRow[] {
  return MOCK_CLIENTES.map((cliente) => {
    const rows = cotacoes.filter((c) => c.clienteId === cliente.id);
    const valorTotal = rows.reduce((s, c) => s + c.valor, 0);
    const ultima = rows.sort((a, b) => b.ultimaAtualizacao.getTime() - a.ultimaAtualizacao.getTime())[0];
    return {
      cliente: cliente.nome,
      clienteId: cliente.id,
      quantidade: rows.length,
      valorTotal,
      ticketMedio: rows.length ? valorTotal / rows.length : 0,
      ultimaCompra: ultima ? formatDate(ultima.ultimaAtualizacao) : '—',
    };
  })
    .filter((r) => r.quantidade > 0)
    .sort((a, b) => b.valorTotal - a.valorTotal);
}

export function getRelatorioPorFornecedor(cotacoes: Cotacao[]): RelatorioFornecedorRow[] {
  const totalGeral = cotacoes.reduce((s, c) => s + c.valor, 0);
  return MOCK_FORNECEDORES.map((f) => {
    const rows = cotacoes.filter((c) => c.fornecedorId === f.id);
    const valorTotal = rows.reduce((s, c) => s + c.valor, 0);
    return {
      fornecedor: f.nome,
      fornecedorId: f.id,
      quantidade: rows.length,
      valorTotal,
      percentual: totalGeral ? (valorTotal / totalGeral) * 100 : 0,
    };
  })
    .filter((r) => r.quantidade > 0)
    .sort((a, b) => b.valorTotal - a.valorTotal);
}

export function getRelatorioPorItem(cotacoes: Cotacao[]): RelatorioItemRow[] {
  const map = new Map<string, { qtd: number; valores: number[]; fornecedores: Set<string> }>();

  cotacoes.forEach((c) => {
    const forn = MOCK_FORNECEDORES.find((f) => f.id === c.fornecedorId)?.nome ?? '';
    c.itens.forEach((item) => {
      const key = item.descricao;
      const entry = map.get(key) ?? { qtd: 0, valores: [], fornecedores: new Set() };
      entry.qtd += item.quantidade;
      if (item.valorUnitario) entry.valores.push(item.valorUnitario);
      if (forn) entry.fornecedores.add(forn);
      map.set(key, entry);
    });
  });

  return Array.from(map.entries())
    .map(([descricao, data]) => ({
      descricao,
      quantidadeCotada: data.qtd,
      valorMedio: data.valores.length
        ? data.valores.reduce((a, b) => a + b, 0) / data.valores.length
        : 0,
      fornecedores: Array.from(data.fornecedores).slice(0, 3).join(', '),
    }))
    .sort((a, b) => b.quantidadeCotada - a.quantidadeCotada)
    .slice(0, 20);
}

export function getRelatorioPorPeriodo(cotacoes: Cotacao[]): RelatorioPeriodoRow[] {
  const months = [
    { key: '2026-01', label: 'Janeiro/2026' },
    { key: '2026-02', label: 'Fevereiro/2026' },
    { key: '2026-03', label: 'Março/2026' },
    { key: '2026-04', label: 'Abril/2026' },
    { key: '2026-05', label: 'Maio/2026' },
    { key: '2026-06', label: 'Junho/2026' },
    { key: '2026-07', label: 'Julho/2026' },
  ];

  return months.map((m) => {
    const [year, month] = m.key.split('-').map(Number);
    const rows = cotacoes.filter((c) => {
      const d = c.ultimaAtualizacao;
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    return {
      periodo: m.label,
      mesKey: m.key,
      quantidade: rows.length,
      valorTotal: rows.reduce((s, c) => s + c.valor, 0),
    };
  });
}

export function formatRelatorioCurrency(value: number) {
  return formatCurrency(value);
}

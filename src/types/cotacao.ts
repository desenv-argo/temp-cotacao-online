export type CotacaoStatus =
  | 'solicitacao_aberta'
  | 'aguardando_fornecedor'
  | 'em_revisao'
  | 'aguardando_aprovacao'
  | 'aprovado'
  | 'cancelado';

export const COTACAO_STATUS_LABELS: Record<CotacaoStatus, string> = {
  solicitacao_aberta: 'Solicitação em aberto',
  aguardando_fornecedor: 'Aguardando fornecedor',
  em_revisao: 'Em revisão',
  aguardando_aprovacao: 'Aguardando aprovação',
  aprovado: 'Aprovado',
  cancelado: 'Cancelado',
};

export interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  contato: string;
  email: string;
  cidade: string;
  estado: string;
}

export interface Fornecedor {
  id: number;
  nome: string;
  cnpj: string;
  cidade: string;
  estado: string;
  cor: string;
}

export interface CotacaoItem {
  id: string;
  descricao: string;
  quantidade: number;
  unidade: string;
  observacao?: string;
  valorUnitario?: number;
  ipi?: number;
  icms?: number;
  baixaConfianca?: boolean;
}

export interface Cotacao {
  id: string;
  numero: string;
  clienteId: number;
  fornecedorId: number;
  fornecedorIds: number[];
  status: CotacaoStatus;
  itens: CotacaoItem[];
  valor: number;
  frete: number;
  observacoes: string;
  prazo: string;
  responsavel: string;
  ultimaAtualizacao: Date;
  criadaEm: Date;
}

export interface TimelineEvent {
  id: string;
  titulo: string;
  descricao?: string;
  data: Date;
  concluido: boolean;
  ativo?: boolean;
}

export interface IaExtracaoResult {
  fornecedor: string;
  itens: CotacaoItem[];
  frete: number;
  prazo: string;
  observacoes: string;
  confianca: number;
  itensBaixaConfianca: CotacaoItem[];
}

export interface DashboardKpis {
  emRevisao: number;
  aguardandoAprovacao: number;
  aprovadosMes: number;
  valorEmAndamento: number;
}

export interface ListaResumo {
  totalCotacoes: number;
  valorTotal: number;
  aguardandoAcao: number;
  aprovadas: number;
}

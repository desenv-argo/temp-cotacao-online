export interface ClienteEmRisco {
  id: number;
  cliente: string;
  frequenciaMedia: string;
  diasDesdeUltimaCompra: number;
  diasAtraso: number;
  valorHistorico: number;
  sugestao: string;
  contato: string;
}

export const MOCK_CLIENTES_EM_RISCO: ClienteEmRisco[] = [
  {
    id: 1,
    cliente: 'Construtora Horizonte',
    frequenciaMedia: '45 dias',
    diasDesdeUltimaCompra: 92,
    diasAtraso: 47,
    valorHistorico: 280000,
    sugestao: 'Padrão de compra interrompido — entrar em contato para entender a pausa na obra.',
    contato: 'Carlos Mendes',
  },
  {
    id: 4,
    cliente: 'Shopping Prime',
    frequenciaMedia: '60 dias',
    diasDesdeUltimaCompra: 98,
    diasAtraso: 38,
    valorHistorico: 195000,
    sugestao: 'Cliente costuma cotar equipamentos de expansão neste período. Verificar novos projetos.',
    contato: 'Juliana Costa',
  },
  {
    id: 6,
    cliente: 'ABC Industrial',
    frequenciaMedia: '30 dias',
    diasDesdeUltimaCompra: 55,
    diasAtraso: 25,
    valorHistorico: 142000,
    sugestao: 'Frequência de compra acima da média do setor. Risco de migração para outro fornecedor.',
    contato: 'Patrícia Lima',
  },
  {
    id: 8,
    cliente: 'Rede Hoteleira Atlântica',
    frequenciaMedia: '90 dias',
    diasDesdeUltimaCompra: 134,
    diasAtraso: 44,
    valorHistorico: 320000,
    sugestao: 'Alto valor histórico — priorizar contato comercial proativo.',
    contato: 'Amanda Ferreira',
  },
];

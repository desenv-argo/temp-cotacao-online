import type { IaExtracaoResult } from '../types/cotacao';
import { generateItens } from './cotacaoItens';
import { MOCK_FORNECEDORES } from './fornecedores';

const itens = generateItens(48, 42);

itens[12].baixaConfianca = true;
itens[12].descricao = 'Compressor scroll 5TR (descrição parcial)';
itens[12].valorUnitario = undefined;

itens[37].baixaConfianca = true;
itens[37].descricao = 'Peça genérica HVAC';
itens[37].valorUnitario = 0;

export const MOCK_IA_EXTRACAO: IaExtracaoResult = {
  fornecedor: MOCK_FORNECEDORES[0].nome,
  itens: itens.map((item, i) => ({
    ...item,
    valorUnitario: item.valorUnitario ?? (i === 12 ? 2850 : 1200),
  })),
  frete: 2450,
  prazo: '15 dias úteis',
  observacoes: 'Preços válidos por 15 dias. Pagamento 28/56 dias. Faturamento direto ao cliente final.',
  confianca: 98.7,
  itensBaixaConfianca: [
    { ...itens[12], valorUnitario: 2850 },
    { ...itens[37], valorUnitario: 1200 },
  ],
};

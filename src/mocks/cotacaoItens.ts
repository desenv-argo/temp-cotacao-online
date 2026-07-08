import type { CotacaoItem } from '../types/cotacao';

const DESCRICOES = [
  'Compressor scroll 5TR R410A',
  'Evaporadora cassete 4 vias 48.000 BTU',
  'Condensadora split 60.000 BTU',
  'Unidade handling 12.000 m³/h',
  'Duto galvanizado Ø 400mm',
  'Duto galvanizado Ø 315mm',
  'Grelha de insuflamento 600x600',
  'Grelha de retorno 800x400',
  'Dampers motorizados Ø 250mm',
  'Tubulação cobre 3/4" tipo L',
  'Tubulação cobre 5/8" tipo L',
  'Isolamento elastomérico 3/4"',
  'Controlador digital BACnet',
  'Sensor de temperatura ambiente',
  'Válvula de expansão eletrônica',
  'Placa eletrônica inverter',
  'Ventilador axial 500mm',
  'Filtro G4 592x592',
  'Suporte metálico para condensadora',
  'Cabo PP 4x2,5mm',
];

const UNIDADES = ['UN', 'M', 'M²', 'KG', 'CX'];

export function generateItens(count: number, seed: number): CotacaoItem[] {
  return Array.from({ length: count }, (_, i) => {
    const idx = (seed + i) % DESCRICOES.length;
    const qtd = ((seed + i) % 8) + 1;
    const valor = 450 + ((seed + i) % 20) * 185;
    return {
      id: `item-${seed}-${i}`,
      descricao: DESCRICOES[idx],
      quantidade: qtd,
      unidade: UNIDADES[(seed + i) % UNIDADES.length],
      observacao: i % 5 === 0 ? 'Instalação em altura' : undefined,
      valorUnitario: valor,
      ipi: 5.2,
      icms: 12,
    };
  });
}

export function calcularValorItens(itens: CotacaoItem[]): number {
  return itens.reduce((sum, item) => sum + (item.valorUnitario ?? 0) * item.quantidade, 0);
}

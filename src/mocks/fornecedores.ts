import type { Fornecedor } from '../types/cotacao';

export const MOCK_FORNECEDORES: Fornecedor[] = [
  { id: 1, nome: 'Frigelar', cnpj: '11111111000111', cidade: 'Joinville', estado: 'SC', cor: '#1976d2' },
  { id: 2, nome: 'Dufrio', cnpj: '22222222000122', cidade: 'Caxias do Sul', estado: 'RS', cor: '#1565c0' },
  { id: 3, nome: 'Clima Rio', cnpj: '33333333000133', cidade: 'Rio de Janeiro', estado: 'RJ', cor: '#42a5f5' },
  { id: 4, nome: 'Leveros', cnpj: '44444444000144', cidade: 'São Paulo', estado: 'SP', cor: '#0d47a1' },
  { id: 5, nome: 'CentralAr', cnpj: '55555555000155', cidade: 'Belo Horizonte', estado: 'MG', cor: '#1e88e5' },
  { id: 6, nome: 'Refrigeração Nacional', cnpj: '66666666000166', cidade: 'Curitiba', estado: 'PR', cor: '#2196f3' },
  { id: 7, nome: 'Master Frio', cnpj: '77777777000177', cidade: 'Porto Alegre', estado: 'RS', cor: '#64b5f6' },
  { id: 8, nome: 'Cold Parts', cnpj: '88888888000188', cidade: 'Campinas', estado: 'SP', cor: '#90caf9' },
];

export function getFornecedorById(id: number): Fornecedor | undefined {
  return MOCK_FORNECEDORES.find((f) => f.id === id);
}

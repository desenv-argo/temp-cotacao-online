import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Cotacao, CotacaoStatus, IaExtracaoResult } from '../types/cotacao';
import { MOCK_COTACOES } from '../mocks/cotacoes';
import { calcularValorItens } from '../mocks/cotacaoItens';
import { MOCK_IA_EXTRACAO } from '../mocks/iaExtracao';
import { MOCK_FORNECEDORES } from '../mocks/fornecedores';

interface CotacaoDemoContextValue {
  cotacoes: Cotacao[];
  criarCotacaoFromImport: (extracao: IaExtracaoResult) => Cotacao;
  getCotacaoById: (id: string) => Cotacao | undefined;
  atualizarCotacao: (id: string, patch: Partial<Cotacao>) => void;
  importarIaParaCotacao: (id: string) => void;
  enviarParaAprovacao: (id: string) => void;
  aprovarCotacao: (id: string) => void;
  iaExtracao: typeof MOCK_IA_EXTRACAO;
}

const CotacaoDemoContext = createContext<CotacaoDemoContextValue | null>(null);

function resolveFornecedorId(nome: string): number {
  const found = MOCK_FORNECEDORES.find(
    (f) => f.nome.toLowerCase() === nome.toLowerCase()
  );
  return found?.id ?? 1;
}

export const CotacaoDemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cotacoes, setCotacoes] = useState<Cotacao[]>(MOCK_COTACOES);
  const [nextNum, setNextNum] = useState(47);

  const getCotacaoById = useCallback(
    (id: string) => cotacoes.find((c) => c.id === id),
    [cotacoes]
  );

  const atualizarCotacao = useCallback((id: string, patch: Partial<Cotacao>) => {
    setCotacoes((list) =>
      list.map((c) =>
        c.id === id ? { ...c, ...patch, ultimaAtualizacao: new Date() } : c
      )
    );
  }, []);

  const criarCotacaoFromImport = useCallback(
    (extracao: IaExtracaoResult) => {
      const numero = `COT-2026-${String(nextNum).padStart(4, '0')}`;
      const id = `cot-demo-${nextNum}`;
      const fornecedorId = resolveFornecedorId(extracao.fornecedor);
      const subtotal = calcularValorItens(extracao.itens);
      const nova: Cotacao = {
        id,
        numero,
        clienteId: 1,
        fornecedorId,
        fornecedorIds: [fornecedorId],
        status: 'em_revisao',
        itens: extracao.itens,
        valor: subtotal + extracao.frete,
        frete: extracao.frete,
        observacoes: extracao.observacoes,
        prazo: extracao.prazo,
        responsavel: 'Ana Paula Silva',
        ultimaAtualizacao: new Date(),
        criadaEm: new Date(),
      };
      setCotacoes((list) => [nova, ...list]);
      setNextNum((n) => n + 1);
      return nova;
    },
    [nextNum]
  );

  const importarIaParaCotacao = useCallback(
    (id: string) => {
      const itens = MOCK_IA_EXTRACAO.itens;
      const subtotal = calcularValorItens(itens);
      atualizarCotacao(id, {
        itens,
        valor: subtotal + MOCK_IA_EXTRACAO.frete,
        frete: MOCK_IA_EXTRACAO.frete,
        prazo: MOCK_IA_EXTRACAO.prazo,
        observacoes: MOCK_IA_EXTRACAO.observacoes,
        status: 'em_revisao' as CotacaoStatus,
      });
    },
    [atualizarCotacao]
  );

  const enviarParaAprovacao = useCallback(
    (id: string) => {
      atualizarCotacao(id, { status: 'aguardando_aprovacao' });
    },
    [atualizarCotacao]
  );

  const aprovarCotacao = useCallback(
    (id: string) => {
      atualizarCotacao(id, { status: 'aprovado' });
    },
    [atualizarCotacao]
  );

  const value = useMemo(
    () => ({
      cotacoes,
      criarCotacaoFromImport,
      getCotacaoById,
      atualizarCotacao,
      importarIaParaCotacao,
      enviarParaAprovacao,
      aprovarCotacao,
      iaExtracao: MOCK_IA_EXTRACAO,
    }),
    [
      cotacoes,
      criarCotacaoFromImport,
      getCotacaoById,
      atualizarCotacao,
      importarIaParaCotacao,
      enviarParaAprovacao,
      aprovarCotacao,
    ]
  );

  return <CotacaoDemoContext.Provider value={value}>{children}</CotacaoDemoContext.Provider>;
};

export function useCotacaoDemo(): CotacaoDemoContextValue {
  const ctx = useContext(CotacaoDemoContext);
  if (!ctx) throw new Error('useCotacaoDemo must be used within CotacaoDemoProvider');
  return ctx;
}

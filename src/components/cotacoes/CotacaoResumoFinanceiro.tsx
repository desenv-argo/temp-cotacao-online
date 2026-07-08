import React from 'react';
import type { Cotacao } from '../../types/cotacao';
import { calcularValorItens } from '../../mocks/cotacaoItens';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

interface CotacaoResumoFinanceiroProps {
  cotacao: Cotacao;
}

const CotacaoResumoFinanceiro: React.FC<CotacaoResumoFinanceiroProps> = ({ cotacao }) => {
  const subtotal = calcularValorItens(cotacao.itens);
  const impostos = subtotal * 0.172;

  return (
    <div className="cotacao-resumo-financeiro">
      <div className="cotacao-resumo-financeiro__row">
        <span>Subtotal</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="cotacao-resumo-financeiro__row">
        <span>Frete</span>
        <span>{formatCurrency(cotacao.frete)}</span>
      </div>
      <div className="cotacao-resumo-financeiro__row">
        <span>Impostos (IPI + ICMS)</span>
        <span>{formatCurrency(impostos)}</span>
      </div>
      <div className="cotacao-resumo-financeiro__row cotacao-resumo-financeiro__row--total">
        <span>Total</span>
        <span>{formatCurrency(cotacao.valor + impostos)}</span>
      </div>
    </div>
  );
};

export default CotacaoResumoFinanceiro;

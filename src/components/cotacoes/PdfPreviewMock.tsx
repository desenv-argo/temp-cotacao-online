import React from 'react';
import type { IaExtracaoResult } from '../../types/cotacao';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

interface PdfPreviewMockProps {
  extracao: IaExtracaoResult;
  expanded?: boolean;
}

const PdfPreviewMock: React.FC<PdfPreviewMockProps> = ({ extracao, expanded = false }) => {
  const previewItens = extracao.itens.slice(0, expanded ? 12 : 6);
  const subtotal = previewItens.reduce(
    (s, i) => s + (i.valorUnitario ?? 0) * i.quantidade,
    0
  );

  return (
    <div className={`pdf-preview-mock${expanded ? ' pdf-preview-mock--expanded' : ''}`}>
      <div className="pdf-preview-mock__page">
        <div className="pdf-preview-mock__header">
          <div>
            <strong>{extracao.fornecedor}</strong>
            <p>Orçamento Comercial · Ref. ORC-2026-0847</p>
          </div>
          <div className="pdf-preview-mock__logo">PDF</div>
        </div>

        <div className="pdf-preview-mock__meta">
          <span>Data: 08/07/2026</span>
          <span>Validade: 15 dias</span>
          <span>Prazo: {extracao.prazo}</span>
        </div>

        <table className="pdf-preview-mock__table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Descrição</th>
              <th>Qtd</th>
              <th>Un.</th>
              <th>V. Unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {previewItens.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.descricao}</td>
                <td>{item.quantidade}</td>
                <td>{item.unidade}</td>
                <td>{formatCurrency(item.valorUnitario ?? 0)}</td>
                <td>{formatCurrency((item.valorUnitario ?? 0) * item.quantidade)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {!expanded && extracao.itens.length > 6 ? (
          <p className="pdf-preview-mock__more">+ {extracao.itens.length - 6} itens no documento completo</p>
        ) : null}

        <div className="pdf-preview-mock__totals">
          <div><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div><span>Frete</span><span>{formatCurrency(extracao.frete)}</span></div>
          <div className="pdf-preview-mock__total-row">
            <span>Total</span>
            <span>{formatCurrency(subtotal + extracao.frete)}</span>
          </div>
        </div>

        <p className="pdf-preview-mock__footer">{extracao.observacoes}</p>
      </div>
    </div>
  );
};

export default PdfPreviewMock;

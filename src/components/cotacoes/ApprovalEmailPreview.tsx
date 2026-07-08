import React from 'react';
import type { Cotacao } from '../../types/cotacao';
import { getClienteById } from '../../mocks/clientes';
import { getFornecedorById } from '../../mocks/fornecedores';
import { formatCurrency, formatDate } from '../../utils/format';
import './cotacoes.css';

interface ApprovalEmailPreviewProps {
  cotacao: Cotacao;
}

const ApprovalEmailPreview: React.FC<ApprovalEmailPreviewProps> = ({ cotacao }) => {
  const cliente = getClienteById(cotacao.clienteId);
  const fornecedor = getFornecedorById(cotacao.fornecedorId);

  return (
    <div className="cotacao-email-preview">
      <div className="cotacao-email-header">
        <h2 style={{ margin: '0 0 8px', fontSize: '1.25rem' }}>Êxito Representações</h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '0.875rem' }}>
          Cotação {cotacao.numero} — Aguardando sua aprovação
        </p>
      </div>
      <div className="cotacao-email-body">
        <p>Prezado(a) {cliente?.contato},</p>
        <p>
          Segue a cotação preparada pela Êxito Representações com o fornecedor{' '}
          <strong>{fornecedor?.nome}</strong>, conforme sua solicitação.
        </p>

        <table>
          <thead>
            <tr>
              <th>Descrição</th>
              <th>Qtd</th>
              <th>Un.</th>
              <th style={{ textAlign: 'right' }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {cotacao.itens.slice(0, 8).map((item) => (
              <tr key={item.id}>
                <td>{item.descricao}</td>
                <td>{item.quantidade}</td>
                <td>{item.unidade}</td>
                <td style={{ textAlign: 'right' }}>
                  {item.valorUnitario != null ? formatCurrency(item.valorUnitario * item.quantidade) : '—'}
                </td>
              </tr>
            ))}
            {cotacao.itens.length > 8 ? (
              <tr>
                <td colSpan={4} style={{ color: 'var(--app-text-muted)', fontStyle: 'italic' }}>
                  + {cotacao.itens.length - 8} itens adicionais
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div style={{ marginTop: 20, padding: '16px 0', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span>Frete</span>
            <strong>{formatCurrency(cotacao.frete)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem' }}>
            <span>Total</span>
            <strong style={{ color: '#1976d2' }}>{formatCurrency(cotacao.valor)}</strong>
          </div>
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--app-text-muted)' }}>
          <strong>Prazo de entrega:</strong> {cotacao.prazo}<br />
          <strong>Validade:</strong> {formatDate(new Date())} + 15 dias<br />
          <strong>Condições:</strong> {cotacao.observacoes}
        </p>

        <p style={{ marginTop: 24, fontSize: '0.875rem' }}>
          Atenciosamente,<br />
          <strong>Ana Paula Silva</strong><br />
          Êxito Representações
        </p>
      </div>
    </div>
  );
};

export default ApprovalEmailPreview;

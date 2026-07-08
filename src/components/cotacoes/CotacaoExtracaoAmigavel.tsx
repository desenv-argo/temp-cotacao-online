import React from 'react';
import { AppButton, AppDataTable, type AppDataTableColumn, AppTag } from '../../ui';
import type { IaExtracaoResult } from '../../types/cotacao';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

interface CotacaoExtracaoAmigavelProps {
  extracao: IaExtracaoResult;
  visibleCount: number;
  done: boolean;
  onConfirm: () => void;
}

const CotacaoExtracaoAmigavel: React.FC<CotacaoExtracaoAmigavelProps> = ({
  extracao,
  visibleCount,
  done,
  onConfirm,
}) => {
  const visibleItens = extracao.itens.slice(0, visibleCount);

  const columns: AppDataTableColumn[] = [
    { field: 'descricao', header: 'Descrição' },
    { field: 'quantidade', header: 'Qtd', style: { width: '70px' } },
    { field: 'unidade', header: 'Un.', style: { width: '60px' } },
    {
      field: 'valorUnitario',
      header: 'Valor unit.',
      align: 'right',
      body: (row) => formatCurrency(row.valorUnitario ?? 0),
    },
    {
      field: 'total',
      header: 'Total',
      align: 'right',
      body: (row) => formatCurrency((row.valorUnitario ?? 0) * row.quantidade),
    },
  ];

  if (!done) {
    return (
      <div className="cotacao-extracao-empty">
        <i className="pi pi-sparkles" />
        <p>Os dados do orçamento aparecerão aqui após a análise do PDF.</p>
      </div>
    );
  }

  return (
    <div className="cotacao-extracao-amigavel">
      <div className="cotacao-extracao-resumo">
        <div className="cotacao-extracao-resumo__item">
          <span className="label">Fornecedor</span>
          <strong>{extracao.fornecedor}</strong>
        </div>
        <div className="cotacao-extracao-resumo__item">
          <span className="label">Prazo de entrega</span>
          <strong>{extracao.prazo}</strong>
        </div>
        <div className="cotacao-extracao-resumo__item">
          <span className="label">Frete</span>
          <strong>{formatCurrency(extracao.frete)}</strong>
        </div>
        <div className="cotacao-extracao-resumo__item">
          <span className="label">Validade</span>
          <strong>15 dias</strong>
        </div>
      </div>

      <div className="cotacao-extracao-confianca">
        <AppTag
          value={`${extracao.confianca}% de confiança — ${extracao.itens.length} itens identificados`}
          tone="success"
        />
      </div>

      <h4 className="cotacao-extracao-section-title">Itens do orçamento</h4>
      <AppDataTable value={visibleItens} columns={columns} dataKey="id" size="small" />
      {visibleCount < extracao.itens.length ? (
        <p className="cotacao-extracao-loading-more">
          <i className="pi pi-spin pi-spinner" /> Carregando mais itens...
        </p>
      ) : null}

      <div className="cotacao-extracao-obs">
        <span className="label">Observações</span>
        <p>{extracao.observacoes}</p>
      </div>

      {extracao.itensBaixaConfianca.length > 0 ? (
        <div className="cotacao-confidence-card">
          <h4>
            <i className="pi pi-exclamation-triangle" /> {extracao.itensBaixaConfianca.length} itens para conferir
          </h4>
          <ul>
            {extracao.itensBaixaConfianca.map((item) => (
              <li key={item.id}>{item.descricao}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <AppButton
        label="Confirmar importação"
        icon="pi pi-check"
        onClick={onConfirm}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default CotacaoExtracaoAmigavel;

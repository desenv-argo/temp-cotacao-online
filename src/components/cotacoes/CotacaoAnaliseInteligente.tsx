import React from 'react';
import { Toast } from 'primereact/toast';
import { AppButton, AppTag } from '../../ui';
import { MOCK_CLIENTES_EM_RISCO } from '../../mocks/clientesEmRisco';
import { formatCurrency } from '../../utils/format';
import './cotacoes.css';

const CotacaoAnaliseInteligente: React.FC = () => {
  const toastRef = React.useRef<Toast>(null);

  return (
    <>
      <Toast ref={toastRef} position="bottom-right" />
      <div className="cotacao-analise-inteligente">
        <div className="cotacao-analise-inteligente__header">
          <div>
            <h3>
              <i className="pi pi-sparkles" /> Análise inteligente
            </h3>
            <p>Clientes com padrão de compra interrompido — oportunidades de contato proativo</p>
          </div>
          <AppTag value={`${MOCK_CLIENTES_EM_RISCO.length} alertas`} tone="warning" />
        </div>

        <div className="cotacao-analise-inteligente__list">
          {MOCK_CLIENTES_EM_RISCO.map((cliente) => (
            <div key={cliente.id} className="cotacao-analise-card">
              <div className="cotacao-analise-card__main">
                <strong>{cliente.cliente}</strong>
                <p>
                  Compra a cada <strong>~{cliente.frequenciaMedia}</strong> · última compra há{' '}
                  <strong>{cliente.diasDesdeUltimaCompra} dias</strong> · atraso de{' '}
                  <strong>{cliente.diasAtraso} dias</strong>
                </p>
                <p className="cotacao-analise-card__sugestao">{cliente.sugestao}</p>
                <span className="cotacao-analise-card__meta">
                  Histórico: {formatCurrency(cliente.valorHistorico)} · Contato: {cliente.contato}
                </span>
              </div>
              <div className="cotacao-analise-card__actions">
                <AppButton label="Ver histórico" icon="pi pi-history" severity="secondary" outlined text />
                <AppButton
                  label="Registrar contato"
                  icon="pi pi-phone"
                  onClick={() =>
                    toastRef.current?.show({
                      severity: 'success',
                      summary: 'Contato registrado',
                      detail: `Follow-up com ${cliente.contato} agendado.`,
                      life: 3000,
                    })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CotacaoAnaliseInteligente;

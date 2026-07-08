import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { AppButton, AppPage, AppPageHeader, AppSection, AppWorkspaceShell } from '../../ui';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import '../../components/cotacoes/cotacoes.css';

const CotacaoPedidoAprovadoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);
  const { getCotacaoById } = useCotacaoDemo();
  const cotacao = id ? getCotacaoById(id) : undefined;

  if (!cotacao) {
    return (
      <AppWorkspaceShell>
        <AppPage>
          <AppPageHeader title="Cotação não encontrada" icon={<i className="pi pi-exclamation-triangle" />} />
        </AppPage>
      </AppWorkspaceShell>
    );
  }

  const handleFinalizar = () => {
    toastRef.current?.show({
      severity: 'success',
      summary: 'Processo finalizado',
      detail: 'A Êxito acompanhará o pós-venda deste pedido.',
      life: 4000,
    });
    setTimeout(() => navigate('/cotacoes'), 1500);
  };

  return (
    <AppWorkspaceShell>
      <Toast ref={toastRef} position="bottom-right" />
      <AppPage>
        <AppPageHeader title="Pedido Aprovado" subtitle={cotacao.numero} icon={<i className="pi pi-check-circle" />} />

        <AppSection>
          <div className="cotacao-success-state">
            <i className="pi pi-check-circle" />
            <h2>Pedido aprovado</h2>
            <p>
              O fornecedor realizará o faturamento diretamente para o cliente.
              A Êxito Representações acompanhará todo o pós-venda.
            </p>
            <AppButton label="Finalizar processo" icon="pi pi-flag" onClick={handleFinalizar} />
          </div>
        </AppSection>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoPedidoAprovadoPage;

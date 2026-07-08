import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppButton, AppPage, AppPageHeader, AppSection, AppTag, AppWorkspaceShell } from '../../ui';
import CotacaoItemsEditor from '../../components/cotacoes/CotacaoItemsEditor';
import CotacaoResumoFinanceiro from '../../components/cotacoes/CotacaoResumoFinanceiro';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import { getClienteById } from '../../mocks/clientes';
import { getFornecedorById } from '../../mocks/fornecedores';
import { formatCnpj } from '../../utils/format';
import '../../components/cotacoes/cotacoes.css';

const CotacaoRevisaoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCotacaoById, enviarParaAprovacao } = useCotacaoDemo();
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

  const cliente = getClienteById(cotacao.clienteId);
  const fornecedor = getFornecedorById(cotacao.fornecedorId);

  const handleEnviar = () => {
    if (id) {
      enviarParaAprovacao(id);
      navigate(`/cotacoes/${id}/aprovacao`);
    }
  };

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Revisão da Cotação"
          subtitle={cotacao.numero}
          icon={<i className="pi pi-eye" />}
          actions={
            <>
              <AppTag value="Importado via IA" tone="info" />
              <AppButton label="Enviar para aprovação" icon="pi pi-send" onClick={handleEnviar} />
            </>
          }
        />

        <div className="cotacao-two-col">
          <AppSection title="Cliente">
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.0625rem' }}>{cliente?.nome}</p>
            <p style={{ margin: '4px 0 0', color: 'var(--app-text-muted)', fontSize: '0.875rem' }}>
              {formatCnpj(cliente?.cnpj ?? '')} · {cliente?.contato}
            </p>
          </AppSection>

          <AppSection title="Fornecedor">
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1.0625rem' }}>{fornecedor?.nome}</p>
            <p style={{ margin: '4px 0 0', color: 'var(--app-text-muted)', fontSize: '0.875rem' }}>
              Prazo: {cotacao.prazo || '—'}
            </p>
          </AppSection>
        </div>

        <div style={{ marginTop: 20 }}>
          <AppSection title="Itens">
            <CotacaoItemsEditor itens={cotacao.itens} onChange={() => {}} editable={false} />
          </AppSection>
        </div>

        <div className="cotacao-two-col" style={{ marginTop: 20 }}>
          <AppSection title="Observações">
            <p style={{ margin: 0, color: 'var(--app-text-muted)' }}>
              {cotacao.observacoes || 'Nenhuma observação.'}
            </p>
          </AppSection>
          <AppSection title="Resumo financeiro">
            <CotacaoResumoFinanceiro cotacao={cotacao} />
          </AppSection>
        </div>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoRevisaoPage;

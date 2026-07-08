import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppButton, AppPage, AppPageHeader, AppSection, AppWorkspaceShell } from '../../ui';
import CotacaoTimeline from '../../components/cotacoes/CotacaoTimeline';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import { getClienteById } from '../../mocks/clientes';
import type { TimelineEvent } from '../../types/cotacao';
import '../../components/cotacoes/cotacoes.css';

const CotacaoAguardandoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
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

  const cliente = getClienteById(cotacao.clienteId);
  const now = new Date();

  const events: TimelineEvent[] = [
    {
      id: '1',
      titulo: 'Cliente solicitou',
      descricao: `${cliente?.nome} enviou lista de materiais`,
      data: cotacao.criadaEm,
      concluido: true,
    },
    {
      id: '2',
      titulo: 'Solicitação enviada',
      descricao: `Enviada para ${cotacao.fornecedorIds.length} fornecedor(es)`,
      data: new Date(now.getTime() - 3600000 * 4),
      concluido: true,
    },
    {
      id: '3',
      titulo: 'Fornecedor preparando orçamento',
      descricao: 'O fornecedor está elaborando a proposta',
      data: now,
      concluido: false,
      ativo: true,
    },
    {
      id: '4',
      titulo: 'Aguardando PDF',
      descricao: 'Retorno do orçamento em PDF do fornecedor',
      data: now,
      concluido: false,
    },
  ];

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Aguardando Retorno"
          subtitle={`${cotacao.numero} · ${cliente?.nome}`}
          icon={<i className="pi pi-clock" />}
        />

        <AppSection>
          <CotacaoTimeline events={events} title="Status da solicitação" />
          <AppButton
            label="Importar PDF do fornecedor"
            icon="pi pi-file-pdf"
            onClick={() => navigate(`/cotacoes/${id}/importacao`)}
            style={{ marginTop: 24 }}
          />
        </AppSection>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoAguardandoPage;

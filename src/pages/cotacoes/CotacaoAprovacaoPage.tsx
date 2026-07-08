import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { AppButton, AppPage, AppPageHeader, AppSection, AppWorkspaceShell } from '../../ui';
import ApprovalEmailPreview from '../../components/cotacoes/ApprovalEmailPreview';
import CotacaoTimeline from '../../components/cotacoes/CotacaoTimeline';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import type { TimelineEvent } from '../../types/cotacao';
import '../../components/cotacoes/cotacoes.css';

const CotacaoAprovacaoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastRef = React.useRef<Toast>(null);
  const { getCotacaoById, aprovarCotacao } = useCotacaoDemo();
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

  const now = new Date();
  const events: TimelineEvent[] = [
    { id: '1', titulo: 'Solicitação criada', data: cotacao.criadaEm, concluido: true },
    {
      id: '2',
      titulo: 'Fornecedor respondeu',
      data: new Date(now.getTime() - 86400000 * 2),
      concluido: true,
    },
    {
      id: '3',
      titulo: 'Cotação enviada',
      data: new Date(now.getTime() - 86400000),
      concluido: true,
    },
    {
      id: '4',
      titulo: 'Cliente visualizou',
      data: new Date(now.getTime() - 3600000 * 3),
      concluido: true,
    },
    {
      id: '5',
      titulo: 'Cliente aprovou',
      data: now,
      concluido: false,
      ativo: true,
    },
  ];

  const handleAprovar = () => {
    if (id) {
      aprovarCotacao(id);
      navigate(`/cotacoes/${id}/aprovado`);
    }
  };

  const handleAlteracao = () => {
    toastRef.current?.show({
      severity: 'info',
      summary: 'Solicitação enviada',
      detail: 'O cliente solicitou alterações. Você será notificado.',
      life: 4000,
    });
  };

  return (
    <AppWorkspaceShell>
      <Toast ref={toastRef} position="bottom-right" />
      <AppPage>
        <AppPageHeader
          title="Aprovação do Cliente"
          subtitle="Visualização do e-mail enviado ao cliente"
          icon={<i className="pi pi-envelope" />}
        />

        <div className="cotacao-aprovacao-layout">
          <div>
            <ApprovalEmailPreview cotacao={cotacao} />
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <AppButton label="Aprovar" icon="pi pi-check" severity="success" onClick={handleAprovar} />
              <AppButton
                label="Solicitar alteração"
                icon="pi pi-pencil"
                severity="secondary"
                outlined
                onClick={handleAlteracao}
              />
            </div>
          </div>
          <AppSection title="Histórico">
            <CotacaoTimeline events={events} />
          </AppSection>
        </div>
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoAprovacaoPage;

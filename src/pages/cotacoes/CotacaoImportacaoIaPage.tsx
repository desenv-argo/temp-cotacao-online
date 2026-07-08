import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppPage, AppPageHeader, AppWorkspaceShell } from '../../ui';
import AiImportPanel from '../../components/cotacoes/AiImportPanel';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import '../../components/cotacoes/cotacoes.css';

const CotacaoImportacaoIaPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCotacaoById, iaExtracao, importarIaParaCotacao } = useCotacaoDemo();
  const cotacao = id ? getCotacaoById(id) : undefined;

  if (!cotacao || !id) {
    return (
      <AppWorkspaceShell>
        <AppPage>
          <AppPageHeader title="Cotação não encontrada" icon={<i className="pi pi-exclamation-triangle" />} />
        </AppPage>
      </AppWorkspaceShell>
    );
  }

  const handleImport = () => {
    importarIaParaCotacao(id);
    navigate(`/cotacoes/${id}/revisao`);
  };

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Importação Inteligente"
          subtitle={`Interpretação automática do PDF · ${cotacao.numero}`}
          icon={<i className="pi pi-sparkles" />}
        />
        <AiImportPanel extracao={iaExtracao} onImport={handleImport} />
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoImportacaoIaPage;

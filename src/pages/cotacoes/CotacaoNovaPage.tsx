import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppPage, AppPageHeader, AppWorkspaceShell } from '../../ui';
import AiImportPanel from '../../components/cotacoes/AiImportPanel';
import { useCotacaoDemo } from '../../context/CotacaoDemoContext';
import '../../components/cotacoes/cotacoes.css';

const CotacaoNovaPage: React.FC = () => {
  const navigate = useNavigate();
  const { iaExtracao, criarCotacaoFromImport } = useCotacaoDemo();

  const handleImport = () => {
    const nova = criarCotacaoFromImport(iaExtracao);
    navigate(`/cotacoes/${nova.id}/revisao`);
  };

  return (
    <AppWorkspaceShell>
      <AppPage>
        <AppPageHeader
          title="Importar PDF"
          subtitle="O fornecedor enviou um orçamento — a IA vai preencher tudo automaticamente"
          icon={<i className="pi pi-file-pdf" />}
        />
        <AiImportPanel extracao={iaExtracao} onImport={handleImport} />
      </AppPage>
    </AppWorkspaceShell>
  );
};

export default CotacaoNovaPage;

import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import CotacaoAguardandoPage from '../pages/cotacoes/CotacaoAguardandoPage';
import CotacaoAprovacaoPage from '../pages/cotacoes/CotacaoAprovacaoPage';
import CotacaoImportacaoIaPage from '../pages/cotacoes/CotacaoImportacaoIaPage';
import CotacaoNovaPage from '../pages/cotacoes/CotacaoNovaPage';
import CotacaoPedidoAprovadoPage from '../pages/cotacoes/CotacaoPedidoAprovadoPage';
import CotacaoRevisaoPage from '../pages/cotacoes/CotacaoRevisaoPage';
import CotacoesAnalyticsPage from '../pages/cotacoes/CotacoesAnalyticsPage';
import CotacoesDashboardPage from '../pages/cotacoes/CotacoesDashboardPage';
import CotacoesListPage from '../pages/cotacoes/CotacoesListPage';

const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/cotacoes" replace />} />
    <Route path="/cotacoes" element={<CotacoesDashboardPage />} />
    <Route path="/cotacoes/lista" element={<CotacoesListPage />} />
    <Route path="/cotacoes/nova" element={<CotacaoNovaPage />} />
    <Route path="/cotacoes/analytics" element={<CotacoesAnalyticsPage />} />
    <Route path="/cotacoes/:id/aguardando" element={<CotacaoAguardandoPage />} />
    <Route path="/cotacoes/:id/importacao" element={<CotacaoImportacaoIaPage />} />
    <Route path="/cotacoes/:id/revisao" element={<CotacaoRevisaoPage />} />
    <Route path="/cotacoes/:id/aprovacao" element={<CotacaoAprovacaoPage />} />
    <Route path="/cotacoes/:id/aprovado" element={<CotacaoPedidoAprovadoPage />} />
    <Route path="*" element={<Navigate to="/cotacoes" replace />} />
  </Routes>
);

export default AppRoutes;

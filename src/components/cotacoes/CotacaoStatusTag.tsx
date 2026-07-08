import React from 'react';
import { AppTag } from '../../ui';
import type { CotacaoStatus } from '../../types/cotacao';
import { COTACAO_STATUS_LABELS } from '../../types/cotacao';

const STATUS_TONE: Record<CotacaoStatus, 'info' | 'warning' | 'contrast' | 'success' | 'danger'> = {
  solicitacao_aberta: 'info',
  aguardando_fornecedor: 'warning',
  em_revisao: 'info',
  aguardando_aprovacao: 'contrast',
  aprovado: 'success',
  cancelado: 'danger',
};

interface CotacaoStatusTagProps {
  status: CotacaoStatus;
}

const CotacaoStatusTag: React.FC<CotacaoStatusTagProps> = ({ status }) => (
  <AppTag value={COTACAO_STATUS_LABELS[status]} tone={STATUS_TONE[status]} />
);

export default CotacaoStatusTag;

import React from 'react';
import { AppButton, AppDataTable, type AppDataTableColumn, AppTextInput } from '../../ui';
import type { CotacaoItem } from '../../types/cotacao';

interface CotacaoItemsEditorProps {
  itens: CotacaoItem[];
  onChange: (itens: CotacaoItem[]) => void;
  editable?: boolean;
  onImportExcel?: () => void;
}

const CotacaoItemsEditor: React.FC<CotacaoItemsEditorProps> = ({
  itens,
  onChange,
  editable = true,
  onImportExcel,
}) => {
  const updateItem = (id: string, field: keyof CotacaoItem, value: string | number) => {
    onChange(
      itens.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    onChange([
      ...itens,
      {
        id: `new-${Date.now()}`,
        descricao: '',
        quantidade: 1,
        unidade: 'UN',
      },
    ]);
  };

  const removeItem = (id: string) => {
    onChange(itens.filter((item) => item.id !== id));
  };

  const columns: AppDataTableColumn[] = [
    {
      field: 'descricao',
      header: 'Descrição',
      body: (row: CotacaoItem) =>
        editable ? (
          <AppTextInput
            value={row.descricao}
            onChange={(v) => updateItem(row.id, 'descricao', v)}
            placeholder="Descrição do item"
          />
        ) : (
          row.descricao
        ),
    },
    {
      field: 'quantidade',
      header: 'Qtd',
      style: { width: '100px' },
      body: (row: CotacaoItem) =>
        editable ? (
          <AppTextInput
            value={String(row.quantidade)}
            onChange={(v) => updateItem(row.id, 'quantidade', Number(v) || 0)}
          />
        ) : (
          row.quantidade
        ),
    },
    {
      field: 'unidade',
      header: 'Un.',
      style: { width: '80px' },
      body: (row: CotacaoItem) =>
        editable ? (
          <AppTextInput
            value={row.unidade}
            onChange={(v) => updateItem(row.id, 'unidade', v)}
          />
        ) : (
          row.unidade
        ),
    },
    {
      field: 'observacao',
      header: 'Observação',
      body: (row: CotacaoItem) =>
        editable ? (
          <AppTextInput
            value={row.observacao ?? ''}
            onChange={(v) => updateItem(row.id, 'observacao', v)}
            placeholder="Opcional"
          />
        ) : (
          row.observacao ?? '—'
        ),
    },
  ];

  if (editable) {
    columns.push({
      field: 'acoes',
      header: '',
      style: { width: '60px' },
      body: (row: CotacaoItem) => (
        <AppButton
          icon="pi pi-trash"
          severity="secondary"
          text
          onClick={() => removeItem(row.id)}
        />
      ),
    });
  }

  if (!editable && itens[0]?.valorUnitario != null) {
    columns.splice(3, 0, {
      field: 'valorUnitario',
      header: 'Valor Unit.',
      align: 'right',
      body: (row: CotacaoItem) =>
        row.valorUnitario != null
          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(row.valorUnitario)
          : '—',
    });
  }

  return (
    <div>
      <AppDataTable value={itens} columns={columns} dataKey="id" emptyMessage="Nenhum item adicionado" />
      {editable ? (
        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <AppButton label="Adicionar item" icon="pi pi-plus" onClick={addItem} />
          {onImportExcel ? (
            <AppButton
              label="Importar Excel"
              icon="pi pi-file-excel"
              severity="secondary"
              outlined
              onClick={onImportExcel}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default CotacaoItemsEditor;

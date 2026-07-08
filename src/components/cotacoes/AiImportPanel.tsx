import React, { useEffect, useState } from 'react';
import { ProgressBar } from 'primereact/progressbar';
import { AppButton, AppSection } from '../../ui';
import type { IaExtracaoResult } from '../../types/cotacao';
import CotacaoExtracaoAmigavel from './CotacaoExtracaoAmigavel';
import PdfPreviewMock from './PdfPreviewMock';
import './cotacoes.css';

const ANALYSIS_STEPS = [
  'Lendo tabelas do orçamento...',
  'Identificando valores e impostos...',
  'Organizando itens e quantidades...',
  'Validando confiança dos dados...',
];

interface AiImportPanelProps {
  extracao: IaExtracaoResult;
  onImport: () => void;
  fileName?: string;
}

const AiImportPanel: React.FC<AiImportPanelProps> = ({
  extracao,
  onImport,
  fileName = 'Orçamento_Frigelar_2026.pdf',
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  const startAnalysis = () => {
    setAnalyzing(true);
    setProgress(0);
    setStepIndex(0);
    setDone(false);
    setVisibleCount(0);
    setShowPdfPreview(true);
  };

  useEffect(() => {
    if (!analyzing) return undefined;

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 4, 100);
        if (next >= 100) {
          setAnalyzing(false);
          setDone(true);
          clearInterval(interval);
        }
        return next;
      });
    }, 120);

    const stepInterval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, ANALYSIS_STEPS.length - 1));
    }, 600);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [analyzing]);

  useEffect(() => {
    if (!done) return undefined;
    const interval = setInterval(() => {
      setVisibleCount((v) => {
        if (v >= Math.min(extracao.itens.length, 8)) {
          clearInterval(interval);
          setTimeout(() => setVisibleCount(extracao.itens.length), 400);
          return v;
        }
        return v + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [done, extracao.itens.length]);

  return (
    <div className="cotacao-two-col">
      <AppSection title="Documento do fornecedor">
        <div className="cotacao-ia-file-row">
          <div className="cotacao-ia-pdf-preview">
            <div className="cotacao-ia-pdf-icon">
              <i className="pi pi-file-pdf" />
            </div>
            <div>
              <strong>{fileName}</strong>
              <p>2,4 MB · Enviado pelo fornecedor</p>
            </div>
          </div>
          <AppButton
            label={showPdfPreview ? 'Ocultar PDF' : 'Visualizar PDF'}
            icon="pi pi-eye"
            severity="secondary"
            outlined
            onClick={() => setShowPdfPreview((v) => !v)}
          />
        </div>

        {showPdfPreview ? <PdfPreviewMock extracao={extracao} expanded /> : null}

        {!analyzing && !done ? (
          <div className="cotacao-ia-upload" onClick={startAnalysis} role="button" tabIndex={0}>
            <i className="pi pi-cloud-upload" />
            <p>Clique para analisar o PDF com IA</p>
            <span>O sistema vai ler o orçamento e preencher os dados automaticamente</span>
          </div>
        ) : null}

        {analyzing ? (
          <div className="cotacao-ia-progress">
            <p>
              <i className="pi pi-spin pi-spinner" /> IA analisando documento...
            </p>
            <p className="cotacao-ia-progress__step">{ANALYSIS_STEPS[stepIndex]}</p>
            <ProgressBar value={progress} showValue={false} style={{ height: 8 }} />
          </div>
        ) : null}

        {done ? (
          <div className="cotacao-ia-done">
            <i className="pi pi-check-circle" /> Documento interpretado com sucesso
          </div>
        ) : null}

        {!analyzing && !done ? (
          <AppButton label="Analisar com IA" icon="pi pi-sparkles" onClick={startAnalysis} style={{ marginTop: 16 }} />
        ) : null}
      </AppSection>

      <AppSection title="Dados extraídos do orçamento">
        <CotacaoExtracaoAmigavel
          extracao={extracao}
          visibleCount={visibleCount}
          done={done}
          onConfirm={onImport}
        />
      </AppSection>
    </div>
  );
};

export default AiImportPanel;

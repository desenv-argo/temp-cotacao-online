# Cotações — Preview Êxito Representações

Preview navegável do módulo **Cotações** para o ERP da Êxito Representações. Front-end apenas, sem backend — pensado para apresentação e validação do fluxo comercial com o cliente.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)
![PrimeReact](https://img.shields.io/badge/PrimeReact-10-0F6CBD)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

## Sobre o projeto

A Êxito Representações atua como broker comercial em equipamentos e peças de ar condicionado. Hoje o processo de cotação acontece por e-mail, planilhas e PDFs. Este preview mostra como o fluxo ficaria **dentro do ERP**: organizado, rápido e com **importação inteligente de PDFs** enviados pelos fornecedores.

O foco não é tecnologia — é mostrar uma operação mais simples, onde a IA elimina a digitação manual e acelera significativamente o processo de cotação.

## Demonstração rápida

```bash
npm install
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no navegador.

### Fluxo sugerido (≈ 2 min)

1. **Importar PDF** — o fornecedor enviou o orçamento; a IA lê o documento
2. **Visualizar PDF** + **Analisar com IA** — preview do documento e extração automática
3. **Confirmar importação** → **Revisão** — conferir itens, frete e totais
4. **Enviar para aprovação** — mock do e-mail que o cliente receberia
5. **Aprovar** → **Finalizar processo**

## Telas

| Rota | Descrição |
|------|-----------|
| `/cotacoes` | Dashboard executivo com KPIs, gráficos e itens que precisam de atenção |
| `/cotacoes/lista` | Lista com filtros, cards de totalização e paginação |
| `/cotacoes/nova` | Entrada do fluxo — importação de PDF do fornecedor |
| `/cotacoes/:id/revisao` | Revisão da cotação importada |
| `/cotacoes/:id/aprovacao` | Aprovação do cliente (mock de e-mail) |
| `/cotacoes/:id/aprovado` | Pedido aprovado |
| `/cotacoes/analytics` | Indicadores + aba Relatórios exportáveis |

## Destaques de UX

- **Fluxo centrado em PDF** — o usuário nunca lança cotação manualmente; tudo começa na importação do orçamento do fornecedor
- **Preview visual do PDF** — sensação real de que o documento será importado
- **Dados amigáveis para vendedores** — extração em tabelas e cards, sem JSON técnico
- **Dashboard enxuto** — só o que importa, com drill-down em KPIs e gráficos
- **Análise inteligente** — alertas de clientes com padrão de compra interrompido
- **Relatórios** — por cliente, fornecedor, item e período, com exportação CSV/PDF

## Stack

- **React 19** + **TypeScript**
- **Vite** — build e dev server
- **PrimeReact** + **PrimeIcons** — componentes e identidade visual do ERP
- **MUI** + **MUI X Charts** — stepper e gráficos
- **React Router** — navegação entre telas

O design system (`src/ui/`) segue o padrão visual do ERP Argo: sidebar azul, topo azul, cards brancos, tema Lara Light Blue.

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |

## Estrutura

```
src/
├── components/cotacoes/   # Componentes do módulo (IA, timeline, relatórios…)
├── context/               # Estado demo do fluxo de cotações
├── mocks/                 # Dados fictícios (clientes, fornecedores, cotações)
├── pages/cotacoes/        # Telas do módulo
├── routes/                # Rotas React Router
└── ui/                    # Design system (layout, tabelas, cards, formulários)
```

## Dados de demonstração

- **10 clientes** fictícios (Construtora Horizonte, Hospital São Lucas, etc.)
- **8 fornecedores** (Frigelar, Dufrio, Clima Rio, Leveros, etc.)
- **25 cotações** com status, valores e datas consistentes
- **48 itens** na extração IA simulada (98,7% de confiança)

---

Desenvolvido como preview para **Êxito Representações** · [Argo Tecnologia](https://github.com/desenv-argo)

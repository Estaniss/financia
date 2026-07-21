# Financ.IA

Simulador financeiro pessoal com diagnóstico e insights gerados por IA. O usuário responde algumas perguntas sobre sua renda, custos e objetivos, e recebe uma análise personalizada — incluindo sugestões, ideias de renda extra, indicações de investimento e um chat para tirar dúvidas sobre a própria simulação.

## ✨ Funcionalidades

- **Simulador multi-etapas**: formulário guiado com barra de progresso, coletando renda mensal, custos fixos, parcelas/dívidas e objetivo financeiro
- **Máscara de moeda em tempo real**: campos monetários formatados automaticamente em Real (R$) enquanto o usuário digita
- **Diagnóstico com IA (Google Gemini)**: análise de viabilidade da meta, diagnóstico do orçamento, sugestões práticas, ideias de renda extra e investimento, e mensagem motivacional
- **Chat contextual**: o usuário pode fazer perguntas de acompanhamento sobre sua própria simulação, e a IA responde com base nos dados e no diagnóstico já gerado
- **Histórico de simulações**: todas as simulações ficam salvas localmente e podem ser revisitadas a qualquer momento
- **Tema claro/escuro**: alternância de tema com persistência e detecção da preferência do sistema
- **Design system próprio**: paleta de cores customizada, tipografia (Inter) e componentes reutilizáveis (Button, inputs, cards)

## 🛠️ Stack técnica

| Categoria | Tecnologia |
|---|---|
| Build tool | Vite |
| Linguagem | TypeScript |
| UI | React 19 |
| Roteamento | React Router (v8) |
| Estilização | Tailwind CSS v4 |
| Ícones | Lucide React |
| IA | Google Gemini API |
| Lint/Format | ESLint (flat config) + Prettier |
| Persistência | localStorage |

## 🎨 Design system

A paleta de cores é composta por 5 escalas (`cotton-rose`, `petal-pink`, `purple-x11`, `indigo-velvet`, `shadow-grey`), cada uma com variações de 50 a 950. Sobre essa paleta bruta, existem **tokens semânticos** (`background`, `foreground`, `primary`, `card`, `border`, `destructive`, etc.) que trocam de valor automaticamente entre os temas claro e escuro, definidos em `src/styles/theme.css`.

A fonte utilizada é a [Inter](https://fontsource.org/fonts/inter), carregada via `@fontsource/inter`.

## 🤖 Integração com IA

O diagnóstico financeiro é gerado pela API do Google Gemini a partir dos dados da simulação (renda, custos, dívidas, meta). O prompt instrui o modelo a retornar um JSON estruturado com:

- `feasibility` — se a meta é viável, precisa de ajustes ou é inviável no ritmo atual
- `diagnosis` — diagnóstico do comprometimento do orçamento
- `suggestions` — sugestões práticas de economia
- `extraIncome` — ideias de renda extra
- `investment` — sugestões de investimento
- `motivation` — mensagem final personalizada

Após o diagnóstico inicial, o usuário pode continuar a conversa em um chat dentro da tela de resultados, com a IA respondendo com base no contexto da simulação e do diagnóstico já apresentado.

> ⚠️ A chamada à API do Gemini é feita diretamente do frontend neste projeto (chave exposta via variável de ambiente `VITE_`). Para um ambiente de produção real, recomenda-se mover essa chamada para um backend ou função serverless, evitando expor a API key no bundle do cliente.

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js 18+
- Uma chave de API do [Google AI Studio](https://aistudio.google.com/) (Gemini)

### Instalação

```bash
npm install
```

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```
VITE_GEMINI_API_KEY=sua_chave_aqui
```

### Rodando em desenvolvimento

```bash
npm run dev
```

### Build de produção

```bash
npm run build
```

### Lint e formatação

```bash
npm run lint
npx prettier --write .
```

O projeto está configurado para formatar automaticamente ao salvar no VSCode (Prettier + ESLint com fix-on-save), remover imports não utilizados e ordenar imports automaticamente.

## 🧭 Rotas

| Rota | Descrição |
|---|---|
| `/` | Formulário do simulador |
| `/resultado/:id` | Resultado da simulação, com diagnóstico da IA e chat |
| `/historico` | Lista de simulações já realizadas |


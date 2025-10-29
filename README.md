# Dashboard Esportivo (Interclasse)

Um painel administrativo e frontend para gerenciar jogos, jogadores, turmas e eventos do Interclasse. Construído com Next.js (App Router), TypeScript, Tailwind e um conjunto de componentes UI reutilizáveis.

---

## Sumário

- [Visão Geral](#vis%C3%A3o-geral)
- [Requisitos](#requisitos)
- [Instalação & execução local](#instala%C3%A7%C3%A3o--execu%C3%A7%C3%A3o-local)
- [Scripts úteis](#scripts-%C3%BAteis)
- [Licença](#licen%C3%A7a)

---

## Visão Geral

Este repositório contém a aplicação frontend administrativa e componentes compartilhados para:
- Listar e gerenciar jogos (`/admin/games/manage/[id]`)
- Gerenciar jogadores (`/admin/players`)
- Criar/editar turmas e times
- Registrar eventos de partidas (gols, cartões, substituições)
- Painéis de relatórios (classificações, estatísticas)

O frontend consome uma API REST (backend separado). Muitos componentes esperam endpoints específicos com formatos comuns (ver seção "API").

---

## Requisitos

- Node.js 18+ (recomendado 18.x/20.x)
- npm ou yarn
- Git (para clonar o repo)
- Backend ou mock que exponha os endpoints esperados (ver seção "API")

---

## Instalação & execução local

1. Clone o repositório:
```bash
git clone <repo-url>
cd projetoX-main
```

2. Instale dependências:
```bash
npm install
# ou
# yarn
```

3. Crie um arquivo `.env.local` (exemplo abaixo) com as variáveis necessárias.

4. Execute em modo desenvolvimento:
```bash
npm run dev
# abre em http://localhost:3000
```

5. Para build de produção:
```bash
npm run build
npm run start
```
---

## Scripts úteis (em `package.json`)

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — start após build
- `npm run lint` — linter
- `npm run test` — (se houver testes configurados)

---

## Licença

Projeto com licença MIT — ver `LICENSE` para mais detalhes.

---

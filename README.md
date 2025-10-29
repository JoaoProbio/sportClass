# projetoX-main — Dashboard Esportivo (Interclasse)

Um painel administrativo e frontend para gerenciar jogos, jogadores, turmas e eventos do Interclasse. Construído com Next.js (App Router), TypeScript, Tailwind e um conjunto de componentes UI reutilizáveis.

Este README foi reescrito para incluir instruções de setup, variáveis de ambiente importantes, como testar funcionalidades (especialmente paginação/carregamento de jogadores), e dicas de troubleshooting para problemas recorrentes.

---

## Sumário

- [Visão Geral](#vis%C3%A3o-geral)
- [Requisitos](#requisitos)
- [Instalação & execução local](#instala%C3%A7%C3%A3o--execu%C3%A7%C3%A3o-local)
- [Principais variáveis de ambiente](#principais-vari%C3%A1veis-de-ambiente)
- [Scripts úteis](#scripts-%C3%BAteis)
- [Testes e QA manual](#testes-e-qa-manual)
- [Depuração & Troubleshooting](#depura%C3%A7%C3%A3o--troubleshooting)
- [API — expectativas e endpoints importantes](#api---expectativas-e-endpoints-importantes)
- [Contribuição](#contribui%C3%A7%C3%A3o)
- [Deploy](#deploy)
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

## Principais variáveis de ambiente

Coloque essas variáveis em `.env.local` (não commitar esse arquivo).

- `NEXT_PUBLIC_API_BASE` — URL base do backend (ex.: `https://api.example.com`). Se não definido, o cliente tenta usar `https://mainone-ptsq.onrender.com` como fallback durante o desenvolvimento, mas a configuração correta é recomendada.
- `NEXT_PUBLIC_API_DEBUG` — `true`|`false`. Quando `true`, o `apiClient` imprime logs detalhados de requisições, alternativas de 404 e tentativas de host fallback. Útil para diagnosticar 404/CORS.
- `NEXT_PUBLIC_SENTRY_DSN` — (opcional) DSN do Sentry para monitoramento.
- Outros segredos (tokens, chaves) devem ser configurados conforme ambiente (e não comitados).

Exemplo minimal:
```
NEXT_PUBLIC_API_BASE=https://mainone-ptsq.onrender.com
NEXT_PUBLIC_API_DEBUG=true
```

---

## Scripts úteis (em `package.json`)

- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run start` — start após build
- `npm run lint` — linter
- `npm run test` — (se houver testes configurados)

---

## Testes e QA manual

Não há suíte de testes e2e padrão neste template; siga estas etapas para checar as partes críticas:

1. Carregamento de jogadores (paginação)
   - Abra `http://localhost:3000/admin/players`.
   - Observe no DevTools (Network) chamadas a `/api/players?page=1...` e (se aplicável) `page=2`.
   - Verifique se o frontend faz multiplas requisições até coletar todos os itens (ou até `pagination.totalPages`).

2. Manage Game — verificar jogadores no formulário de evento
   - Abra um jogo: `/admin/games/manage/<id>`.
   - No formulário de eventos verifique:
     - Os botões rápidos "Mostrar somente <time>" junto ao select de Time.
     - O contador "visíveis / carregados" do select de Jogadores.
     - Que os selects filtram jogadores corretamente ao selecionar um time.
   - Ao adicionar um evento, confirme no Network que a POST para `/api/games/:id/events` tem o payload correto.

3. Testar fallback do `apiClient`
   - Para simular problemas de rewrite/CORS, defina `NEXT_PUBLIC_API_BASE` diferente do host atual e ative `NEXT_PUBLIC_API_DEBUG=true`.
   - Observe console se o `apiClient` tenta alternativas (add/remove `/api`, trailing slash, host fallbacks).

---

## Depuração & Troubleshooting

Abaixo estão os problemas mais comuns e como investigá-los.

### 1) "Faltam jogadores" no Manage Game (caso que você relatou)
Possíveis causas:
- O `game` possui `time1.id` e `time2.id` diferentes dos `time.id` nos objetos `player.time`.
  - Verifique `GET /api/games/:id` → checar `time1.id` e `time2.id`.
  - Verifique `GET /api/players` para confirmar os `player.time.id`.
- O frontend não carregou todas as páginas de `/api/players`.
  - Verifique Network → chamadas `/api/players?page=...` e se `pagination.totalPages` indica mais páginas.
- Jogadores com `time: null` dependem de resolução `turma->time`.
  - O código tenta chamar `/api/turma-time/class/:turmaId/teams` para mapear `turmaId` → `timeId`. Se esse endpoint não existir/retornar vazio, os jogadores ficam sem `_resolvedTimeId` e não aparecem.
- Diferença de IDs (tipos/strings vs numbers).
  - O código faz comparações usando `String(...)` para maior tolerância, mas confirme que os IDs batem exatamente.

Ações práticas:
- No DevTools → Console, ative logs: defina `NEXT_PUBLIC_API_DEBUG=true` e recarregue a página para ver o que o `apiClient` tentou.
- Verifique a resposta de `/api/players` (page 1 e page 2) e confirme se os jogadores esperados estão presentes no JSON.
- Verifique se o endpoint `/api/turma-time/class/:turmaId/teams` existe e qual o retorno para o `turmaId` em questão.

### 2) Requisições 404 repetidas para `/api/turmas/:id` ou caminhos com `:1`
- Problema comum: IDs mal sanitizados (ex.: `":1"` com dois-pontos).
- Solução: o frontend já sanitiza turmas antes de chamar `/api/turma-time/class/:turmaId/teams` (remove `:` e extrai dígitos). Se seu backend usa outro formato (string slug), ajuste a sanitização ou o endpoint.

### 3) Erros CORS / host mismatch
- Se o frontend roda em `http://localhost:3000` e a API em outro host, configure:
  - `NEXT_PUBLIC_API_BASE` para apontar para a base correta, e
  - garanta CORS no backend (origem permitida).
- O `apiClient` tenta host-fallbacks quando encontra 404s — ótimo para debug, mas o fix definitivo é alinhar `NEXT_PUBLIC_API_BASE` e rewrites/proxy no Next.js.

### 4) Como obter informações de debug do `apiClient`
- Ative `NEXT_PUBLIC_API_DEBUG=true`.
- Mensagens úteis que serão exibidas:
  - `apiClient fetch: ...` — URL requisitada
  - `apiClient 404, trying alternatives:` — caminhos alternativos testados
  - `apiClient host alternative success:` — quando uma alternativa funcionou
  - Para problemas de rede, o client também faz retries (configurado no código).

---

## API — expectativas e endpoints importantes

O frontend espera (no mínimo) as seguintes rotas com formatos descritos:

- `GET /api/games/:id`  
  Retorna o jogo com `time1Id`, `time2Id`, `modalidadeId`, `placar`, etc.

- `GET /api/games/:id/events`  
  Lista de eventos do jogo (minuto, tipo, jogadorId, jogadorSubstituidoId, timeId, descricao).

- `POST /api/games/:id/events`  
  Adiciona evento — payload: `{ tipo, minuto, timeId, jogadorId, jogadorSubstituidoId, descricao }`.

- `PATCH /api/games/:id/score`  
  Atualiza placar — payload: `{ placarTime1, placarTime2 }`.

- `GET /api/players?page=1&pageSize=50` (ou `limit`/`offset`)  
  - O cliente aceita:
    - Resposta como array (página) — `[ {...}, {...} ]`
    - Objeto com `data: [...]` e `pagination` ou `meta` com `currentPage`/`totalPages`/`totalCount`
  - Se seu backend usa `limit`/`offset`, a implementação de paginação do frontend já tenta ambos os estilos.

- `GET /api/turma-time/class/:turmaId/teams`  
  (opcional, usado para mapear `turmaId` → `timeId` quando o jogador não tem `timeId` explícito)

Observação: Há alguma variação histórica nos endpoints (`/api/turmas`, `/api/classes` etc.). Recomenda-se padronizar o backend ou adicionar pequenos adaptadores no frontend.

---

## Boas práticas para desenvolvimento local

- Mantenha `NEXT_PUBLIC_API_BASE` apontando para a API real em dev, ou use mocks locais se estiver offline.
- Use `NEXT_PUBLIC_API_DEBUG=true` quando estiver investigando 404/CORS/pagination.
- Se precisar testar pipelines sem backend, crie arquivos de mock JSON em `public/mocks/` e carregue condicionalmente (para desenvolvimento local).

---

## Contribuição

1. Fork e branch: `git checkout -b feature/minha-feature`
2. Commit atômico e claro (ex.: `feat(players): melhora paginação / fallback`)
3. PR apontando ticket/descrição do que foi alterado
4. Adicione testes ou instruções de teste quando possível

---

## Deploy

- Recomendado: Vercel (configurar `NEXT_PUBLIC_API_BASE` nas Environment Variables do projeto)
- Alternativas: Netlify, Railway, Docker
- Certifique-se de:
  - Definir variáveis de ambiente no ambiente de produção
  - Configurar CORS no backend para domínios de produção

---

## Licença

Projeto com licença MIT — ver `LICENSE` para mais detalhes.

---

## Contato / Suporte

- Para suporte rápido adicione um issue no repositório com:
  - Passos para reproduzir
  - URLs relevantes (`/admin/games/manage/<id>`) e prints do console/Network
  - Conteúdo (parte) das respostas de `GET /api/players` e `GET /api/games/:id`

---

Obrigado — se quiser eu:
- gero um arquivo `public/mocks/players_page_2.json` com um exemplo de paginação (útil para desenvolvimento offline), ou
- adiciono um painel de diagnóstico detalhado no `Manage Game` para listar jogadores sem `_resolvedTimeId` com exemplos das turmas que não foram mapeadas.
  
Diga qual prefere e eu preparo as instruções/patches correspondentes.
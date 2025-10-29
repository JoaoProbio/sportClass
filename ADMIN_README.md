# 🏆 Sistema Administrativo - Interclasse IFNMG Januária 2025

## 📋 Visão Geral

Sistema completo de administração para gerenciar jogos, placares e eventos do campeonato Interclasse. O painel administrativo permite que administradores autorizados criem, editem e gerenciem jogos em tempo real.

## 🔐 Autenticação

### Credenciais de Teste

**Admin Geral:**
- Email: `admin@escola.com`
- Senha: `admin123`
- Permissões: Acesso completo ao sistema

**Admin Turma:**
- Email: `professor1a@escola.com`
- Senha: `turma123`
- Permissões: Acesso restrito à turma específica

### Como Fazer Login

1. Acesse `/admin/login`
2. Digite suas credenciais
3. Após o login bem-sucedido, você será redirecionado para o dashboard

## 🎮 Funcionalidades do Painel Admin

### 1. Dashboard Principal (`/admin/dashboard`)

- **Visão Geral**: Estatísticas do campeonato
- **Lista de Jogos**: Todos os jogos com status e placares
- **Ações Rápidas**: Criar novo jogo, editar, gerenciar ou excluir

### 2. Criação de Jogos (`/admin/games/create`)

- **Formulário Completo**: Times, modalidade, data/hora, local
- **Validações**: Campos obrigatórios e validação de dados
- **Integração**: Conecta diretamente com a API backend

### 3. Edição de Jogos (`/admin/games/edit/[id]`)

- **Edição Completa**: Modificar todos os dados do jogo
- **Pré-preenchimento**: Formulário carregado com dados atuais
- **Validações**: Mesmas validações da criação

### 4. Gerenciamento de Jogos (`/admin/games/manage/[id]`)

- **Controle de Status**: Iniciar, pausar, finalizar jogos
- **Atualização de Placar**: Modificar placar em tempo real
- **Eventos**: Adicionar gols, cartões, substituições, etc.
- **Histórico**: Visualizar todos os eventos do jogo

## 🛠️ Tecnologias Utilizadas

- **Next.js 14**: Framework React com App Router
- **TypeScript**: Tipagem estática
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis
- **Lucide React**: Ícones
- **JWT**: Autenticação segura

## 📁 Estrutura de Arquivos

```
app/
├── admin/
│   ├── login/page.tsx              # Página de login
│   ├── dashboard/page.tsx          # Dashboard principal
│   └── games/
│       ├── create/page.tsx         # Criar novo jogo
│       ├── edit/[id]/page.tsx      # Editar jogo existente
│       └── manage/[id]/page.tsx    # Gerenciar jogo (placar/eventos)
├── providers/
│   └── AuthContext.tsx             # Contexto de autenticação
└── components/
    └── ProtectedRoute.tsx          # Proteção de rotas
```

## 🔧 Componentes UI Criados

- `Button`: Botões com variantes
- `Input`: Campos de entrada
- `Card`: Cards de conteúdo
- `Badge`: Badges de status
- `Alert`: Alertas e notificações
- `Label`: Labels para formulários
- `Select`: Seletores dropdown
- `Textarea`: Área de texto

## 🌐 Integração com API

### Endpoints Utilizados

- `POST /api/auth/login` - Autenticação
- `GET /api/games` - Listar jogos
- `POST /api/games` - Criar jogo
- `PUT /api/games/:id` - Atualizar jogo
- `DELETE /api/games/:id` - Excluir jogo
- `PATCH /api/games/:id/score` - Atualizar placar
- `PATCH /api/games/:id/status` - Alterar status
- `GET /api/games/:id/events` - Listar eventos
- `POST /api/games/:id/events` - Adicionar evento
- `GET /api/teams` - Listar times
- `GET /api/modalities` - Listar modalidades
- `GET /api/players` - Listar jogadores

### Configuração da API

A URL base da API está configurada como:
```
https://mainone-ptsq.onrender.com
```

## 🔒 Segurança

- **Autenticação JWT**: Tokens seguros com expiração
- **Proteção de Rotas**: Apenas usuários autenticados
- **Validação de Permissões**: Admin geral vs admin turma
- **Sanitização**: Validação de dados de entrada
- **HTTPS**: Comunicação segura com a API

## 📱 Responsividade

- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para diferentes tamanhos de tela
- **Touch Friendly**: Botões e elementos otimizados para touch

## 🎨 Design System

- **Cores**: Paleta baseada em laranja (#ff810a)
- **Tipografia**: Inter font family
- **Espaçamento**: Sistema consistente de espaçamentos
- **Componentes**: Biblioteca de componentes reutilizáveis

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acessar o admin**:
   ```
   http://localhost:3000/admin/login
   ```

## 📊 Fluxo de Uso

1. **Login**: Administrador faz login com credenciais
2. **Dashboard**: Visualiza estatísticas e lista de jogos
3. **Criar Jogo**: Adiciona novo jogo ao campeonato
4. **Gerenciar**: Durante o jogo, atualiza placar e eventos
5. **Finalizar**: Marca jogo como finalizado

## 🔄 Estados dos Jogos

- **AGENDADO**: Jogo programado para o futuro
- **EM_ANDAMENTO**: Jogo em andamento
- **PAUSADO**: Jogo pausado (intervalo, etc.)
- **FINALIZADO**: Jogo concluído
- **CANCELADO**: Jogo cancelado

## 📝 Tipos de Eventos

- **GOL**: Gol marcado
- **ASSISTENCIA**: Assistência
- **CARTAO_AMARELO**: Cartão amarelo
- **CARTAO_VERMELHO**: Cartão vermelho
- **SUBSTITUICAO**: Substituição de jogador
- **LESAO**: Lesão
- **FALTA**: Falta cometida
- **PENALTI**: Pênalti
- **OUTRO**: Outros eventos

## 🛡️ Tratamento de Erros

- **Validação**: Campos obrigatórios e formatos
- **API Errors**: Tratamento de erros de comunicação
- **Network**: Indicadores de carregamento
- **Feedback**: Mensagens claras para o usuário

## 📈 Melhorias Futuras

- [ ] Dashboard com gráficos e estatísticas avançadas
- [ ] Notificações em tempo real
- [ ] Exportação de relatórios
- [ ] Gerenciamento de usuários
- [ ] Sistema de backup
- [ ] Integração com redes sociais

---

**Desenvolvido para IFNMG Campus Januária - Interclasse XXV** 🏆

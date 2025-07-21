# Dashboard Esportivo - Interclasse 2025

Um dashboard moderno e responsivo para acompanhar os jogos do interclasse escolar 2025, desenvolvido com Next.js 15 e seguindo um design system esportivo com paleta preto e laranja.

## 🏆 Características

- **Design System Esportivo**: Interface escura com paleta preto e laranja
- **Mobile-First**: Design responsivo otimizado para dispositivos móveis
- **Fonte Inter**: Tipografia moderna e legível
- **Menu com Ícones Esportivos**: Navegação intuitiva com emojis para diferentes modalidades
- **Status em Tempo Real**: Indicadores visuais para jogos ao vivo, finalizados e programados
- **Sistema de Favoritos**: Marque seus jogos favoritos para acompanhamento
- **Filtros Inteligentes**: Filtre jogos por status, modalidade e favoritos
- **Layout Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Múltiplas Páginas**: Navegação completa entre diferentes seções
- **Animações Suaves**: Transições e micro-interações com Framer Motion
- **Tema Escuro**: Interface otimizada para visualização noturna

## 📄 Páginas Disponíveis

### 🏈 Página de Jogos (`/jogos`)
- **Funcionalidades**: Lista completa de jogos com filtros
- **Componentes**: Tabela responsiva, filtros por status, sistema de favoritos
- **Dados**: Jogos ao vivo, finalizados, programados e adiados
- **Responsividade**: Cards verticais no mobile, tabela completa no desktop

### 🏆 Página de Classificação (`/classificacao`)
- **Funcionalidades**: Tabelas de pontuação por modalidade
- **Componentes**: Seletor de modalidade, tabela responsiva, legenda
- **Dados**: Pontuação, vitórias, empates, derrotas, gols pró/contra
- **Responsividade**: Layout compacto no mobile, tabela expandida no desktop

### 📊 Página de Estatísticas (`/estatisticas`)
- **Funcionalidades**: Análise detalhada de desempenho
- **Componentes**: Artilheiros, assistências, goleiros, gráficos
- **Dados**: Rankings individuais, distribuição de gols, médias
- **Responsividade**: Cards informativos, gráficos adaptativos

### 📅 Página de Calendário (`/calendario`)
- **Funcionalidades**: Visualização cronológica de jogos
- **Componentes**: Calendário por data, próximos jogos, estatísticas
- **Dados**: Jogos organizados por data, horários, quadras
- **Responsividade**: Layout vertical no mobile, grid no desktop

## 🎨 Nova Paleta de Cores

### Cores Principais
- **Preto**: `#000000` (background principal)
- **Laranja Primário**: `#ff6b35` (accent principal)
- **Laranja Secundário**: `#ff8c42` (accent secundário)
- **Laranja Terciário**: `#ffa726` (accent terciário)

### Cores de Status
- **Ao Vivo**: `#ff6b35` (laranja vibrante)
- **Em Breve**: `#ff8c42` (laranja médio)
- **Finalizado**: `#666666` (cinza)
- **Adiado**: `#ff9800` (laranja claro)

### Cores por Modalidade
- **Futebol**: `#ff6b35` (laranja)
- **Basquete**: `#ff8c42` (laranja médio)
- **Vôlei**: `#ffa726` (laranja claro)
- **Handebol**: `#ffb74d` (laranja suave)
- **Tênis**: `#ffcc80` (laranja muito claro)
- **Baseball**: `#ffe0b2` (laranja pastel)

## 🎯 Modalidades Disponíveis

- ⚽ Futebol
- 🏀 Basquete
- 🏐 Vôlei
- 🤾 Handebol
- 🎾 Tênis
- 🏃 Atletismo
- 🏊 Natação
- ♟️ Xadrez

## 📱 Responsividade Mobile-First

### Breakpoints
- **Mobile**: < 768px (padrão)
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Funcionalidades Mobile
- **Menu Hambúrguer**: Navegação colapsável
- **Sidebar Drawer**: Menu lateral deslizante
- **Scroll Horizontal**: Navegação esportiva com scroll
- **Cards Adaptativos**: Layout otimizado para touch
- **Filtros Compactos**: Interface simplificada

### Funcionalidades Desktop
- **Sidebar Fixa**: Menu lateral sempre visível
- **Layout Expandido**: Mais informações na tela
- **Hover Effects**: Interações com mouse
- **Grid Completo**: Tabela com todas as colunas

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação

1. **Clone o repositório:**
   ```bash
   git clone <repository-url>
   cd projetoX-main
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

- `npm run dev` - Servidor de desenvolvimento
- `npm run dev:turbo` - Servidor com Turbopack (mais rápido)
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código

## 🛠️ Tecnologias Utilizadas

### Core
- **Next.js 15.3.4**: Framework React com App Router
- **React 19.0.0**: Biblioteca de interface
- **TypeScript 5**: Tipagem estática
- **Tailwind CSS 4**: Estilização utilitária responsiva

### UI/UX
- **Radix UI**: Componentes acessíveis e customizáveis
- **Framer Motion 12.19.1**: Animações e transições
- **GSAP 3.13.0**: Animações avançadas
- **Lucide React**: Ícones modernos
- **Vaul**: Componente drawer

### Utilitários
- **clsx**: Classes condicionais
- **class-variance-authority**: Variantes de componentes
- **tailwind-merge**: Merge de classes Tailwind
- **react-intersection-observer**: Observação de elementos
- **next-themes**: Gerenciamento de temas

### Desenvolvimento
- **@tailwindcss/postcss**: PostCSS para Tailwind
- **tw-animate-css**: Animações CSS para Tailwind

## 📊 Estrutura do Projeto

```
projetoX-main/
├── app/                          # App Router (Next.js 15)
│   ├── components/               # Componentes da aplicação
│   │   ├── AnimatePresenceWrapper.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── GameDetailsDialog.tsx
│   │   ├── GamesTable.tsx
│   │   ├── LiveIndicator.tsx
│   │   ├── MatchRow.tsx
│   │   ├── NavigationHeader.tsx
│   │   ├── NetworkStatus.tsx
│   │   ├── PageLayout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── SportsNavigation.tsx
│   │   ├── TournamentBracket.tsx
│   │   ├── TransitionLayout.tsx
│   │   └── TurmaDialog.tsx
│   ├── jogos/                    # Página de jogos
│   │   └── page.tsx
│   ├── classificacao/            # Página de classificação
│   │   └── page.tsx
│   ├── estatisticas/             # Página de estatísticas
│   │   └── page.tsx
│   ├── calendario/               # Página de calendário
│   │   └── page.tsx
│   ├── test-dialog/              # Página de teste
│   │   └── page.tsx
│   ├── providers/                # Context providers
│   │   └── SportContext.tsx
│   ├── globals.css               # Estilos globais
│   ├── layout.tsx               # Layout da aplicação
│   └── page.tsx                 # Página principal
├── components/                   # Componentes compartilhados
│   ├── motion-primitives/       # Componentes de animação
│   │   └── magnetic.tsx
│   └── ui/                      # Componentes UI (shadcn/ui)
│       ├── alert.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── collapsible.tsx
│       ├── dotted-dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── input.tsx
│       └── table.tsx
├── lib/                         # Utilitários
│   ├── anim.ts                  # Animações
│   ├── fetch-utils.ts           # Utilitários de fetch
│   └── utils.ts                 # Utilitários gerais
├── public/                      # Assets estáticos
│   ├── *.svg                    # Ícones esportivos
│   ├── *.png                    # Imagens
│   └── favicon.ico
├── components.json              # Configuração shadcn/ui
├── next.config.ts              # Configuração Next.js
├── tailwind.config.ts          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências e scripts
└── README.md                   # Documentação
```

## 🎨 Design System

O projeto utiliza um design system completo com:

### Configuração shadcn/ui
- **Style**: New York
- **Base Color**: Neutral
- **CSS Variables**: Habilitadas
- **Icon Library**: Lucide React

### Variáveis CSS
- **Cores de Background**: background, background-elevated, background-card, background-sidebar
- **Cores de Accent**: accent-primary, accent-secondary, accent-tertiary, accent-success, accent-warning, accent-live
- **Cores de Texto**: text-primary, text-secondary, text-muted, text-inverse
- **Cores de Borda**: border-default, border-muted, border-accent
- **Cores de Status**: status-live, status-finished, status-upcoming, status-postponed
- **Cores Esportivas**: sport-football, sport-basketball, sport-tennis, sport-volleyball, sport-handball, sport-baseball

### Tipografia
- **Fonte Principal**: Inter (Google Fonts)
- **Fallbacks**: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif

### Animações
- **Framer Motion**: Transições suaves entre páginas
- **GSAP**: Animações complexas e sequenciais
- **CSS Animations**: Pulse e outras animações básicas

## ⚙️ Configuração

### Next.js Config
- **Image Optimization**: Desabilitada para melhor performance
- **Trailing Slash**: Habilitado
- **Turbopack**: Configurado para desenvolvimento
- **Headers**: Configurações de segurança
- **On-Demand Entries**: Otimização de memória

### TypeScript Config
- **Target**: ES2017
- **Strict Mode**: Habilitado
- **Module Resolution**: Bundler
- **Path Mapping**: @/* para raiz do projeto

### Tailwind Config
- **Dark Mode**: Class-based
- **Content Paths**: pages, components, app
- **Custom Colors**: Sistema de cores esportivo
- **Custom Spacing**: 15 (60px), 70 (280px)
- **Custom Screens**: xs (475px) adicionado

## 📱 Funcionalidades

### Header de Navegação
- **Mobile**: Menu hambúrguer com navegação colapsável
- **Desktop**: Menu horizontal completo
- Logo do interclasse com link para home
- Menu principal com abas (Jogos, Classificação, Estatísticas, Calendário)
- Ações do usuário (notificações, perfil)

### Navegação Esportiva
- **Mobile**: Scroll horizontal com ícones grandes
- **Desktop**: Layout horizontal com labels
- Filtros por modalidade esportiva
- Ícones coloridos para cada esporte

### Sidebar
- **Mobile**: Drawer deslizante com overlay
- **Desktop**: Sidebar fixa sempre visível
- Lista de jogos favoritos
- Navegação por turmas
- Card promocional para eventos especiais

### Layout Compartilhado
- **PageLayout**: Componente reutilizável para todas as páginas
- **Navegação Consistente**: Header e sidebar em todas as páginas
- **Responsividade**: Adaptação automática para todos os dispositivos

## 🎨 Personalização

O design system está definido em múltiplos arquivos e pode ser facilmente personalizado:

### Arquivos de Configuração
- `sports_ui_design_system.json` - Sistema de design esportivo
- `dark_ui_design_system.json` - Sistema de design escuro
- `tournament_bracket_design.json` - Design do bracket de torneio

### Personalização Disponível
- Cores das modalidades esportivas
- Tipografia e espaçamentos
- Componentes e layouts
- Animações e transições
- Breakpoints responsivos

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente se necessário
3. Deploy automático a cada push

### Outras Plataformas
- **Netlify**: Compatível com Next.js
- **Railway**: Deploy simples
- **Docker**: Containerização disponível

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório.

---

**Desenvolvido com ❤️ para o Interclasse 2025**

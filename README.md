# Método Raízes® - Website

Website oficial do Método Raízes®, plataforma de coaching educativo e parentalidade consciente.

## 📋 Índice

- [Descrição](#descrição)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Executar o Projeto](#executar-o-projeto)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Rotas](#rotas)
- [Base de Dados](#base-de-dados)
- [Segurança](#segurança)
- [Autenticação Admin](#autenticação-admin)
- [Problemas Conhecidos](#problemas-conhecidos)
- [Troubleshooting](#troubleshooting)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Deploy](#deploy)
- [Contacto](#contacto)

## 📝 Descrição

Website institucional do Método Raízes® com:
- Páginas informativas (Início, Sobre, Método)
- Blog com gestão de artigos
- Formulário de contacto
- Newsletter subscription
- Painel administrativo para gestão de conteúdo

## 🛠 Tecnologias

### Frontend
- **React 18.3.1** - Framework UI
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool e dev server
- **React Router 6.30.1** - Roteamento
- **Tailwind CSS 3.4.17** - Estilização
- **shadcn/ui** - Componentes UI
- **Zod 3.25.76** - Validação de formulários
- **React Hook Form 7.61.1** - Gestão de formulários
- **TanStack Query 5.83.0** - Data fetching

### Backend/Base de Dados
- **Supabase 2.78.0** - Backend as a Service
  - PostgreSQL Database
  - Row Level Security (RLS)
  - Authentication
  - REST API

## 📦 Pré-requisitos

- **Node.js** 18+ (recomendado: 20.11.0)
- **npm** 10.2.4+
- **Git** (para clone do repositório)
- **Conta Supabase** com projeto configurado

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd raiz-wise-wings
```

### 2. Instalar Dependências

```bash
npm install --legacy-peer-deps
```

**Nota:** Usa `--legacy-peer-deps` devido a conflito entre `date-fns` v4 e `react-day-picker` que requer v2/v3.

### 3. Configurar Variáveis de Ambiente

Crie um ficheiro `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://xeruiarqntnxurfnelsc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_aqui
```

**Onde encontrar as chaves:**
1. Aceda ao [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecione o projeto
3. Vá para **Settings** > **API**
4. Copie **Project URL** e **anon/public key**

## ⚙️ Configuração

### Base de Dados

#### 1. Aplicar Migrações

Execute as migrações SQL no Supabase Dashboard > SQL Editor:

**Migração Inicial:**
```bash
supabase/migrations/20251102194008_7b32e033-1112-4a45-8f4f-b205d09172db.sql
```
Cria as tabelas: `blog_posts`, `newsletter_subscribers`, `contact_messages`

**Migração de Segurança:**
```bash
supabase/migrations/20251103000000_security_fixes.sql
```
ou use:
```bash
apply-migration-now.sql
```
Implementa autenticação e políticas RLS.

#### 2. Corrigir Políticas RLS (Se necessário)

Se tiver erros ao subscrever newsletter ou enviar contacto:

Execute `fix-rls-newsletter-complete.sql` no Supabase Dashboard > SQL Editor.

#### 3. Criar Utilizador Admin

**Opção A: Via Script PowerShell**
```powershell
powershell -ExecutionPolicy Bypass -File auto-setup-security.ps1
```

**Opção B: Manual**
1. Supabase Dashboard > **Authentication** > **Users** > **Add User**
2. Email: `coachpaulalopes@gmail.com`
3. Password: (defina uma senha segura)
4. No SQL Editor, execute:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('<user-id-aqui>', 'admin');
```

## 🏃 Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

O servidor inicia em: **http://localhost:8080**

### Modo Produção

```bash
# Build
npm run build

# Preview da build
npm run preview
```

### Scripts PowerShell (Windows)

```powershell
# Iniciar servidor
.\iniciar-servidor.ps1
```

## 📁 Estrutura do Projeto

```
raiz-wise-wings/
├── public/                  # Ficheiros estáticos
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── assets/             # Imagens e recursos
│   │   ├── hero-image.jpg
│   │   ├── roots-concept.jpg
│   │   ├── child-growth.jpg
│   │   └── parent-teacher.jpg
│   ├── components/         # Componentes React
│   │   ├── Footer.tsx
│   │   ├── Navbar.tsx
│   │   ├── Newsletter.tsx
│   │   └── ui/            # Componentes shadcn/ui
│   ├── hooks/             # Custom hooks
│   ├── integrations/      # Integrações externas
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/               # Utilitários
│   ├── pages/             # Páginas/rotas
│   │   ├── Index.tsx      # Página inicial
│   │   ├── Sobre.tsx
│   │   ├── Metodo.tsx
│   │   ├── Blog.tsx
│   │   ├── BlogPost.tsx
│   │   ├── Contacto.tsx
│   │   ├── Admin.tsx      # Painel administrativo
│   │   └── NotFound.tsx
│   ├── App.tsx            # Componente principal
│   ├── main.tsx           # Entry point
│   └── index.css          # Estilos globais
├── supabase/
│   ├── config.toml
│   └── migrations/        # Migrações SQL
├── .env                   # Variáveis de ambiente (não commitado)
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

## 🗺 Rotas

| Rota | Página | Descrição | Acesso |
|------|--------|-----------|--------|
| `/` | Index | Página inicial | Público |
| `/sobre` | Sobre | Sobre o método | Público |
| `/metodo` | Método | Detalhes do método | Público |
| `/blog` | Blog | Lista de artigos | Público |
| `/blog/:slug` | Artigo | Artigo individual | Público |
| `/contacto` | Contacto | Formulário de contacto | Público |
| `/admin` | Admin | Painel administrativo | **Apenas Admin** |

## 🗄 Base de Dados

### Tabelas

#### `blog_posts`
- `id` (UUID) - Primary key
- `title` (TEXT) - Título do artigo
- `slug` (TEXT) - URL amigável (único)
- `excerpt` (TEXT) - Resumo
- `content` (TEXT) - Conteúdo HTML
- `cover_image` (TEXT) - URL da imagem
- `published` (BOOLEAN) - Status de publicação
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### `newsletter_subscribers`
- `id` (UUID) - Primary key
- `email` (TEXT) - Email (único)
- `name` (TEXT) - Nome (opcional)
- `subscribed` (BOOLEAN) - Estado de subscrição
- `created_at` (TIMESTAMP)

#### `contact_messages`
- `id` (UUID) - Primary key
- `name` (TEXT) - Nome
- `email` (TEXT) - Email
- `phone` (TEXT) - Telefone (opcional)
- `message` (TEXT) - Mensagem
- `read` (BOOLEAN) - Estado de leitura
- `created_at` (TIMESTAMP)

#### `user_roles`
- `id` (UUID) - Primary key
- `user_id` (UUID) - Referência a auth.users
- `role` (TEXT) - Papel ('admin', 'user')
- `created_at` (TIMESTAMP)

### Políticas RLS (Row Level Security)

- **blog_posts**: Público pode ver artigos publicados; Admins podem ver/todos e editar
- **newsletter_subscribers**: Público pode inserir; Admins podem ver/todos
- **contact_messages**: Público pode inserir; Admins podem ver/todos
- **user_roles**: Utilizadores veem apenas seus papéis; Admins podem gerir todos

## 🔒 Segurança

### Implementações

✅ **Autenticação Supabase** - Login seguro com email/password
✅ **Row Level Security (RLS)** - Políticas de acesso à base de dados
✅ **Role-Based Access Control** - Sistema de papéis (admin/user)
✅ **Input Validation** - Validação Zod em todos os formulários
✅ **Length Limits** - Limites de caracteres para prevenir ataques
✅ **Content Sanitization** - Limpeza de inputs

### Credenciais Admin

- **Email**: `coachpaulalopes@gmail.com`
- **Password**: [Contacte o administrador]

**⚠️ IMPORTANTE:**
- Altere a password após o primeiro login
- Nunca partilhe credenciais
- Use passwords fortes

## 🔐 Autenticação Admin

### Login

1. Aceda a `/admin`
2. Insira email e password
3. Use o botão de "olho" para ver/ocultar senha

### Funcionalidades Admin

- ✅ Criar/editar/eliminar artigos do blog
- ✅ Publicar/despublicar artigos
- ✅ Ver mensagens de contacto
- ✅ Marcar mensagens como lidas
- ✅ Ver subscritores da newsletter

## ⚠️ Problemas Conhecidos

### 1. Erro ao Subscrever Newsletter

**Erro:** `new row violates row-level security policy`

**Solução:**
Execute `fix-rls-newsletter-complete.sql` no Supabase Dashboard > SQL Editor.

### 2. Conflito de Dependências

**Erro:** `ERESOLVE could not resolve` ao instalar

**Solução:**
```bash
npm install --legacy-peer-deps
```

Devido a conflito entre `date-fns` v4 e `react-day-picker` v8.

### 3. Node.js não encontrado

**Erro:** `'node' is not recognized`

**Solução:**
1. Instale Node.js de https://nodejs.org/
2. Reinicie o terminal
3. Verifique: `node --version`

### 4. Porta 8080 já em uso

**Solução:**
O Vite tentará usar a próxima porta disponível automaticamente.
Ou edite `vite.config.ts` para alterar a porta.

## 🔧 Troubleshooting

### Servidor não inicia

1. Verifique se Node.js está instalado: `node --version`
2. Verifique se as dependências estão instaladas: `ls node_modules`
3. Limpe cache e reinstale:
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Erros de autenticação

1. Verifique se o utilizador existe no Supabase Auth
2. Verifique se tem papel de admin na tabela `user_roles`
3. Verifique se as políticas RLS estão aplicadas

### Erros de base de dados

1. Verifique conexão ao Supabase: Dashboard > Settings > API
2. Verifique se as migrações foram aplicadas
3. Verifique políticas RLS: Database > Policies

### Formulários não funcionam

1. Verifique políticas RLS para INSERT público
2. Execute `fix-rls-newsletter-complete.sql` se necessário
3. Verifique console do navegador para erros

## 📜 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **dev** | `npm run dev` | Inicia servidor de desenvolvimento |
| **build** | `npm run build` | Build para produção |
| **build:dev** | `npm run build:dev` | Build em modo desenvolvimento |
| **preview** | `npm run preview` | Preview da build de produção |
| **lint** | `npm run lint` | Executa ESLint |

### Scripts PowerShell (Windows)

- `iniciar-servidor.ps1` - Inicia servidor automaticamente
- `auto-setup-security.ps1` - Setup automático de segurança
- `verify-setup.ps1` - Verifica configuração
- `reset-admin-password.ps1` - Reseta senha do admin

## 🚢 Deploy

### Build para Produção

```bash
npm run build
```

O build será criado em `dist/`

### Variáveis de Ambiente em Produção

Configure as mesmas variáveis de ambiente no seu serviço de hosting:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

### Serviços Recomendados

- **Vercel** - Deploy automático do Git
- **Netlify** - Deploy simples e rápido
- **Cloudflare Pages** - Gratuito e rápido

## 📞 Contacto

- **Email**: coachpaulalopes@gmail.com
- **Telefone**: +351 963 392 511
- **Localização**: Vila Real, Portugal

## 📚 Documentação Adicional

- [SECURITY_SETUP.md](./SECURITY_SETUP.md) - Guia de configuração de segurança
- [SECURITY_FIXES_SUMMARY.md](./SECURITY_FIXES_SUMMARY.md) - Resumo das correções
- [SETUP_ADMIN_GUIDE.md](./SETUP_ADMIN_GUIDE.md) - Guia de setup do admin
- [COMO_EXECUTAR.md](./COMO_EXECUTAR.md) - Guia de execução

## 🐛 Reportar Problemas

Se encontrar problemas:
1. Verifique a secção [Troubleshooting](#troubleshooting)
2. Verifique os ficheiros de documentação em `SECURITY_*.md`
3. Consulte os logs no console do navegador
4. Verifique logs do Supabase Dashboard

## 📄 Licença

© 2025 Método Raízes® - Todos os direitos reservados

---

**Última atualização:** 2025-11-02

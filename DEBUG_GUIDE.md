# Debug Guide - Método Raízes®

Guia completo de debug e informações técnicas para desenvolvimento e troubleshooting.

## 🔍 Checklist de Debug

### 1. Verificações Iniciais

- [ ] Node.js instalado e no PATH
- [ ] Dependências instaladas (`node_modules` existe)
- [ ] Ficheiro `.env` configurado com chaves Supabase
- [ ] Servidor a responder na porta 8080
- [ ] Conexão ao Supabase funcionando

### 2. Verificações de Base de Dados

- [ ] Migrações aplicadas no Supabase
- [ ] Tabelas criadas: `blog_posts`, `newsletter_subscribers`, `contact_messages`, `user_roles`
- [ ] Função `is_admin()` criada e funcionando
- [ ] Políticas RLS aplicadas e corretas
- [ ] Utilizador admin criado e com papel atribuído

### 3. Verificações de Autenticação

- [ ] Utilizador admin existe no Supabase Auth
- [ ] Papel de admin atribuído na tabela `user_roles`
- [ ] Políticas RLS permitem SELECT para admins
- [ ] Sessão de autenticação persistindo

### 4. Verificações de Formulários

- [ ] Newsletter: Política INSERT pública aplicada
- [ ] Contacto: Política INSERT pública aplicada
- [ ] Validação Zod funcionando
- [ ] Mensagens de erro aparecem corretamente

## 🐛 Problemas Comuns e Soluções

### Problema 1: Erro ao Subscrever Newsletter

**Sintoma:**
```
new row violates row-level security policy for table "newsletter_subscribers"
```

**Causa:** Política RLS não permite INSERT público

**Solução:**
1. Supabase Dashboard > SQL Editor
2. Execute `fix-rls-newsletter-complete.sql`
3. Verifique se política foi criada: Database > Policies

**Verificação:**
```sql
SELECT * FROM pg_policies WHERE tablename = 'newsletter_subscribers';
```

### Problema 2: Erro de Autenticação Admin

**Sintoma:**
```
Invalid login credentials
```

**Causa:** Email/password incorretos ou utilizador sem papel de admin

**Solução:**
1. Verifique email: `coachpaulalopes@gmail.com`
2. Resete password via Supabase Dashboard ou script
3. Verifique papel de admin:
```sql
SELECT * FROM user_roles WHERE user_id = '<user-id>';
```

**Verificação:**
```sql
SELECT id, email FROM auth.users WHERE email = 'coachpaulalopes@gmail.com';
```

### Problema 3: Servidor não Inicia

**Sintoma:**
```
Port 8080 already in use
```

**Solução:**
1. Encontre processo usando porta:
```powershell
Get-NetTCPConnection -LocalPort 8080 | Select-Object OwningProcess
```
2. Termine processo ou altere porta em `vite.config.ts`

**Sintoma:**
```
'node' is not recognized
```

**Solução:**
1. Instale Node.js: https://nodejs.org/
2. Reinicie terminal
3. Verifique: `node --version`

### Problema 4: Dependências não Instalam

**Sintoma:**
```
ERESOLVE could not resolve
```

**Solução:**
```bash
npm install --legacy-peer-deps
```

**Causa:** Conflito entre `date-fns` v4 e `react-day-picker` v8

### Problema 5: Formulários não Submetem

**Sintoma:** Formulário não faz nada ao submeter

**Verificações:**
1. Console do navegador para erros JavaScript
2. Network tab para verificar requests
3. Supabase Dashboard > Logs para erros de API

**Solução:**
1. Verifique políticas RLS
2. Execute `fix-rls-newsletter-complete.sql` se necessário
3. Verifique variáveis de ambiente estão configuradas

## 🔧 Comandos Úteis

### Verificar Processos Node

```powershell
Get-Process | Where-Object {$_.ProcessName -eq "node"}
```

### Verificar Porta 8080

```powershell
Get-NetTCPConnection -LocalPort 8080
```

### Testar Conexão Supabase

```powershell
# Testar URL
Invoke-WebRequest -Uri "https://xeruiarqntnxurfnelsc.supabase.co" -UseBasicParsing
```

### Limpar Cache e Reinstalar

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📊 Estrutura de Dados

### Blog Posts
```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}
```

### Newsletter Subscriber
```typescript
interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribed: boolean;
  created_at: string;
}
```

### Contact Message
```typescript
interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  read: boolean;
  created_at: string;
}
```

## 🔐 Políticas RLS Esperadas

### blog_posts
- **SELECT**: `public.is_admin() OR published = true`
- **INSERT**: `public.is_admin()`
- **UPDATE**: `public.is_admin()`
- **DELETE**: `public.is_admin()`

### newsletter_subscribers
- **SELECT**: `public.is_admin()`
- **INSERT**: `true` (público)
- **UPDATE**: `public.is_admin()`

### contact_messages
- **SELECT**: `public.is_admin()`
- **INSERT**: `true` (público)
- **UPDATE**: `public.is_admin()`

### user_roles
- **SELECT**: `auth.uid() = user_id OR public.is_admin()`
- **INSERT**: `public.is_admin()`
- **UPDATE**: `public.is_admin()`

## 🌐 URLs Importantes

### Local
- **Desenvolvimento**: http://localhost:8080
- **Admin**: http://localhost:8080/admin

### Supabase
- **Dashboard**: https://supabase.com/dashboard/project/xeruiarqntnxurfnelsc
- **SQL Editor**: https://supabase.com/dashboard/project/xeruiarqntnxurfnelsc/sql/new
- **Auth Users**: https://supabase.com/dashboard/project/xeruiarqntnxurfnelsc/auth/users
- **Database Policies**: https://supabase.com/dashboard/project/xeruiarqntnxurfnelsc/auth/policies

## 📝 Logs e Debugging

### Console do Navegador

Verifique para:
- Erros JavaScript
- Warnings de React
- Erros de rede/API

### Network Tab

Verifique requests para:
- `/rest/v1/` - Requests à API Supabase
- `/auth/v1/` - Requests de autenticação
- Status codes: 200 (OK), 401 (Unauthorized), 403 (Forbidden), 500 (Error)

### Supabase Logs

1. Dashboard > Logs
2. Verifique:
   - API Requests
   - Auth Logs
   - Database Logs
   - Error Logs

## 🧪 Testes Manuais

### Testar Newsletter
1. Aceda à página inicial
2. Preencha formulário de newsletter
3. Clique "Subscrever"
4. Verifique toast de sucesso
5. Verifique no Supabase Dashboard > Database > newsletter_subscribers

### Testar Contacto
1. Aceda a `/contacto`
2. Preencha formulário
3. Clique "Enviar Mensagem"
4. Verifique toast de sucesso
5. Verifique no admin panel > Mensagens

### Testar Admin
1. Aceda a `/admin`
2. Login com credenciais
3. Verifique acesso a todas as tabs
4. Teste criar artigo do blog
5. Teste visualizar mensagens
6. Teste visualizar subscritores

### Testar Blog
1. Aceda a `/blog`
2. Verifique artigos publicados aparecem
3. Clique num artigo
4. Verifique URL: `/blog/:slug`
5. Verifique conteúdo renderiza corretamente

## 🔍 Verificações SQL Úteis

### Verificar Utilizador Admin
```sql
SELECT u.id, u.email, ur.role 
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'coachpaulalopes@gmail.com';
```

### Verificar Políticas RLS
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### Verificar Função is_admin()
```sql
SELECT pg_get_functiondef(oid)
FROM pg_proc
WHERE proname = 'is_admin';
```

### Verificar Dados da Newsletter
```sql
SELECT COUNT(*) as total, 
       COUNT(*) FILTER (WHERE subscribed = true) as ativos
FROM newsletter_subscribers;
```

## 🚨 Problemas Críticos

### Base de Dados Inacessível
- Verifique URL do Supabase no `.env`
- Verifique chave API no `.env`
- Verifique conexão de internet
- Verifique status do Supabase: https://status.supabase.com/

### Todas as Páginas dão 404
- Verifique se servidor está a correr
- Verifique rotas em `App.tsx`
- Limpe cache do navegador (Ctrl+Shift+Delete)

### Nenhum Formulário Funciona
- Verifique políticas RLS estão aplicadas
- Execute `fix-rls-newsletter-complete.sql`
- Verifique função `is_admin()` existe

## 📞 Suporte

Se os problemas persistirem:

1. Verifique documentação adicional:
   - `SECURITY_SETUP.md`
   - `SECURITY_FIXES_SUMMARY.md`
   - `SETUP_ADMIN_GUIDE.md`

2. Consulte logs:
   - Console do navegador
   - Supabase Dashboard > Logs
   - Terminal do servidor

3. Verifique configuração:
   - Variáveis de ambiente
   - Migrações aplicadas
   - Políticas RLS corretas

---

**Última atualização:** 2025-11-02


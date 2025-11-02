# Status do Setup Automatizado

## ✅ Progresso Automatizado

O script automatizado foi executado com sucesso!

### ✅ Criado com Sucesso:
- **Utilizador Admin**: coachpaulalopes@gmail.com
- **User ID**: c0ec443d-73a5-466a-a0b1-10784b74aefe
- **Password**: admin123456 (pode alterar depois)

### ⚠️ Pendente (Precisa Ação Manual):
- **Aplicar Migração SQL**: A tabela `user_roles` ainda não existe porque a migração precisa ser aplicada manualmente

## 📋 Passo Final: Aplicar Migração

Como a API REST do Supabase não permite execução de SQL arbitrário, precisa aplicar a migração manualmente:

### Opção 1: Via Supabase Dashboard (Recomendado)

1. **Aceder ao Dashboard:**
   - Vá para: https://supabase.com/dashboard/project/xeruiarqntnxurfnelsc
   - Faça login com as suas credenciais

2. **Abrir SQL Editor:**
   - No menu lateral, clique em **SQL Editor**
   - Clique em **New Query**

3. **Copiar e Colar a Migração:**
   - Abra o ficheiro: `supabase/migrations/20251103000000_security_fixes.sql`
   - Copie TODO o conteúdo
   - Cole no SQL Editor

4. **Executar:**
   - Clique no botão **Run** ou pressione `Ctrl+Enter`
   - Aguarde a confirmação de sucesso

### Opção 2: Via Supabase CLI (Se Instalado)

```bash
supabase db push
```

ou

```bash
supabase migration up
```

## ✅ Após Aplicar a Migração

Depois de aplicar a migração SQL, execute novamente:

```powershell
powershell -ExecutionPolicy Bypass -File auto-setup-security.ps1
```

Isto irá atribuir o papel de admin ao utilizador criado.

## 🧪 Testar o Setup

1. **Aceder ao Painel Admin:**
   - Vá para: `http://localhost:5173/admin` (ou o seu URL)
   - Login com:
     - Email: `coachpaulalopes@gmail.com`
     - Password: `admin123456`

2. **Verificar Funcionalidades:**
   - ✓ Criar/editar/eliminar artigos do blog
   - ✓ Ver mensagens de contacto
   - ✓ Ver subscritores da newsletter

## 🔐 Segurança

**Importante:**
- Altere a password do admin depois do primeiro login
- Não partilhe as credenciais
- Considere ativar 2FA no Supabase

## 📝 Resumo

- ✅ Utilizador admin criado
- ⏳ Migração SQL precisa ser aplicada manualmente
- ⏳ Papel de admin será atribuído automaticamente após migração

**Próximo Passo:** Aplicar a migração SQL no Supabase Dashboard!


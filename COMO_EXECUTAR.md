# Como Executar o Projeto

## Pré-requisitos

1. **Node.js** (versão 18 ou superior)
   - Download: https://nodejs.org/
   - Verificar instalação: `node --version` e `npm --version`

## Passos para Executar

### 1. Instalar Dependências

Primeiro, instale todas as dependências do projeto:

```powershell
npm install
```

ou

```powershell
npm i
```

### 2. Configurar Variáveis de Ambiente

Certifique-se de ter um ficheiro `.env` na raiz do projeto com:

```
VITE_SUPABASE_URL=https://xeruiarqntnxurfnelsc.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica_aqui
```

**Nota:** Se não tiver o ficheiro `.env`, verifique as variáveis de ambiente configuradas no Supabase Dashboard.

### 3. Executar o Servidor de Desenvolvimento

```powershell
npm run dev
```

O servidor irá iniciar normalmente em:
- **URL:** http://localhost:5173
- Abra no navegador: http://localhost:5173

### 4. Testar o Login Admin

Após o servidor iniciar:

1. Vá para: http://localhost:5173/admin
2. Login com:
   - **Email:** `coachpaulalopes@gmail.com`
   - **Password:** `admin123456`

### 5. Outros Comandos Úteis

```powershell
# Build para produção
npm run build

# Preview da build de produção
npm run preview

# Executar linter
npm run lint
```

## Problemas Comuns

### Node.js não encontrado

Se receber erro "npm não é reconhecido":
1. Verifique se Node.js está instalado
2. Reinicie o terminal após instalar Node.js
3. Verifique se Node.js está no PATH do sistema

### Porta já em uso

Se a porta 5173 estiver ocupada:
- O Vite tentará usar a próxima porta disponível (5174, 5175, etc.)
- Ou pode especificar uma porta: `npm run dev -- --port 3000`

### Erros de dependências

Se houver erros ao instalar:
```powershell
# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

## Estrutura do Projeto

- `src/` - Código fonte da aplicação
- `public/` - Ficheiros estáticos
- `supabase/migrations/` - Migrações da base de dados
- `.env` - Variáveis de ambiente (não commitado)

## URLs Importantes

- **Aplicação:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Blog:** http://localhost:5173/blog
- **Contacto:** http://localhost:5173/contacto


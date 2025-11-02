# Script simples para iniciar servidor de desenvolvimento
# Execute: .\run-dev.ps1

# Adicionar Node.js ao PATH
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Mudar para diretório do projeto
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== SERVIDOR DE DESENVOLVIMENTO ===" -ForegroundColor Green
Write-Host ""

# Verificar se Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "OK: Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERRO: Node.js nao encontrado!" -ForegroundColor Red
    Write-Host "Instale Node.js de: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar se dependências estão instaladas
if (-not (Test-Path "node_modules")) {
    Write-Host "AVISO: Dependencias nao encontradas. Instalando..." -ForegroundColor Yellow
    Write-Host ""
    npm install --legacy-peer-deps
    Write-Host ""
}

# Verificar variáveis de ambiente
if (-not (Test-Path ".env")) {
    Write-Host "AVISO: Ficheiro .env nao encontrado!" -ForegroundColor Yellow
    Write-Host "Crie um ficheiro .env com:" -ForegroundColor Yellow
    Write-Host "  VITE_SUPABASE_URL=https://xeruiarqntnxurfnelsc.supabase.co" -ForegroundColor White
    Write-Host "  VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_aqui" -ForegroundColor White
    Write-Host ""
}

Write-Host "Iniciando servidor Vite..." -ForegroundColor Cyan
Write-Host ""
Write-Host "URLs disponiveis:" -ForegroundColor Cyan
Write-Host "  - Aplicacao: http://localhost:8080" -ForegroundColor White
Write-Host "  - Admin:     http://localhost:8080/admin" -ForegroundColor White
Write-Host ""
Write-Host "Pressione Ctrl+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Iniciar servidor
npm run dev

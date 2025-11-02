# Script simples para iniciar o servidor

Write-Host ""
Write-Host "=== INICIANDO SERVIDOR ===" -ForegroundColor Green
Write-Host ""

# Adicionar Node.js ao PATH
$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

# Mudar para o diretório do projeto
Set-Location "C:\Users\ccpadmin\Documents\raiz-wise-wings\raiz-wise-wings"

Write-Host "Diretório: $(Get-Location)" -ForegroundColor Cyan
Write-Host ""

# Verificar se node_modules existe
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Dependências não encontradas. Instalando..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    Write-Host ""
}

Write-Host "🚀 Iniciando servidor na porta 8080..." -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
npm run dev


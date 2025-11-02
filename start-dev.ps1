# Script para iniciar o servidor de desenvolvimento

$env:PATH = "C:\Program Files\nodejs;" + $env:PATH

Write-Host ""
Write-Host "Iniciando servidor de desenvolvimento..." -ForegroundColor Cyan
Write-Host ""

# Mudar para o diretório do projeto
Set-Location $PSScriptRoot

# Executar npm run dev
& npm run dev


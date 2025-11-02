# Script para resetar a senha do admin

$SupabaseUrl = "https://xeruiarqntnxurfnelsc.supabase.co"
$ServiceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcnVpYXJxbnRueHVyZm5lbHNjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjEwNTY0MywiZXhwIjoyMDc3NjgxNjQzfQ.Wk2UJtDTYBIp57vpUta8y8CZCXju0eVE6JRZOw2vu-w"

$headers = @{
    "apikey" = $ServiceRoleKey
    "Authorization" = "Bearer $ServiceRoleKey"
    "Content-Type" = "application/json"
}

Write-Host ""
Write-Host "Reset de Senha Admin" -ForegroundColor Cyan
Write-Host ""

$userId = "c0ec443d-73a5-466a-a0b1-10784b74aefe"
$newPassword = Read-Host "Digite a nova senha (minimo 6 caracteres)"

if ($newPassword.Length -lt 6) {
    Write-Host "Erro: Senha deve ter no minimo 6 caracteres" -ForegroundColor Red
    exit 1
}

Write-Host "`nAlterando senha..." -ForegroundColor Yellow

try {
    $updateBody = @{
        password = $newPassword
    } | ConvertTo-Json

    Invoke-RestMethod -Uri "$SupabaseUrl/auth/v1/admin/users/$userId" -Method PUT -Headers $headers -Body $updateBody | Out-Null
    
    Write-Host "Senha alterada com sucesso!" -ForegroundColor Green
    Write-Host "`nNova senha: $newPassword" -ForegroundColor Cyan
    Write-Host "Email: coachpaulalopes@gmail.com" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Host "Erro ao alterar senha: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}


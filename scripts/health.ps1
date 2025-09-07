# ScribbleTune02 - Health Check
Write-Host "🏥 Checking server health..." -ForegroundColor Blue
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3002/api/health" -Method GET
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host "Status: $($response.status)" -ForegroundColor Yellow
} catch {
    Write-Host "❌ Server not running or not accessible" -ForegroundColor Red
    Write-Host "Make sure to run 'make dev' or '.\scripts\dev.ps1' first" -ForegroundColor Yellow
}

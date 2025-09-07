# ScribbleTune02 - Stop Docker Containers
Write-Host "🐳 Stopping Docker containers..." -ForegroundColor Cyan
docker-compose down
Write-Host "✅ Containers stopped!" -ForegroundColor Green

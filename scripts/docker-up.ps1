# ScribbleTune02 - Start Docker Containers
Write-Host "🐳 Starting Docker containers..." -ForegroundColor Cyan
docker-compose up -d
Write-Host "✅ Containers started!" -ForegroundColor Green
Write-Host "Visit: http://localhost:3000" -ForegroundColor Yellow

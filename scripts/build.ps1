# ScribbleTune02 - Build for Production
Write-Host "🔨 Building for production..." -ForegroundColor Yellow
Set-Location frontend
npm run build
Write-Host "✅ Build complete!" -ForegroundColor Green

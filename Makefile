# ScribbleTune02 - AI Music Generation
# Makefile for common development tasks

.PHONY: help install dev build preview clean test lint format docker-build docker-install docker-clean docker-full docker-up docker-down docker-logs

# Default target
help: ## Show this help message
	@echo "ScribbleTune02 - AI Music Generation"
	@echo "===================================="
	@echo ""
	@echo "Available commands:"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# Development commands
install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	cd frontend && npm install
	@echo "✅ Dependencies installed!"

dev: ## Start development server
	@echo "🚀 Starting development server..."
	cd frontend && npm run dev

build: ## Build for production
	@echo "🔨 Building for production..."
	cd frontend && npm run build
	@echo "✅ Build complete!"

preview: ## Preview production build
	@echo "👀 Starting preview server..."
	cd frontend && npm run preview

# Code quality
test: ## Run tests
	@echo "🧪 Running tests..."
	cd frontend && npm run test

lint: ## Run linter
	@echo "🔍 Running linter..."
	cd frontend && npm run lint

format: ## Format code
	@echo "✨ Formatting code..."
	cd frontend && npm run format

# Cleanup
clean: ## Clean build artifacts and node_modules
	@echo "🧹 Cleaning up..."
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf frontend/.svelte-kit
	rm -rf frontend/build
	@echo "✅ Cleanup complete!"

# Docker commands
docker-build: ## Build Docker image
	@echo "🐳 Building Docker image..."
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "🔨 Building Docker image..."
	docker build --no-cache -t scribbletune02 -f frontend/Dockerfile .
	@echo "✅ Docker image built!"

docker-install: ## Install frontend dependencies
	@echo "📦 Installing frontend dependencies..."
	cd frontend && npm install
	@echo "✅ Dependencies installed!"

docker-clean: ## Clean Docker images and containers
	@echo "🧹 Cleaning Docker images and containers..."
	docker-compose down --rmi all --volumes --remove-orphans || true
	docker rmi scribbletune02 || true
	@echo "✅ Docker cleanup complete!"

docker-full: docker-install docker-build ## Install dependencies and build Docker image
	@echo "🎉 Full Docker build complete!"

up: ## Start Docker containers
	@echo "🐳 Starting Docker containers..."
	docker-compose up 
	@echo "✅ Containers started!"
	
upd: ## Start Docker containers with d flag
	@echo "🐳 Starting Docker containers..."
	docker-compose up -d
	@echo "✅ Containers started!"

down: ## Stop Docker containers
	@echo "🐳 Stopping Docker containers..."
	docker-compose down
	@echo "✅ Containers stopped!"

logs: ## Show Docker logs
	@echo "📋 Showing Docker logs..."
	docker-compose logs -f

# Music generation
generate: ## Generate music (requires dev server running)
	@echo "🎵 Generating music..."
	curl -X POST http://localhost:3002/api/generate
	@echo "✅ Music generation complete!"

# Database/Config
config: ## Open configuration in browser
	@echo "⚙️ Opening configuration..."
	@echo "Visit: http://localhost:3002/config"

# Health check
health: ## Check if server is running
	@echo "🏥 Checking server health..."
	curl -s http://localhost:3002/api/health || echo "❌ Server not running"

# Full setup
setup: install ## Complete project setup
	@echo "🎵 ScribbleTune02 setup complete!"
	@echo "Run 'make dev' to start the development server"
	@echo "Visit http://localhost:3002 to use the application"

# Quick start
start: dev ## Alias for dev command

# Production deployment
deploy: build ## Build and prepare for deployment
	@echo "🚀 Ready for deployment!"
	@echo "Build artifacts are in frontend/dist/"
	@echo "Deploy the contents of frontend/dist/ to your hosting provider"

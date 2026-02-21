.PHONY: help bootstrap deploy build up down logs restart status clean

DOMAIN ?= practicedata.example.com

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

bootstrap: ## First-time VPS setup (run as root)
	@bash infra/scripts/bootstrap.sh

deploy: build up ## Build and deploy the application
	@echo "Deployment complete."

build: ## Build Docker image
	DOMAIN=$(DOMAIN) docker compose build --no-cache

up: ## Start all services
	DOMAIN=$(DOMAIN) docker compose up -d

down: ## Stop all services
	docker compose down

logs: ## Show logs (follow mode)
	docker compose logs -f

logs-app: ## Show Next.js logs only
	docker compose logs -f nextjs

restart: ## Restart all services
	docker compose restart

status: ## Show service status
	docker compose ps

clean: ## Remove all containers, images, and volumes
	docker compose down -v --rmi all

update: ## Pull latest code and redeploy
	git pull origin main
	$(MAKE) deploy

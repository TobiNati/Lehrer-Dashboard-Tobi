.PHONY: help dev
.DEFAULT_GOAL := help

PORT ?= 8080

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  %-8s %s\n", $$1, $$2}'

dev: ## Start a local server on http://localhost:$(PORT)
	python -m http.server $(PORT)

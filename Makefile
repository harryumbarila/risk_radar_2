DOCKER_COMPOSE := docker-compose
YARN := yarn

default: start

### Main ###

.PHONY: docker-compose
docker-compose: docker-compose.override.yaml
	@echo COMPOSE_FILE=${COMPOSE_FILE}

.PHONY: start ## Start the application
start: docker-compose
	$(YARN) install
	$(DOCKER_COMPOSE) up -d --remove-orphans
	$(YARN) dev

.PHONY: stop ## Stop the application
stop:
	$(DOCKER_COMPOSE) down -v --remove-orphans

.PHONY: format ## Format code using Prettier
format:
	$(YARN) format

.PHONY: lint ## Run linting
lint:
	$(YARN) lint

.PHONY: type-check ## Run TypeScript type checking
type-check:
	$(YARN) type-check

.PHONY: test ## Run all tests
test:
	$(YARN) test:unit
	$(YARN) test:e2e

docker-compose.override.yaml: docker-compose.override.yaml.dist
	@echo ">>> File '$@' doesn't exist or it is older than '$?'. Trying to override..."
	cp -i $? $@ && touch $@

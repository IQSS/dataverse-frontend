include .env
export

SHELL = /bin/bash

checkout-frontend:
	if [ -d "frontend/git" ]; then pushd frontend/git; git checkout ${FRONTEND_VERSION}; git pull; popd; \
		else git clone https://github.com/IQSS/dataverse-frontend.git frontend/git; pushd frontend/git; git checkout ${FRONTEND_VERSION}; popd; fi

.PHONY: keycloak-up
keycloak-up: checkout-frontend
	docker compose -f docker-compose-keycloak.yml up -d --build

.PHONY: keycloak-%
keycloak-%:
	docker compose -f docker-compose-keycloak.yml $*

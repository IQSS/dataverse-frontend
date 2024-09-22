include .env
export

SHELL = /bin/bash

.PHONY: keycloak-up
keycloak-up:
	docker compose -f docker-compose-keycloak.yml up -d --build

.PHONY: keycloak-%
keycloak-%:
	docker compose -f docker-compose-keycloak.yml $*

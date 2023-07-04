#!/usr/bin/env bash

export DATAVERSE_BRANCH_NAME=$1

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

# Timeout for Dataverse bootstrap configbaker
export DATAVERSE_BOOTSTRAP_TIMEOUT="5m"

echo "INFO - Setting up Dataverse on branch ${DATAVERSE_BRANCH_NAME}..."

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Running docker containers..."
docker-compose -f "./docker-compose-dev.yml" up -d --build

#!/usr/bin/env bash

export DATAVERSE_IMAGE_TAG=$1

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

# Timeout for Dataverse bootstrap configbaker
export DATAVERSE_BOOTSTRAP_TIMEOUT="5m"

echo "INFO - Setting up Dataverse on image tag ${DATAVERSE_IMAGE_TAG}..."

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Running docker containers..."
docker-compose -f "./docker-compose-dev.yml" up -d --build

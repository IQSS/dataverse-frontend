#!/usr/bin/env bash

export DATAVERSE_IMAGE_TAG=$1

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

# Newer Docker Compose builds with Bake by default, which rejects the frontend's
# `network: host` build option unless --allow=network.host is passed
export COMPOSE_BAKE=false

# Timeout for Dataverse bootstrap configbaker
export DATAVERSE_BOOTSTRAP_TIMEOUT="10m"

echo "INFO - Setting up Dataverse on image tag ${DATAVERSE_IMAGE_TAG}..."

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Running docker containers..."
docker compose -f "./docker-compose-dev.yml" up -d --build

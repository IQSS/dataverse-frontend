#!/usr/bin/env bash

export DATAVERSE_IMAGE_TAG=$1

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

# Timeout for Dataverse bootstrap configbaker
export DATAVERSE_BOOTSTRAP_TIMEOUT="10m"

echo "INFO - Setting up Dataverse on image tag ${DATAVERSE_IMAGE_TAG}..."

# nginx mounts ../dist-uploader to serve the reusable React components at
# /dvwebloader/. If that directory is missing the JSF react-uploader feature
# will 404. Build it now if it isn't there yet — it's cheap if up to date.
if [ ! -f "../dist-uploader/reusable-components/dv-uploader.js" ]; then
  echo "INFO - dist-uploader bundle missing; running 'npm run build-uploader'..."
  (cd .. && npm run build-uploader)
fi

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Running docker containers..."
docker compose -f "./docker-compose-dev.yml" up -d --build

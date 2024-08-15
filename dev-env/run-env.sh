#!/usr/bin/env bash

echo "INFO - Configuring etc/hosts to support direct upload through containers..."

HOSTS_FILE="/etc/hosts"
HOSTNAME="localstack"
IP_ADDRESS="127.0.0.1"

add_host_entry() {
    if grep -q "$HOSTNAME" "$HOSTS_FILE"; then
        echo "$HOSTNAME is already present in $HOSTS_FILE"
    else
        echo "Adding $HOSTNAME to $HOSTS_FILE"
        echo "$IP_ADDRESS $HOSTNAME" | sudo tee -a "$HOSTS_FILE" > /dev/null
        echo "$HOSTNAME added successfully"
    fi
}

add_host_entry

export DATAVERSE_IMAGE_TAG=$1

# To avoid timeout issues on frontend container startup
export COMPOSE_HTTP_TIMEOUT=200

# Timeout for Dataverse bootstrap configbaker
export DATAVERSE_BOOTSTRAP_TIMEOUT="10m"

echo "INFO - Setting up Dataverse on image tag ${DATAVERSE_IMAGE_TAG}..."

echo "INFO - Removing current environment if exists..."
./rm-env.sh

echo "INFO - Running docker containers..."
docker compose -f "./docker-compose-dev.yml" up -d --build

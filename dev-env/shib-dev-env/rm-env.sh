#!/usr/bin/env bash

docker compose -f "./docker-compose-dev.yml" down
rm -rf ./docker-dev-volumes

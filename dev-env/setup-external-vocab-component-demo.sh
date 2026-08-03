#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)
REPO_ROOT=$(cd "${SCRIPT_DIR}/.." && pwd -P)

API_BASE_URL=${API_BASE_URL:-"http://localhost:8000/api"}
DATAVERSE_ALIAS=${DATAVERSE_ALIAS:-"root"}
METADATA_BLOCK_NAME=${METADATA_BLOCK_NAME:-"extVocabComponentDemoMetadata"}
CVOC_CONF_FILE=${CVOC_CONF_FILE:-"${REPO_ROOT}/tests/component/fixtures/component-types-cvoc-conf.json"}
METADATA_BLOCK_TSV=${METADATA_BLOCK_TSV:-"${SCRIPT_DIR}/fixtures/cvoc-component-types-demo.tsv"}
COMPOSE_FILE=${COMPOSE_FILE:-"${SCRIPT_DIR}/docker-compose-dev.yml"}
DATAVERSE_ADMIN_USER=${DATAVERSE_ADMIN_USER:-"dataverseAdmin"}
DATAVERSE_ADMIN_PASSWORD=${DATAVERSE_ADMIN_PASSWORD:-"admin1"}
SOLR_DATA_DIR=${SOLR_DATA_DIR:-"${SCRIPT_DIR}/docker-dev-volumes/solr/data"}
SOLR_SCHEMA_PATH=${SOLR_SCHEMA_PATH:-"${SOLR_DATA_DIR}/data/collection1/conf/schema.xml"}
SOLR_STATUS_URL=${SOLR_STATUS_URL:-"http://localhost:8983/solr/admin/cores?action=STATUS"}

API_BASE_URL=${API_BASE_URL%/}

require_command() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "ERROR - Required command not found: $1" >&2
    exit 1
  }
}

json_status_ok() {
  local response="$1"
  local context="$2"

  if ! jq -e '.status == "OK"' >/dev/null <<<"${response}"; then
    echo "ERROR - ${context} failed:" >&2
    jq . >&2 <<<"${response}" || echo "${response}" >&2
    exit 1
  fi
}

wait_for_dataverse() {
  echo "INFO - Waiting for Dataverse at ${API_BASE_URL}..."
  for _ in {1..60}; do
    if curl -fsS "${API_BASE_URL}/info/version" >/dev/null; then
      return 0
    fi
    sleep 2
  done

  echo "ERROR - Dataverse did not become ready at ${API_BASE_URL}." >&2
  exit 1
}

wait_for_solr() {
  echo "INFO - Waiting for Solr at ${SOLR_STATUS_URL}..."
  for _ in {1..60}; do
    if curl -fsS "${SOLR_STATUS_URL}" >/dev/null; then
      return 0
    fi
    sleep 2
  done

  echo "ERROR - Solr did not become ready at ${SOLR_STATUS_URL}." >&2
  exit 1
}

get_api_token() {
  if [[ -n "${API_TOKEN:-}" ]]; then
    echo "${API_TOKEN}"
    return 0
  fi

  echo "INFO - Enabling API token lookup for local dev..." >&2
  local response
  response=$(curl -fsS -X PUT -d "true" "${API_BASE_URL}/admin/settings/:AllowApiTokenLookupViaApi")
  json_status_ok "${response}" "Enable :AllowApiTokenLookupViaApi"

  echo "INFO - Fetching API token for ${DATAVERSE_ADMIN_USER}..." >&2
  response=$(
    curl -fsS \
      "${API_BASE_URL}/builtin-users/${DATAVERSE_ADMIN_USER}/api-token?password=${DATAVERSE_ADMIN_PASSWORD}"
  )
  json_status_ok "${response}" "Fetch API token"
  jq -r '.data.message' <<<"${response}"
}

load_metadata_block() {
  if curl -fsS "${API_BASE_URL}/metadatablocks/${METADATA_BLOCK_NAME}" >/dev/null 2>&1; then
    echo "INFO - Metadata block ${METADATA_BLOCK_NAME} already exists; skipping TSV load."
    return 0
  fi

  echo "INFO - Loading metadata block TSV ${METADATA_BLOCK_TSV}..."
  local response
  response=$(
    curl -fsS \
      -X POST \
      -H "Content-type: text/tab-separated-values" \
      --data-binary @"${METADATA_BLOCK_TSV}" \
      "${API_BASE_URL}/admin/datasetfield/load"
  )
  json_status_ok "${response}" "Load metadata block TSV"
}

set_cvoc_conf() {
  echo "INFO - Setting :CVocConf from ${CVOC_CONF_FILE}..."
  local response
  response=$(
    curl -fsS \
      -X PUT \
      -H "Content-type: application/json" \
      --upload-file "${CVOC_CONF_FILE}" \
      "${API_BASE_URL}/admin/settings/:CVocConf"
  )
  json_status_ok "${response}" "Set :CVocConf"
}

enable_block_on_dataverse() {
  local api_token="$1"

  echo "INFO - Ensuring ${METADATA_BLOCK_NAME} is enabled on ${DATAVERSE_ALIAS}..."
  local blocks response
  response=$(
    curl -fsS \
      -H "X-Dataverse-key:${api_token}" \
      "${API_BASE_URL}/dataverses/${DATAVERSE_ALIAS}/metadatablocks"
  )
  json_status_ok "${response}" "Read ${DATAVERSE_ALIAS} metadata blocks"

  blocks=$(jq --arg block "${METADATA_BLOCK_NAME}" '[.data[].name] + [$block] | unique' <<<"${response}")
  response=$(
    curl -fsS \
      -X POST \
      -H "X-Dataverse-key:${api_token}" \
      -H "Content-type: application/json" \
      -d "${blocks}" \
      "${API_BASE_URL}/dataverses/${DATAVERSE_ALIAS}/metadatablocks"
  )
  json_status_ok "${response}" "Enable ${METADATA_BLOCK_NAME} on ${DATAVERSE_ALIAS}"
}

update_solr_schema() {
  if [[ ! -w "${SOLR_SCHEMA_PATH}" ]]; then
    echo "ERROR - Cannot find or write Solr schema at ${SOLR_SCHEMA_PATH}." >&2
    echo "        Start the docker dev environment first, or override SOLR_SCHEMA_PATH." >&2
    exit 1
  fi

  echo "INFO - Updating Solr schema for custom metadata fields..."
  local solr_data_abs schema_abs schema_in_container
  solr_data_abs=$(cd "${SOLR_DATA_DIR}" && pwd -P)
  schema_abs=$(cd "$(dirname "${SOLR_SCHEMA_PATH}")" && pwd -P)/$(basename "${SOLR_SCHEMA_PATH}")

  case "${schema_abs}" in
    "${solr_data_abs}"/*)
      schema_in_container="/var/solr/${schema_abs#"${solr_data_abs}/"}"
      ;;
    *)
      echo "ERROR - SOLR_SCHEMA_PATH must be inside SOLR_DATA_DIR for the configbaker mount." >&2
      echo "        SOLR_DATA_DIR=${solr_data_abs}" >&2
      echo "        SOLR_SCHEMA_PATH=${schema_abs}" >&2
      exit 1
      ;;
  esac

  curl -fsS "${API_BASE_URL}/admin/index/solr/schema" |
    docker run -i --rm \
      -v "${solr_data_abs}:/var/solr" \
      gdcc/configbaker:unstable \
      update-fields.sh "${schema_in_container}"
}

restart_solr() {
  echo "INFO - Restarting dev_solr so the updated schema is active..."
  docker compose -f "${COMPOSE_FILE}" restart dev_solr
  wait_for_solr
}

reindex_dataverse() {
  echo "INFO - Clearing index timestamps and starting reindex-in-place..."
  local response
  response=$(curl -fsS -X DELETE "${API_BASE_URL}/admin/index/timestamps")
  json_status_ok "${response}" "Clear index timestamps"

  response=$(curl -fsS "${API_BASE_URL}/admin/index/continue")
  json_status_ok "${response}" "Start reindex-in-place"
}

main() {
  require_command curl
  require_command docker
  require_command jq

  [[ -f "${CVOC_CONF_FILE}" ]] || {
    echo "ERROR - CVocConf fixture not found: ${CVOC_CONF_FILE}" >&2
    exit 1
  }
  [[ -f "${METADATA_BLOCK_TSV}" ]] || {
    echo "ERROR - Metadata block TSV not found: ${METADATA_BLOCK_TSV}" >&2
    exit 1
  }

  wait_for_dataverse
  local api_token
  api_token=$(get_api_token)
  load_metadata_block
  set_cvoc_conf
  enable_block_on_dataverse "${api_token}"
  update_solr_schema
  restart_solr
  reindex_dataverse

  echo "INFO - External vocabulary component demo configured."
  echo "INFO - Open ${API_BASE_URL%/api}/modern and create or edit a dataset in ${DATAVERSE_ALIAS}."
}

main "$@"

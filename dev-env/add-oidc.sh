#!/usr/bin/env bash

curl -X POST -H 'Content-type: application/json' --upload-file oidc.json http://localhost:8080/api/admin/authenticationProviders
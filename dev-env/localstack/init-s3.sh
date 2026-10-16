#!/usr/bin/env bash

set -euo pipefail

BUCKET_NAME=${S3_BUCKET_NAME:-dataverse}

rm -f /tmp/.s3-init-complete

if ! awslocal s3api head-bucket --bucket "$BUCKET_NAME" 2>/dev/null; then
  awslocal s3api create-bucket --bucket "$BUCKET_NAME"
fi

awslocal s3api put-bucket-cors \
  --bucket "$BUCKET_NAME" \
  --cors-configuration '{
    "CORSRules": [
      {
        "AllowedHeaders": ["*"],
        "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
        "AllowedOrigins": ["*"],
        "ExposeHeaders": ["ETag"]
      }
    ]
  }'

touch /tmp/.s3-init-complete

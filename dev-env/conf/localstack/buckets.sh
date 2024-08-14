#!/usr/bin/env bash

echo "Creating S3 bucket..."
awslocal s3 mb s3://mybucket || { echo "Failed to create S3 bucket"; exit 1; }

echo "Applying CORS configuration..."
awslocal s3api put-bucket-cors --bucket mybucket --cors-configuration file:///etc/localstack/init/ready.d/cors.json || { echo "Failed to apply CORS configuration"; exit 1; }

echo "CORS configuration applied successfully"

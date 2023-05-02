#!/usr/bin/env bash

export DATAVERSE_BRANCH_NAME=$1

DATAVERSE_HOST=http://localhost:8080

echo "INFO - Setting up Dataverse on branch ${DATAVERSE_BRANCH_NAME}..."

echo "INFO - Cloning Dataverse backend repository..."
git clone -b ${DATAVERSE_BRANCH_NAME} git@github.com:IQSS/dataverse.git

echo "INFO - Running docker containers..."
docker-compose -f "./docker-compose-dev.yml" up -d --build

echo "INFO - Waiting for containers to be ready..."
# Up to ~5 minutes
max_attempts=30
n_attempts=0
until $(curl --output /dev/null --silent --head --fail ${DATAVERSE_HOST}/api/info/version); do
    if [ ${n_attempts} -eq ${max_attempts} ];then
      echo "ERROR - Timeout reached while waiting for containers to be ready"
      ./rm-env.sh
      rm -rf dataverse
      exit 1
    fi
    n_attempts=$(($n_attempts+1))
    sleep 10
done

echo "INFO - Bootstrapping dataverse..."
cd dataverse
./scripts/dev/docker-final-setup.sh

echo "INFO - Cleaning up repository..."
cd ..
rm -rf dataverse

echo "INFO - Cloning Dataverse sample data repository..."
git clone git@github.com:IQSS/dataverse-sample-data.git

echo "INFO - Configuring Dataverse sample data repository..."
cd dataverse-sample-data
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../dvconfig.py ./dvconfig.py
curl -X PUT -d 'true' ${DATAVERSE_HOST}/api/admin/settings/:AllowApiTokenLookupViaApi
dataverse_api_token=$(python3 get_api_token.py)
sed -i '' "s/<DATAVERSE_HOST>/${DATAVERSE_HOST}/g" dvconfig.py
sed -i '' "s/<DATAVERSE_API_TOKEN>/${dataverse_api_token}/g" dvconfig.py

echo "INFO - Creating sample data..."
python3 create_sample_data.py

echo "INFO - Cleaning up repository..."
cd ..
rm -rf dataverse-sample-data

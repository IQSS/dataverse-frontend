#!/usr/bin/env bash

echo "INFO - Cloning Dataverse sample data repository..."
git clone https://github.com/IQSS/dataverse-sample-data.git

echo "INFO - Configuring Dataverse sample data repository..."
cd dataverse-sample-data
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp ../dvconfig.py ./dvconfig.py
curl -X PUT -d 'true' ${DATAVERSE_API_BASE_URL}/admin/settings/:AllowApiTokenLookupViaApi
dataverse_api_token=$(python3 get_api_token.py)
sed -i '' "s/<DATAVERSE_API_TOKEN>/${dataverse_api_token}/g" dvconfig.py

echo "INFO - Creating sample data..."
python3 create_sample_data.py

echo "INFO - Cleaning up repository..."
cd ..
rm -rf dataverse-sample-data

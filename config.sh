
#!/usr/bin/env bash
#chmod +x ./config.sh

#UPDATE WITH YOUR API TOKEN
API_TOKEN="1f203f6d-54b2-464e-bfcb-918f4fb0959a"

#COLLECTION, TYPE AND METADATA BLOCK DOWNLOAD
curl -fL "https://raw.githubusercontent.com/IQSS/dataverse/master/scripts/api/data/metadatablocks/review.tsv" -o "review.tsv"
curl -fL "https://guides.dataverse.org/en/latest/_downloads/c2a076bba578dc93b3582f41d6fba594/review.json" -o "review.json"
curl -fL "https://guides.dataverse.org/en/latest/_downloads/78ade9231d6876a7c9fa1ff095c446bd/dataverse-complete.json" -o "collection.json"

#METADATA BLOCK UPLOAD
curl "http://localhost:8080/api/admin/datasetfield/load" -H "Content-type: text/tab-separated-values" -X POST --upload-file "review.tsv"

#SOLR UPDATE
curl -fS "http://localhost:8080/api/admin/index/solr/schema" | docker run -i --rm \
  -v "$(pwd)/dev-env/docker-dev-volumes/solr/data:/var/solr" \
  gdcc/configbaker:unstable \
  update-fields.sh /var/solr/data/collection1/conf/schema.xml -
curl -fS "http://localhost:8983/solr/admin/cores?action=RELOAD&core=collection1&wt=json"
curl -fS "http://localhost:8080/api/admin/index"

#DATASET TYPE UPLOAD
curl -H "X-Dataverse-key:$API_TOKEN" -H "Content-Type: application/json" "http://localhost:8080/api/datasets/datasetTypes" -X POST --upload-file review.json

#COLLECTION CREATION AND PUBLISHING (NODE REQUIRED)
#REVIEWS COLLECTION
node -e 'const fs = require("fs"); const collection = JSON.parse(fs.readFileSync("collection.json", "utf8")); collection.name = "REVIEWS"; collection.alias = "REVIEWS"; fs.writeFileSync("collection.json", JSON.stringify(collection, null, 2) + "\n");'
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/root" --upload-file collection.json
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/REVIEWS/actions/:publish"
curl -X PUT -H "X-Dataverse-key:$API_TOKEN" "http://localhost:8080/api/dataverses/REVIEWS/attribute/allowedDatasetTypes?value=review"
#DATASETS COLLECTION
node -e 'const fs = require("fs"); const collection = JSON.parse(fs.readFileSync("collection.json", "utf8")); collection.name = "DATASETS"; collection.alias = "DATASETS"; fs.writeFileSync("collection.json", JSON.stringify(collection, null, 2) + "\n");'
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/root" --upload-file collection.json
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/DATASETS/actions/:publish"
curl -X PUT -H "X-Dataverse-key:$API_TOKEN" "http://localhost:8080/api/dataverses/DATASETS/attribute/allowedDatasetTypes?value=dataset"
#MIX COLLECTION
node -e 'const fs = require("fs"); const collection = JSON.parse(fs.readFileSync("collection.json", "utf8")); collection.name = "MIX"; collection.alias = "MIX"; fs.writeFileSync("collection.json", JSON.stringify(collection, null, 2) + "\n");'
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/root" --upload-file collection.json
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/MIX/actions/:publish"
curl -X PUT -H "X-Dataverse-key:$API_TOKEN" "http://localhost:8080/api/dataverses/MIX/attribute/allowedDatasetTypes?value=review,dataset"
#VANILLA COLLECTION
node -e 'const fs = require("fs"); const collection = JSON.parse(fs.readFileSync("collection.json", "utf8")); collection.name = "VANILLA"; collection.alias = "VANILLA"; fs.writeFileSync("collection.json", JSON.stringify(collection, null, 2) + "\n");'
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/root" --upload-file collection.json
curl -H "X-Dataverse-key:$API_TOKEN" -X POST "http://localhost:8080/api/dataverses/VANILLA/actions/:publish"


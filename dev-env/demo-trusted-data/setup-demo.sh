#!/bin/bash
DATAVERSE_KEY="f83abc9b-1ddd-4782-820d-f57881049e91"

echo -e "\n--- Running: trusteddatadimensionsintensities.tsv ---"
curl http://localhost:8080/api/admin/datasetfield/load -H "Content-type: text/tab-separated-values" -X POST --upload-file ./trusteddatadimensionsintensities.tsv

echo -e "\n--- Running: repositorycharacteristics.tsv ---"
curl http://localhost:8080/api/admin/datasetfield/load -H "Content-type: text/tab-separated-values" -X POST --upload-file ./repositorycharacteristics.tsv

echo -e "\n--- Running: metadatablocks ---"
curl -H "X-Dataverse-key:$DATAVERSE_KEY" -X POST -H "Content-type:application/json" -d "[\"repositorycharacteristics\",\"trusteddatadimensionsintensities\"]" http://localhost:8080/api/dataverses/:root/metadatablocks

echo -e "\n--- Running: datasetTypes ---"
curl -H "X-Dataverse-key:$DATAVERSE_KEY" -H "Content-Type: application/json" "localhost:8080/api/datasets/datasetTypes" -X POST -d '{"name":"review","linkedMetadataBlocks":[],"availableLicenses":[]}'

echo -e "\n--- SOLR ---"
curl http://localhost:8080/api/admin/index/solr/schema | docker run -i --rm -v ./docker-dev-volumes/solr/data:/var/solr gdcc/configbaker:unstable update-fields.sh /var/solr/data/collection1/conf/schema.xml
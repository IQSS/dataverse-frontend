# Keycloak Instance Deployment

This guide walks you through the process of deploying and configuring a Keycloak instance to support authentication for Dataverse’s Single Page Application (SPA) built-in users.

### Download Keycloak

Install [Keycloak](https://www.keycloak.org/downloads.html) from the official website. Download a ZIP file that you'll need to place and unzip into the target instance.

### Download JDBC Drivers

Download the following Java Database Connectivity (JDBC) drivers from the URLs below, and place the downloaded `.jar` files in the `keycloak-26.X.X/providers` directory:

- [ojdbc11-23.7.0.25.01.jar](https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc11/23.7.0.25.01/ojdbc11-23.7.0.25.01.jar)
- [orai18n-23.7.0.25.01.jar](https://repo1.maven.org/maven2/com/oracle/database/nls/orai18n/23.7.0.25.01/orai18n-23.7.0.25.01.jar)

These drivers are required for the Keycloak SPI that you are going to install.

### Add Builtin Users SPI

Download the JAR file from [this link](https://github.com/IQSS/dataverse-frontend/blob/develop/dev-env/keycloak/keycloak-dv-builtin-users-authenticator-1.0-SNAPSHOT.jar), which contains the Builtin User SPI, and place it in the `keycloak-26.X.X/providers` directory.

### Add Keycloak Custom Theme

Make sure you have **Maven** installed on your localhost.

Within the ``dataverse-frontend`` repository, run the following command to build the custom Keycloak theme:

   ```bash
   npm run build-keycloak-theme
   ```

Copy the generated ``dv-spa-kc-theme.jar`` file to your Keycloak instance’s ``keycloak-26.X.X/providers`` directory.

### Create quarkus.properties

Inside the ``keycloak-26.X.X/conf`` directory, create the following file, replacing the bracketed variables with the corresponding values for the Dataverse database that the SPI will access.

```properties
quarkus.datasource.user-store.db-kind=postgresql
quarkus.datasource.user-store.jdbc.url=jdbc:postgresql://<SERVER_IP>:<SERVER_PORT>/<DB_NAME>
quarkus.datasource.user-store.username=<DB_USERNAME>
quarkus.datasource.user-store.password=<DB_PASSWORD>

quarkus.datasource.user-store.jdbc.driver=org.postgresql.Driver
quarkus.datasource.user-store.jdbc.transactions=disabled
quarkus.transaction-manager.unsafe-multiple-last-resources=allow

quarkus.datasource.user-store.jdbc.recovery.username=<DB_USERNAME>
quarkus.datasource.user-store.jdbc.recovery.password=<DB_PASSWORD>

quarkus.datasource.user-store.jdbc.xa-properties.serverName=<SERVER_IP>
quarkus.datasource.user-store.jdbc.xa-properties.portNumber=<SERVER_PORT>
quarkus.datasource.user-store.jdbc.xa-properties.databaseName=<DB_NAME>
```

### SSL configuration

To enable SSL in Keycloak, you first need to add the required SSL certificates and private keys to the instance. Specifically, the following files should be added:

- `/etc/ssl/certs/<CER_NAME>.cer`
- `/etc/pki/tls/private/<KEY_NAME>.key`

Remember to update these routes with your actual file names.

Once the certificate and key have been uploaded to the instance, you need to configure the following Keycloak environment variables:

- `KC_HTTPS_CERTIFICATE_FILE=/etc/ssl/certs/<CER_NAME>.cer`
- `KC_HTTPS_CERTIFICATE_KEY_FILE=/etc/pki/tls/private/<KEY_NAME>.key`
- `KC_HTTPS_ENABLED=true`
- `KC_HTTPS_PORT=443`

### Running Keycloak

Run Keycloak for the first time on the instance using the following command. 

```bash
nohup ./bin/kc.sh start --bootstrap-admin-username tmpadm --bootstrap-admin-password pass --hostname https://beta-keycloak.dataverse.org > keycloak.log 2>&1 &
```

This command will set up an admin user so you can log in and create a permanent one from the Keycloak Admin Console:  
[https://beta-keycloak.dataverse.org/admin/master/console/](https://beta-keycloak.dataverse.org/admin/master/console/).

For subsequent executions of Keycloak, you can use the following command omitting the admin user bootstrapping parameters:

```bash
nohup ./bin/kc.sh start --hostname https://beta-keycloak.dataverse.org > keycloak.log 2>&1 &2>&1 &
```

### Create a Keycloak Realm

TODO

### Enable Builtin Users SPI

TODO

```bash
#!/bin/sh

# Obtain admin token
ADMIN_TOKEN=$(curl -k -s -X POST "https://localhost:443/realms/master/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=<ADMIN_USERNAME>" \
  -d "password=<ADMIN_PASSWORD>" \
  -d "grant_type=password" \
  -d "client_id=admin-cli" | jq -r .access_token)
echo $ADMIN_TOKEN
# Create user storage provider using the components endpoint
curl -k -X POST "https://localhost:443/admin/realms/<REALM_NAME>/components" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dataverse built-in users authentication",
    "providerId": "dv-builtin-users-authenticator",
    "providerType": "org.keycloak.storage.UserStorageProvider",
    "parentId": null
  }'

echo "Keycloak SPI configured in realm."
```

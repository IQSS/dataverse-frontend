FROM quay.io/keycloak/keycloak:26.1.4

# Add the Oracle JDBC jars
ARG ORACLE_JDBC_VERSION=23.7.0.25.01
ADD --chown=keycloak:keycloak https://repo1.maven.org/maven2/com/oracle/database/jdbc/ojdbc11/${ORACLE_JDBC_VERSION}/ojdbc11-${ORACLE_JDBC_VERSION}.jar /opt/keycloak/providers/ojdbc11.jar
ADD --chown=keycloak:keycloak https://repo1.maven.org/maven2/com/oracle/database/nls/orai18n/${ORACLE_JDBC_VERSION}/orai18n-${ORACLE_JDBC_VERSION}.jar /opt/keycloak/providers/orai18n.jar

# Health build parameter
ENV KC_HEALTH_ENABLED=true

# Copy SPI JAR
COPY keycloak-dv-builtin-users-authenticator-1.0-SNAPSHOT.jar /opt/keycloak/providers/

# Copy additional configurations
COPY quarkus.properties /opt/keycloak/conf/
COPY test-realm.json /opt/keycloak/data/import/

# Set the Keycloak command
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start-dev", "--import-realm", "--http-port=9080"]

# Expose port 9080
EXPOSE 9080

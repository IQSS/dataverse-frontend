![Untitled Diagram drawio](https://github.com/user-attachments/assets/c4acd0a3-11c1-4f19-adf4-45f887ae91fd)

Steps needed to get it running:
- make sure you have a `.npmrc` file in your project (see also documentation and the [example](/.npmrc.example))
- make a `.env` file inside the `dev-authn-env` directory (see [example](/dev-authn-env/.env.example))
- change the username inside [/dev-authn-env/keycloak/oauth2-proxy-users-0.json](/dev-authn-env/keycloak/oauth2-proxy-users-0.json) to the username as used in the configured in the `.env` file (mentioned above) Dataverse installation
- `cd` into `dev-authn-env` directory and run `make keycloak-up`
- go to the SPA at http://dataverse-public.localtest.me:9000/, you can log in (password is `password`), etc.
- see also [docker-compose-keycloak.yml](/dev-authn-env/docker-compose-keycloak.yml) and the configuration files ([oauth2-proxy-keycloak.cfg](/dev-authn-env/oauth2-proxy-keycloak.cfg) etc.)

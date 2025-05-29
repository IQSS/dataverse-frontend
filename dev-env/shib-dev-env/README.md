# Dev Environment with Shibboleth Integration

This directory contains a specialized version of the development environment tailored for integrating the Shibboleth Identity Provider (IdP) and LDAP. It extends Keycloak’s capabilities to function as a SAML-to-OIDC broker, allowing external Shibboleth users to authenticate in the SPA using the PKCE flow. The reverse proxy is also configured to use HTTPS, as required for Shibboleth compatibility.

## Key Features

- Includes **Shibboleth IdP** and **LDAP** setup.
- Enhanced **Keycloak** configuration to support SAML and Shibboleth integration.
- Reverse proxy configuration modified to support **HTTPS**, as required by Shibboleth.

## Setup Instructions

To use this environment, follow these steps:

1. Replace the `.env` file at the project root with the contents of `.env.example.shib`.
2. Fill in the `.env` variables inside the `shib-dev-env/` folder, similarly to how it's done in the standard `dev-env/` folder.

Ensure that all required environment variables are correctly set before launching the environment.

## Usage Notes

- ⚠️ **Do not use this environment to run automated tests**. For automated testing purposes, use the standard `dev-env`.
- ⚠️ **Do not use this environment for general development work** unless you are specifically working on **Shibboleth-related functionality**.

## When to Use This Environment

Use this setup **only if** your work involves:

- SAML or Shibboleth integration.
- Testing identity federation scenarios.
- Extending Keycloak's SAML capabilities.

For all other development and testing, please use the regular `dev-env`.

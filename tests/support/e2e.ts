// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import '../../tests/support/commands'
import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { BASE_URL } from '../../src/config'

ApiConfig.init(`${BASE_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import registerCypressGrep from '@cypress/grep'
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
registerCypressGrep()

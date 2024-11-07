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
// import { ApiConfig } from '@iqss/dataverse-client-javascript/dist/core'
// import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
// import { DATAVERSE_BACKEND_URL } from '../../src/config'

// TODO:ME Why do we need api config in here?
// ApiConfig.init(`${DATAVERSE_BACKEND_URL}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)

// This global declaration is to get automatic typescript inferring for wrap https://github.com/cypress-io/cypress/issues/18182
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      wrap<E extends Node = HTMLElement>(
        element: E | JQuery<E>,
        options?: Partial<Loggable & Timeoutable>
      ): Chainable<JQuery<E>>
      wrap<S>(object: S | Promise<S>, options?: Partial<Loggable & Timeoutable>): Chainable<S>
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import registerCypressGrep from '@cypress/grep'
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
registerCypressGrep()

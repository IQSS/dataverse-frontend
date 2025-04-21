// ***********************************************************
// This example support/component.ts is processed and
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
import './commands'
import '@cypress/code-coverage/support'
import '../../src/assets/swal-custom.scss'
import '../../src/assets/react-toastify-custom.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import { mount, MountReturn } from 'cypress/react18'
import { RouterInitialEntry } from './commands'
import { ReactNode } from 'react'
import { User } from '@/users/domain/models/User'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in tests/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
// TODO: remove namespace so that this code passes eslint checks
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      // customMount: typeof mount
      customMount: (
        component: ReactNode,
        initialEntries?: RouterInitialEntry[]
      ) => Cypress.Chainable<MountReturn>
      mountAuthenticated: (
        component: ReactNode,
        initialEntries?: RouterInitialEntry[],
        userOverrides?: Partial<User>
      ) => Cypress.Chainable<MountReturn>
      mountSuperuser: (
        component: ReactNode,
        initialEntries?: RouterInitialEntry[]
      ) => Cypress.Chainable<MountReturn>
      login(): Chainable<string>
      logout(): Chainable<JQuery<HTMLElement>>
      compareDate(date: Date, expectedDate: Date): Chainable
    }
  }
}

Cypress.Commands.add('mount', mount)

// Example use:
// cy.mount(<MyComponent />)

import { DatasetAlerts } from '../../../../../src/sections/dataset/dataset-alerts/DatasetAlerts'
import { faker } from '@faker-js/faker'

import {
  DatasetAlert,
  DatasetAlertMessageKey
} from '../../../../../src/dataset/domain/models/Dataset'

describe('DatasetAlerts', () => {
  function removeMarkup(htmlString: string): string {
    // Use a regular expression to match HTML tags and replace them with an empty string
    return htmlString.replace(/<\/?[^>]+(>|$)/g, '')
  }

  const alerts = [
    new DatasetAlert('warning', DatasetAlertMessageKey.DRAFT_VERSION),
    new DatasetAlert('warning', DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND, {
      requestedVersion: 4.0,
      returnedVersion: 2.0
    }),
    new DatasetAlert('info', DatasetAlertMessageKey.UNPUBLISHED_DATASET, {
      privateUrl: faker.internet.url()
    })
  ]

  it('renders the correct number of alerts', () => {
    cy.mount(<DatasetAlerts alerts={alerts} />)
    cy.findByText('Unpublished Dataset Private URL').should('exist')
  })

  it('renders alerts with correct content', () => {
    cy.fixture('../../../public/locales/en/dataset.json').then((dataset) => {
      cy.mount(<DatasetAlerts alerts={alerts} />)

      cy.findAllByRole('alert').should('exist')
      cy.findAllByRole('alert').should(
        'contain.text',
        removeMarkup(dataset.alerts.draftVersion.alertText)
      )
      cy.findByText('Information').should('exist')
    })
  })

  it('renders alerts with correct headings', () => {
    cy.fixture('../../../public/locales/en/dataset.json').then((dataset) => {
      cy.mount(<DatasetAlerts alerts={alerts} />)
      alerts.forEach((alert) => {
        const alertHeading = removeMarkup(dataset.alerts[alert.message].heading)
        console.log(JSON.stringify(alertHeading))
        cy.findAllByRole('alert').should('contain.text', alertHeading)
      })
    })
  })
  it('renders dynamic text', () => {
    const dynamicFields = {
      requestedVersion: 4.0,
      returnedVersion: 2.0
    }
    const notFoundAlert = new DatasetAlert(
      'warning',
      DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND,
      dynamicFields
    )
    cy.mount(<DatasetAlerts alerts={[notFoundAlert]} />)

    alerts.forEach((alert) => {
      cy.findAllByRole('alert').should('contain.text', dynamicFields.requestedVersion)
      cy.findAllByRole('alert').should('contain.text', dynamicFields.returnedVersion)
    })
  })
})

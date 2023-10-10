import { DatasetAlerts } from '../../../../../src/sections/dataset/dataset-alerts/DatasetAlerts'
import { faker } from '@faker-js/faker'

import {
  DatasetAlert,
  DatasetAlertMessageKey
} from '../../../../../src/dataset/domain/models/Dataset'

function removeMarkup(htmlString: string): string {
  // Use a regular expression to match HTML tags and replace them with an empty string
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '')
}

interface DatasetTranslation {
  alerts: {
    draftVersion: {
      heading: string
      alertText: string
    }
    requestedVersionNotFound: {
      heading: string
      alertText: string
    }
    unpublishedDataset: {
      heading: string
      alertText: string
    }
  }
}

it('renders the correct number of alerts', () => {
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
  cy.fixture('../../../public/locales/en/dataset.json').then((dataset: DatasetTranslation) => {
    cy.mount(<DatasetAlerts alerts={alerts} />)
    const headingProps = [
      dataset.alerts.draftVersion.heading,
      dataset.alerts.requestedVersionNotFound.heading,
      dataset.alerts.unpublishedDataset.heading
    ]
    cy.findAllByRole('alert').should('have.length', 3)
    cy.findAllByRole('alert').each(($alert, index) => {
      cy.wrap($alert).findByText(headingProps[index]).should('exist')
    })
  })
})

it('renders alerts with correct text', () => {
  const draftAlert = new DatasetAlert('info', DatasetAlertMessageKey.DRAFT_VERSION)
  const alerts = [draftAlert]

  cy.fixture('../../../public/locales/en/dataset.json').then((dataset: DatasetTranslation) => {
    cy.mount(<DatasetAlerts alerts={alerts} />)

    const alertHeading = dataset.alerts[draftAlert.message].heading
    const alertText = removeMarkup(dataset.alerts[draftAlert.message].alertText)
    cy.findByText(alertHeading).should('exist')
    cy.findByRole('alert').should(($element) => {
      // text() removes markup, so we can compare to the expected text
      const text = $element.text()
      expect(text).to.include(alertText)
    })
  })
})
it('renders dynamic text', () => {
  const dynamicFields = {
    requestedVersion: '4.0',
    returnedVersion: '2.0'
  }
  const notFoundAlert = new DatasetAlert(
    'warning',
    DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND,
    dynamicFields
  )
  cy.mount(<DatasetAlerts alerts={[notFoundAlert]} />)
  cy.findByRole('alert').should('contain.text', dynamicFields.requestedVersion)
  cy.findByRole('alert').should('contain.text', dynamicFields.returnedVersion)
})

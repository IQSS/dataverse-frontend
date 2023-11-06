import { DatasetAlerts } from '../../../../../src/sections/dataset/dataset-alerts/DatasetAlerts'
import { faker } from '@faker-js/faker'

import {
  DatasetAlert,
  DatasetAlertMessageKey
} from '../../../../../src/dataset/domain/models/Dataset'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../dataset/domain/models/DatasetMother'

function removeMarkup(htmlString: string): string {
  // Use a regular expression to match HTML tags and replace them with an empty string
  return htmlString.replace(/<\/?[^>]+(>|$)/g, '')
}

interface AlertTranslation {
  heading: string
  alertText: string
}

interface DatasetTranslation {
  alerts: {
    [DatasetAlertMessageKey.DRAFT_VERSION]: AlertTranslation
    [DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND]: AlertTranslation
    [DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND_SHOW_DRAFT]: AlertTranslation
    [DatasetAlertMessageKey.UNPUBLISHED_DATASET]: AlertTranslation
    [DatasetAlertMessageKey.SHARE_UNPUBLISHED_DATASET]: AlertTranslation
    [DatasetAlertMessageKey.METADATA_UPDATED]: AlertTranslation
    [DatasetAlertMessageKey.FILES_UPDATED]: AlertTranslation
    [DatasetAlertMessageKey.PUBLISH_IN_PROGRESS]: AlertTranslation
    [DatasetAlertMessageKey.TERMS_UPDATED]: AlertTranslation
    [DatasetAlertMessageKey.DATASET_DELETED]: AlertTranslation
    [DatasetAlertMessageKey.THUMBNAIL_UPDATED]: AlertTranslation
  }
}

it('renders the correct number of alerts', () => {
  const alerts = [
    new DatasetAlert('warning', DatasetAlertMessageKey.DRAFT_VERSION),
    new DatasetAlert('warning', DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND, {
      requestedVersion: 4.0,
      returnedVersion: 2.0
    }),
    new DatasetAlert('info', DatasetAlertMessageKey.SHARE_UNPUBLISHED_DATASET, {
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
it('shows draft alert if version is DRAFT', () => {
  const dataset = DatasetMother.create({
    version: DatasetVersionMother.createDraftAsLatestVersion(),
    permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed()
  })

  cy.customMount(<DatasetAlerts alerts={dataset.alerts} />)

  cy.findByRole('alert').should('contain.text', 'draft')
})
it('does not show draft alert if version is RELEASED', () => {
  const dataset = DatasetMother.create({
    version: DatasetVersionMother.createReleased(),
    permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed()
  })

  cy.customMount(<DatasetAlerts alerts={dataset.alerts} />)
  cy.findByRole('alert').should('not.exist')
})

it('shows draft & share private url message if privateUrl exists and user can edit', () => {
  cy.fixture('../../../public/locales/en/dataset.json').then((datasetText: DatasetTranslation) => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })
    cy.customMount(<DatasetAlerts alerts={dataset.alerts} />)
    const expectedMessageKeys = [
      DatasetAlertMessageKey.DRAFT_VERSION,
      DatasetAlertMessageKey.SHARE_UNPUBLISHED_DATASET
    ]
    cy.findAllByRole('alert').should('have.length', 2)
    cy.findAllByRole('alert').each(($alert, index) => {
      const messageKey = expectedMessageKeys[index]
      const itemText = datasetText.alerts[messageKey]
      cy.wrap($alert).findByText(itemText.heading).should('exist')
    })
  })
})
it('shows  private url message  only if privateUrl exists and user cannot edit', () => {
  cy.fixture('../../../public/locales/en/dataset.json').then((datasetText: DatasetTranslation) => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraftAsLatestVersion(),
      permissions: DatasetPermissionsMother.createWithNoneAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })
    cy.customMount(<DatasetAlerts alerts={dataset.alerts} />)
    const expectedMessageKey = DatasetAlertMessageKey.UNPUBLISHED_DATASET

    cy.findAllByRole('alert').should('have.length', 1)
    cy.findByRole('alert').then(($alert) => {
      const itemText = datasetText.alerts[expectedMessageKey]
      cy.wrap($alert).findByText(itemText.heading).should('exist')
      expect($alert.text()).to.include(itemText.alertText)
    })
  })
})

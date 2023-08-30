import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'
import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'

type Dataset = {
  datasetVersion: { metadataBlocks: { citation: { fields: { value: string }[] } } }
}

describe('Dataset', () => {
  before(() => {
    TestsUtils.setup()
  })
  beforeEach(() => {
    TestsUtils.login()
  })

  describe('Visit the Dataset Page', () => {
    it('successfully loads a dataset in draft mode', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')

            cy.findByText('Metadata').should('exist')
            cy.findByText('Files').should('exist')
          })
        })
    })

    it('successfully loads a dataset when passing the id and version', () => {
      cy.wrap(DatasetHelper.createAndPublish())
        .its('persistentId')
        .then((persistentId) => {
          cy.wait(1500)
          cy.visit(`/spa/datasets?persistentId=${persistentId}&version=1.0`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
            cy.findByText(DatasetLabelValue.UNPUBLISHED).should('not.exist')
            cy.findByText('Version 1.0').should('exist')
          })
        })
    })

    it('loads the latest version of the dataset when passing a wrong version', () => {
      cy.wrap(DatasetHelper.createAndPublish())
        .its('persistentId')
        .then((persistentId) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}&version=2.0`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')

            cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
            cy.findByText('Version 1.0').should('exist')
          })
        })
    })

    it('loads page not found when passing a wrong persistentId', () => {
      cy.visit('/spa/datasets?persistentId=doi:10.5072/FK2/WRONG')
      cy.findByText('Page Not Found').should('exist')
    })

    it('successfully loads a dataset using a privateUrlToken', () => {
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.createPrivateUrl(dataset.id)))
        .its('token')
        .then((token) => {
          cy.visit(`/spa/datasets?privateUrlToken=${token}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
          })
        })
    })

    it('successfully loads a dataset using a privateUrlToken with anonymized fields', () => {
      cy.wrap(
        DatasetHelper.create().then((dataset) =>
          DatasetHelper.createPrivateUrlAnonymized(dataset.id)
        )
      )
        .its('token')
        .then((token) => {
          cy.visit(`/spa/datasets?privateUrlToken=${token}`)

          cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
            cy.findByRole('heading', {
              name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
            }).should('exist')
            cy.findByText(DatasetLabelValue.DRAFT).should('exist')
            cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')

            cy.findAllByText('withheld').should('exist')
          })
        })
    })
  })
})

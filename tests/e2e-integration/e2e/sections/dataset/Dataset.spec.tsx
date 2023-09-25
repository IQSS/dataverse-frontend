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

  describe('Visit the Dataset Page as a logged in user', () => {
    it.only('successfully loads a dataset in draft mode', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
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

    it('loads page not found when the user is not authenticated and tries to access a draft', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wrap(TestsUtils.logout())
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Page Not Found').should('exist')
        })
    })

    it('successfully loads a dataset when passing the id and version', () => {
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.publish(dataset.persistentId)))
        .its('persistentId')
        .then((persistentId: string) => {
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
      cy.wrap(DatasetHelper.create().then((dataset) => DatasetHelper.publish(dataset.persistentId)))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published
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
        .then((token: string) => {
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
        .then((token: string) => {
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

    it.skip('successfully loads a dataset deaccessioned', () => {
      // TODO - Add test when deaccessioned endpoint works
    })
  })

  describe('Visualizing the Files Tab', () => {
    it('successfully loads the files tab', () => {
      cy.wrap(DatasetHelper.create())
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('There are no files in this dataset.').should('exist')
        })
    })

    it('successfully loads the files tab with files', () => {
      cy.wrap(DatasetHelper.createWithFiles(3))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          // cy.findByText('1 to 3 of 3 Files').should('exist') // TODO - Connect files count implementation
          cy.findByText('blob').should('exist')
          cy.findByText('blob-1').should('exist')
          cy.findByText('blob-2').should('exist')
        })
    })

    it.skip('navigates to the next page of files', () => {
      // TODO - Connect files count implementation to the pagination
      cy.wrap(DatasetHelper.createWithFiles(20), { timeout: 10000 })
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('1 to 10 of 30 Files').should('exist')
          cy.findByText('blob').should('exist')
          cy.findByText('blob-9').should('exist')

          cy.findByText('Next').click()

          cy.findByText('11 to 20 of 30 Files').should('exist')
          cy.findByText('blob-10').should('exist')
          cy.findByText('blob-19').should('exist')
        })
    })

    it('successfully loads the action buttons when the user is logged in as owner', () => {
      cy.wrap(DatasetHelper.createWithFiles(3))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Upload Files').should('exist')
          cy.findByText('Edit Files').should('exist')
          cy.findAllByRole('button', { name: 'Access File' }).should('exist')
          cy.findAllByRole('button', { name: 'File Options' }).should('exist')
        })
    })

    it('does not load the action buttons when the user is not logged in as owner', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(3).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published
          cy.wrap(TestsUtils.logout())

          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Upload Files').should('not.exist')
          cy.findByText('Edit Files').should('not.exist')
          cy.findAllByRole('button', { name: 'Access File' }).should('exist')
          cy.findAllByRole('button', { name: 'File Options' }).should('not.exist')
        })
    })

    it('loads the restricted files when the user is logged in as owner', () => {
      cy.wrap(DatasetHelper.createWithFilesRestricted(1))
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Restricted File Icon').should('not.exist')
          cy.findByText('Restricted with access Icon').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Restricted with Access Granted').should('exist')

          cy.findByRole('button', { name: 'File Options' }).should('exist').click()
          cy.findByText('Unrestrict').should('exist')
        })
    })

    it('loads the restricted files when the user is not logged in as owner', () => {
      cy.wrap(
        DatasetHelper.createWithFilesRestricted(1).then((dataset) =>
          DatasetHelper.publish(dataset.persistentId)
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.wait(1500) // Wait for the dataset to be published

          cy.wrap(TestsUtils.logout())

          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText('Restricted with access Icon').should('not.exist')
          cy.findByText('Restricted File Icon').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Restricted').should('exist')
        })
    })

    it('loads the embargoed files', () => {
      cy.wrap(
        DatasetHelper.createWithFiles(1).then((dataset) =>
          DatasetHelper.embargoFiles(
            dataset.persistentId,
            [dataset.files ? dataset.files[0].id : 0],
            '2100-10-20'
          )
        )
      )
        .its('persistentId')
        .then((persistentId: string) => {
          cy.visit(`/spa/datasets?persistentId=${persistentId}`)

          cy.findByText('Files').should('exist')

          cy.findByText(/Deposited/).should('exist')
          cy.findByText('Draft: will be embargoed until Oct 20, 2100').should('exist')

          cy.findByRole('button', { name: 'Access File' }).should('exist').click()
          cy.findByText('Embargoed').should('exist')
        })
    })
  })
})

import { DatasetLabelValue } from '../../../../src/dataset/domain/models/Dataset'

let persistentId = ''
let apiToken = ''
type Dataset = {
  datasetVersion: { metadataBlocks: { citation: { fields: { value: string }[] } } }
}

describe('Dataset', () => {
  function createDataset() {
    cy.loginAsAdmin('/dataverseuser.xhtml?selectTab=dataRelatedToMe')
    cy.findByRole('link', { name: 'API Token' }).click()
    return cy
      .get('#apiToken code')
      .invoke('text')
      .then((apiTokenResult) => {
        apiToken = apiTokenResult
        return cy
          .exec(
            `curl -H X-Dataverse-key:${apiToken} -X POST "http://localhost:8000/api/dataverses/root/datasets" --upload-file tests/e2e/fixtures/dataset-finch1.json -H 'Content-type:application/json'`
          )
          .then(
            (result: { stdout: string }) =>
              JSON.parse(result.stdout) as { data: { persistentId: string } }
          )
          .then((stdout: { data: { persistentId: string } }) => stdout.data)
      })
  }

  function publishDataset() {
    cy.loginAsAdmin()
    return cy.exec(
      `curl -H X-Dataverse-key:${apiToken} -X POST "http://localhost:8000/api/datasets/:persistentId/actions/:publish?persistentId=${persistentId}&type=major"`
    )
  }

  before(() => {
    createDataset().then((data: { persistentId: string }) => {
      persistentId = data.persistentId
    })
  })

  it('successfully loads a dataset in draft mode', () => {
    cy.visit('/spa/datasets?persistentId=' + persistentId)

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

  it('successfully loads a dataset when passing the id and version', () => {
    publishDataset().then(() => {
      cy.visit('/spa/datasets?persistentId=' + persistentId + '&version=1.0')

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
    cy.visit('/spa/datasets?persistentId=' + persistentId + '&version=2.0')

    cy.fixture('dataset-finch1.json').then((dataset: Dataset) => {
      cy.findByRole('heading', {
        name: dataset.datasetVersion.metadataBlocks.citation.fields[0].value
      }).should('exist')

      cy.findByText(DatasetLabelValue.DRAFT).should('not.exist')
      cy.findByText('Version 1.0').should('exist')
    })
  })

  it('loads page not found when passing a wrong persistentId', () => {
    cy.visit('/spa/datasets?persistentId=doi:10.5072/FK2/WRONG')
    cy.findByText('Page Not Found').should('exist')
  })
})

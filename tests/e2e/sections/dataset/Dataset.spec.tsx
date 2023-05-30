import { DatasetLabelValue } from '../../../../src/dataset/domain/models/Dataset'

let PERSISTENT_ID = ''
let API_TOKEN = ''
type Dataset = {
  datasetVersion: { metadataBlocks: { citation: { fields: { value: string }[] } } }
}
type createDatasetResponse = { persistentId: string; id: string }

describe('Dataset', () => {
  function getApiToken() {
    cy.loginAsAdmin('/dataverseuser.xhtml?selectTab=dataRelatedToMe')
    return cy
      .findByRole('link', { name: 'API Token' })
      .click()
      .get('#apiToken code')
      .invoke('text')
      .then((apiToken) => {
        API_TOKEN = apiToken
        return apiToken
      })
  }

  function createDataset() {
    return getApiToken()
      .then((apiToken) =>
        cy.exec(
          `curl -H X-Dataverse-key:${apiToken} -X POST "http://localhost:8000/api/dataverses/root/datasets" --upload-file tests/e2e/fixtures/dataset-finch1.json -H 'Content-type:application/json'`
        )
      )
      .then(
        (result: { stdout: string }) => JSON.parse(result.stdout) as { data: createDatasetResponse }
      )
      .then((stdout: { data: createDatasetResponse }) => stdout.data)
  }

  function publishDataset() {
    cy.loginAsAdmin()
    return cy
      .exec(
        `curl -H X-Dataverse-key:${API_TOKEN} -X POST "http://localhost:8000/api/datasets/:persistentId/actions/:publish?persistentId=${PERSISTENT_ID}&type=major"`
      )
      .wait(1000)
  }

  function createPrivateUrl(anonymized = false) {
    const anonymizedParameter = anonymized ? '?anonymizedAccess=true' : ''

    return createDataset()
      .then((data: createDatasetResponse) =>
        cy.exec(
          `curl -H X-Dataverse-key:${API_TOKEN} -X POST "http://localhost:8000/api/datasets/${data.id}/privateUrl${anonymizedParameter}"`
        )
      )
      .then(
        (result: { stdout: string }) => JSON.parse(result.stdout) as { data: { token: string } }
      )
      .then((stdout: { data: { token: string } }) => stdout.data.token)
  }

  function allowAnonymizedAccess() {
    cy.exec(
      `curl -X PUT -d 'author, datasetContact, contributor, depositor, grantNumber, publication' http://localhost:8000/api/admin/settings/:AnonymizedFieldTypeNames`
    )
  }

  before(() => {
    allowAnonymizedAccess()
    createDataset().then((data: createDatasetResponse) => {
      PERSISTENT_ID = data.persistentId
    })
  })

  it('successfully loads a dataset in draft mode', () => {
    cy.visit(`/spa/datasets?persistentId=${PERSISTENT_ID}`)

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
      cy.visit(`/spa/datasets?persistentId=${PERSISTENT_ID}&version=1.0`)

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
    cy.visit(`/spa/datasets?persistentId=${PERSISTENT_ID}&version=2.0`)

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

  it('successfully loads a dataset using a privateUrlToken', () => {
    createPrivateUrl().then((privateUrlToken) => {
      cy.visit(`/spa/datasets?privateUrlToken=${privateUrlToken}`)

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
    createPrivateUrl(true).then((privateUrlToken) => {
      cy.visit(`/spa/datasets?privateUrlToken=${privateUrlToken}`)

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

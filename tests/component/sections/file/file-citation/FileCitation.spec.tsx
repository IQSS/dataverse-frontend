import { ApiConfig } from '@iqss/dataverse-client-javascript'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { FileCitation } from '../../../../../src/sections/file/file-citation/FileCitation'
import { FileCitationMother } from '../../../files/domain/models/FileMother'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const fileRepository: FileRepository = {} as FileRepository

describe('FileCitation', () => {
  for (const version of ['1.0', ':draft']) {
    for (const { option, format } of [
      { option: 'Download EndNote XML', format: 'EndNote' },
      { option: 'Download RIS', format: 'RIS' },
      { option: 'Download BibTeX', format: 'BibTeX' }
    ]) {
      it(`downloads ${format} for the displayed ${version} dataset version`, () => {
        ApiConfig.init('http://localhost:8000/api/v1', DataverseApiAuthMechanism.API_KEY)
        cy.window().then((win) => {
          cy.stub(win.URL, 'createObjectURL').returns('mock-url')
          cy.stub(win.URL, 'revokeObjectURL')
        })
        cy.intercept('GET', `**/access/datafile/1/citation/${format}*`, {
          statusCode: 200,
          body: 'Version-specific citation'
        }).as('citation')
        const datasetVersion =
          version === ':draft'
            ? DatasetVersionMother.createDraft()
            : DatasetVersionMother.createReleased()

        cy.customMount(
          <FileCitation
            citation={FileCitationMother.create('File Title')}
            datasetVersion={datasetVersion}
            fileRepository={new FileJSDataverseRepository()}
            fileId={1}
          />
        )
        cy.findByRole('button', { name: 'Cite Data File' }).click()
        cy.findByText(option).click()
        cy.wait('@citation').its('request.query.version').should('equal', version)
        cy.findByText('Citation downloaded successfully').should('exist')
      })
    }
  }

  it('renders the FileCitation', () => {
    const citation = FileCitationMother.create('File Title')
    const datasetVersion = DatasetVersionMother.createReleased()

    cy.customMount(
      <FileCitation
        citation={citation}
        datasetVersion={datasetVersion}
        fileRepository={fileRepository}
        fileId={1}
      />
    )
    cy.findByText(/File Title/).should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title",/).should('exist')
    cy.findByText(/RELEASED/).should('not.exist')
    cy.findByText(/V1/).should('exist')
    cy.findByRole('button', { name: 'Cite Data File' }).should('exist')
  })

  it('renders the FileCitation when the dataset is deaccessioned', () => {
    const citation = FileCitationMother.create('File Title')
    const datasetVersion = DatasetVersionMother.createDeaccessioned()

    cy.customMount(
      <FileCitation
        citation={citation}
        datasetVersion={datasetVersion}
        fileRepository={fileRepository}
        fileId={1}
      />
    )
    cy.findByText(/File Title/).should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title",/).should('exist')
    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DEACCESSIONED VERSION has been added to the citation for this version since it is no longer available./
    ).should('exist')
  })
})

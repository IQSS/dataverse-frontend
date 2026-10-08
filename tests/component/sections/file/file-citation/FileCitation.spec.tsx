import { FileCitation } from '../../../../../src/sections/file/file-citation/FileCitation'
import { FileCitationMother } from '../../../files/domain/models/FileMother'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

const fileRepository: FileRepository = {} as FileRepository

describe('FileCitation', () => {
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

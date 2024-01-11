import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { FileMother } from '../../files/domain/models/FileMother'
import { File } from '../../../../src/sections/file/File'

const fileRepository: FileRepository = {} as FileRepository

describe('File', () => {
  it('renders the File page title and details', () => {
    const testFile = FileMother.createRealistic()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(<File repository={fileRepository} id={19} />)

    cy.wrap(fileRepository.getById).should('be.calledWith', 19)

    cy.findAllByText(testFile.name).should('exist')
    cy.findByText(`This file is part of "${testFile.datasetVersion.title}".`).should('exist')
    cy.findByText('Version 1.0').should('exist')
    cy.findByRole('tab', { name: 'Metadata' }).should('exist')
    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders skeleton while loading', () => {
    const testFile = FileMother.createRealistic()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(<File repository={fileRepository} id={19} />)

    cy.findByTestId('file-skeleton').should('exist')
    cy.wrap(fileRepository.getById).should('be.calledWith', 19)
    cy.findByText(testFile.name).should('not.exist')
  })

  it('renders page not found when file is not found', () => {
    fileRepository.getById = cy.stub().resolves(undefined)

    cy.customMount(<File repository={fileRepository} id={19} />)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the restricted icon if the file is restricted', () => {
    const testFile = FileMother.createRestricted()
    fileRepository.getById = cy.stub().resolves(testFile)

    cy.customMount(<File repository={fileRepository} id={19} />)

    cy.findByText('Restricted File Icon').should('exist')
  })
})

import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { DatasetTerms } from '@/sections/dataset/dataset-terms/DatasetTerms'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileAccessOption } from '@/files/domain/models/FileCriteria'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { LicenseMother } from '../../../dataset/domain/models/LicenseMother'
import { TermsOfUseMother } from '../../../dataset/domain/models/TermsOfUseMother'

const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = DatasetMother.create().version
const fileRepository: FileRepository = {} as FileRepository
const testFilesCountInfo = FilesCountInfoMother.create({
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 10 }
  ]
})
const noRestrictedFilesCountInfo = FilesCountInfoMother.create({
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 0 }
  ]
})

const license = LicenseMother.create()
const termsOfUse = TermsOfUseMother.create()
const emptyTermsOfUse = TermsOfUseMother.createEmpty()

describe('DatasetTerms', () => {
  beforeEach(() => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
  })

  it('renders the license and terms of use sections', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Dataset Terms').should('exist')
    cy.findByText('Restricted Files + Terms of Access').should('exist')
  })

  it('renders the correct number of restricted files', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Restricted Files').should('exist')
    cy.findByText('There are 10 restricted files in this dataset.').should('exist')
  })

  it('renders the terms of access', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Terms of Access for Restricted Files').should('exist')
    cy.findByText(termsOfUse.termsOfAccess as string).should('exist')
  })

  it('renders the request access information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Request Access').should('exist')
    cy.findByText(
      termsOfUse.fileAccessRequest
        ? 'Users may request access to files.'
        : 'Users may not request access to files.'
    ).should('exist')
  })

  it('renders the data access place', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Data Access Place').should('exist')
    cy.findByText(termsOfUse.dataAccessPlace as string).should('exist')
  })

  it('renders the original archive information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Original Archive').should('exist')
    cy.findByText(termsOfUse.originalArchive as string).should('exist')
  })

  it('renders the availability status', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Availability Status').should('exist')
    cy.findByText(termsOfUse.availabilityStatus as string).should('exist')
  })

  it('renders the contact for access information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Contact for Access').should('exist')
    cy.findByText(termsOfUse.contactForAccess as string).should('exist')
  })

  it('renders the size of collection information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Size of Collection').should('exist')
    cy.findByText(termsOfUse.sizeOfCollection as string).should('exist')
  })

  it('renders the study completion information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Study Completion').should('exist')
    cy.findByText(termsOfUse.studyCompletion as string).should('exist')
  })
  it('does not render the terms of use AccordionItem if terms of use fields are empty', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyTermsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Restricted Files + Terms of Access').should('not.exist')
  })
  it('does not render Request Access field if there are no restricted files', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(noRestrictedFilesCountInfo)
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Request Access').should('not.exist')
    cy.findByText('Terms of Access for Restricted Files').should('not.exist')
  })
})

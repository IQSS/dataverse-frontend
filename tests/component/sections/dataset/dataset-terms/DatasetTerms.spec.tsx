import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { DatasetTerms } from '@/sections/dataset/dataset-terms/DatasetTerms'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileAccessOption } from '@/files/domain/models/FileCriteria'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { LicenseMother } from '../../../dataset/domain/models/LicenseMother'
import {
  TermsOfUseMother,
  TermsOfAccessMother
} from '../../../dataset/domain/models/TermsOfUseMother'

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
const singleRestrictedFilesCountInfo = FilesCountInfoMother.create({
  perAccess: [
    { access: FileAccessOption.PUBLIC, count: 222 },
    { access: FileAccessOption.RESTRICTED, count: 1 }
  ]
})

const license = LicenseMother.create()
const termsOfUse = TermsOfUseMother.create()
const emptyCustomTerms = TermsOfUseMother.withoutCustomTerms()

const emptyTermsOfAccess = TermsOfUseMother.create({
  termsOfAccess: TermsOfAccessMother.createEmpty()
})
const accessAllowedTermsOfUse = TermsOfUseMother.create({
  termsOfAccess: TermsOfAccessMother.create({ fileAccessRequest: true })
})
const accessNotAllowedTermsOfUse = TermsOfUseMother.create({
  termsOfAccess: TermsOfAccessMother.create({ fileAccessRequest: false })
})
const termsOfUseWithUndefinedValue = TermsOfUseMother.create({
  termsOfAccess: TermsOfAccessMother.create({ dataAccessPlace: undefined })
})

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

  it('check that the terms of use sections are rendered even without edit permissions', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
        canUpdateDataset={false}
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
  it('does not render a row if the value is undefined', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={termsOfUseWithUndefinedValue}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Restricted Files + Terms of Access').should('exist')
    cy.findByText('Data Access Place').should('not.exist')
  })
  it('renders the one restricted file message', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(singleRestrictedFilesCountInfo)
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
    cy.findByText('There is 1 restricted file in this dataset.').should('exist')
  })
  it('renders the custom terms', () => {
    cy.customMount(
      <DatasetTerms
        license={undefined}
        termsOfUse={termsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )
    console.log('termsOfUse', termsOfUse)
    cy.findByText('Terms of Access for Restricted Files').should('exist')
    cy.findByText(termsOfUse.termsOfAccess.termsOfAccessForRestrictedFiles as string).should(
      'exist'
    )
  })

  it('renders the request access allowed message', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={accessAllowedTermsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Request Access').should('exist')
    cy.findByText('Users may request access to files.').should('exist')
  })
  it('renders the request access not allowed message', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={accessNotAllowedTermsOfUse}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Request Access').should('exist')
    cy.findByText('Users may not request access to files.').should('exist')
  })

  it('renders the data access place', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )
    console.log(emptyCustomTerms)
    cy.findByText('Data Access Place').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.dataAccessPlace as string).should('exist')
  })

  it('renders the original archive information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Original Archive').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.originalArchive as string).should('exist')
  })

  it('renders the availability status', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Availability Status').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.availabilityStatus as string).should('exist')
  })

  it('renders the contact for access information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Contact for Access').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.contactForAccess as string).should('exist')
  })

  it('renders the size of collection information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Size of Collection').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.sizeOfCollection as string).should('exist')
  })

  it('renders the study completion information', () => {
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Study Completion').should('exist')
    cy.findByText(emptyCustomTerms.termsOfAccess.studyCompletion as string).should('exist')
  })
  it('does not render the terms of use AccordionItem if terms of use fields are empty and no restricted files', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(noRestrictedFilesCountInfo)
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyTermsOfAccess}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Restricted Files + Terms of Access').should('not.exist')
  })
  it('renders the terms of use AccordionItem if terms of use fields are empty and at least one restricted file', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(singleRestrictedFilesCountInfo)
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyTermsOfAccess}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Restricted Files + Terms of Access').should('exist')
  })
  it('does not render Request Access field if there are no restricted files', () => {
    fileRepository.getFilesCountInfoByDatasetPersistentId = cy
      .stub()
      .resolves(noRestrictedFilesCountInfo)
    cy.customMount(
      <DatasetTerms
        license={license}
        termsOfUse={emptyCustomTerms}
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('Request Access').should('not.exist')
    cy.findByText('Terms of Access for Restricted Files').should('not.exist')
  })
})

import { IngestInfoMessage } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/IngestInfoMessage'
import { FileIngestMother } from '../../../../../../../files/domain/models/FilePreviewMother'
import { ReactNode } from 'react'
import { Dataset as DatasetModel } from '../../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../../dataset/domain/models/DatasetMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const datasetWithUpdatePermissions = DatasetMother.create({
  permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
})
describe('IngestInfoMessage', () => {
  const withDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        {component}
      </DatasetProvider>
    )
  }

  it('renders the ingest in progress message', () => {
    cy.customMount(<IngestInfoMessage ingest={FileIngestMother.createInProgress()} />)

    cy.findByText('Ingest in progress...').should('exist')
    cy.findByText('File available in original format only').should('not.exist')
  })

  it('renders the ingest problem when there is an error and the user has update dataset permissions with no report message ', () => {
    cy.customMount(
      withDataset(
        <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
          <IngestInfoMessage ingest={FileIngestMother.createIngestProblem()} />
        </div>,
        datasetWithUpdatePermissions
      )
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('exist')

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')

    cy.findByRole('link', { name: 'Tabular ingest' }).should('exist')
    cy.findByText(/was unsuccessful. Ingest failed. No further information is available./).should(
      'exist'
    )
  })

  it('renders the ingest problem when there is an error and the user has update dataset permissions with a report message', () => {
    cy.customMount(
      withDataset(
        <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
          <IngestInfoMessage ingest={FileIngestMother.createIngestProblem('Some message.')} />
        </div>,
        datasetWithUpdatePermissions
      )
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('exist')

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')

    cy.findByRole('link', { name: 'Tabular ingest' }).should('exist')
    cy.findByText(/was unsuccessful. Some message./).should('exist')
  })

  it('does not render the ingest problem when there is an error and the user does not have update dataset permissions', () => {
    const datasetWithoutUpdatePermissions = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()
    })
    cy.customMount(
      withDataset(
        <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
          <IngestInfoMessage ingest={FileIngestMother.createIngestProblem()} />
        </div>,
        datasetWithoutUpdatePermissions
      )
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('not.exist')
  })

  it('does not render any message when there is no ingest status', () => {
    cy.customMount(
      withDataset(
        <div style={{ height: 300, alignItems: 'center', display: 'flex' }}>
          <IngestInfoMessage ingest={FileIngestMother.createIngestNone()} />
        </div>,
        datasetWithUpdatePermissions
      )
    )

    cy.findByText('Ingest in progress...').should('not.exist')
    cy.findByText('File available in original format only').should('not.exist')
  })
})

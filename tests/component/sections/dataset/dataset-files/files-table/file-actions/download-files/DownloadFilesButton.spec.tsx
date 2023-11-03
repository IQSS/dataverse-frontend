import { ReactNode } from 'react'
import { Dataset as DatasetModel } from '../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../../../dataset/domain/models/DatasetMother'
import { DownloadFilesButton } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/download-files/DownloadFilesButton'
import { FileMother } from '../../../../../../files/domain/models/FileMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
describe('DownloadFilesButton', () => {
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

  it('renders the Download Files button if there is more than 1 file in the dataset and the user has download files permission', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).should('exist')
  })

  it('does not render the Download Files button if there is only 1 file in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(1)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).should('not.exist')
  })

  it('does not render the Download Files button if the user does not have download files permission', () => {
    const datasetWithoutDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadNotAllowed()
    })
    const files = FileMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithoutDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).should('not.exist')
  })

  it('renders the Download Files button as a dropdown if there are tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(2, {
      tabularData: {
        variablesCount: 2,
        observationsCount: 3,
        unf: 'some-unf'
      }
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('does not render the Download Files button as a dropdown if there are no tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(2, { tabularData: undefined })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).click()
    cy.findByRole('button', { name: 'Original Format' }).should('not.exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('not.exist')
  })

  it('shows the No Selected Files modal if no files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(2, { tabularData: undefined })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).click()
    cy.findByText('Select File(s)').should('exist')
  })

  it('does not show the No Selected Files modal if files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FileMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton
          files={files}
          fileSelection={{ 'some-file-id': FileMother.create() }}
        />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.findByRole('button', { name: 'Download' }).click()
    cy.findByText('Select File(s)').should('not.exist')
  })
})

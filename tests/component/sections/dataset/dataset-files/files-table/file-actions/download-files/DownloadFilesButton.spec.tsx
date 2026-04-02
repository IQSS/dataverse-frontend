import { ReactNode, Suspense } from 'react'
import {
  getGuestbook,
  submitGuestbookForDatasetDownload,
  submitGuestbookForDatafilesDownload
} from '@iqss/dataverse-client-javascript'
import { useTranslation } from 'react-i18next'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { Dataset as DatasetModel } from '../../../../../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../../../dataset/domain/models/DatasetMother'
import { DownloadFilesButton } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/download-files/DownloadFilesButton'
import { FileMetadataMother } from '../../../../../../files/domain/models/FileMetadataMother'
import { MultipleFileDownloadProvider } from '../../../../../../../../src/sections/file/multiple-file-download/MultipleFileDownloadProvider'
import { FileRepository } from '../../../../../../../../src/files/domain/repositories/FileRepository'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const fileRepository = {} as FileRepository
describe('DownloadFilesButton', () => {
  const TranslationPreloader = ({ children }: { children: ReactNode }) => {
    useTranslation('files')
    useTranslation('dataset')
    useTranslation('guestbooks')

    return <>{children}</>
  }

  const withDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        <Suspense fallback="loading">
          <TranslationPreloader>{component}</TranslationPreloader>
        </Suspense>
      </DatasetProvider>
    )
  }

  const withAccessRepository = (
    component: ReactNode,
    repositoryOverrides: Partial<AccessRepository> = {}
  ) => {
    const accessRepository: AccessRepository = {
      submitGuestbookForDatasetDownload: cy.stub().resolves('signed-url-dataset'),
      submitGuestbookForDatafileDownload: cy.stub().resolves('signed-url-datafile'),
      submitGuestbookForDatafilesDownload: cy.stub().resolves('signed-url-datafiles'),
      ...repositoryOverrides
    }

    return (
      <AccessRepositoryProvider repository={accessRepository}>{component}</AccessRepositoryProvider>
    )
  }

  beforeEach(() => {
    fileRepository.getMultipleFileDownloadUrl = cy
      .stub()
      .returns('https://multiple-file-download-url')
  })

  it('renders the Download Files button if there is more than 1 file in the dataset and the user has download files permission', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FilePreviewMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('exist')
  })

  it('does not render the Download Files button if there is only 1 file in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed()
    })
    const files = FilePreviewMother.createMany(1)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })

  it('does not render the Download Files button if the user does not have download files permission', () => {
    const datasetWithoutDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadNotAllowed()
    })
    const files = FilePreviewMother.createMany(2)
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithoutDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })

  it('renders the Download Files button as a dropdown if there are tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('does not render the Download Files button as a dropdown if there are no tabular files in the dataset', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('not.exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('not.exist')
  })

  it('shows the No Selected Files modal if no files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('dialog').should('exist')
    cy.findByText('Select File(s)').should('exist')
    cy.findAllByRole('button', { name: 'Close' }).first().click()
  })

  it('shows the No Selected Files modal if no tabular files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()

    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist').click()

    cy.findByRole('dialog').should('exist')
    cy.findByText('Select File(s)').should('exist')
    cy.findAllByRole('button', { name: 'Close' }).first().click()
  })

  it('renders the download url for the selected files when some files are selected and there are no tabular files', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    const fileSelection = {
      'some-file-id': files[0],
      'some-other-file-id': files[1]
    }
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files').should('exist')
  })

  it('renders the download url for the selected files when some files are selected and there are tabular files', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0],
      'some-other-file-id': files[1]
    }
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('renders the dataset download url when all the files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true,
      downloadUrls: {
        original: 'https://dataset-download-url-original',
        archival: 'https://dataset-download-url-archival'
      }
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': undefined,
      'some-other-file-id': undefined
    }
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('requests a signed dataset download url when all files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true,
      downloadUrls: {
        original: 'https://dataset-download-url-original',
        archival: 'https://dataset-download-url-archival'
      }
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': undefined,
      'some-other-file-id': undefined
    }
    const submitDatasetDownload = cy.stub().resolves('https://signed-dataset-download-url')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.mountAuthenticated(
      withAccessRepository(
        withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        ),
        {
          submitGuestbookForDatasetDownload: submitDatasetDownload
        }
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).click()

    cy.wrap(submitDatasetDownload).should(
      'have.been.calledOnceWith',
      datasetWithDownloadFilesPermission.id,
      {
        guestbookResponse: {}
      },
      'archival'
    )
    cy.get('@anchorClick').should('have.been.calledOnce')
  })

  it('requests a signed multiple-file download url when some files are selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0],
      'some-other-file-id': files[1]
    }
    const submitDatafilesDownload = cy.stub().resolves('https://signed-multiple-file-download-url')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.mountAuthenticated(
      withAccessRepository(
        withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        ),
        {
          submitGuestbookForDatafilesDownload: submitDatafilesDownload
        }
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).click()

    cy.wrap(submitDatafilesDownload).should(
      'have.been.calledOnceWith',
      [files[0].id, files[1].id],
      { guestbookResponse: {} },
      'archival'
    )
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByText('Your download has started.').should('exist')
  })

  it('renders the dataset download url with the single file download url when one file is selected', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: true
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }
    fileRepository.getFileDownloadUrl = cy.stub().returns('https://single-file-download-url')
    cy.mountAuthenticated(
      <MultipleFileDownloadProvider repository={fileRepository}>
        {withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithDownloadFilesPermission
        )}
      </MultipleFileDownloadProvider>
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).should('exist')
    cy.findByRole('button', { name: 'Archival Format (.tab)' }).should('exist')
  })

  it('opens guestbook modal when guestbook exists and files are selected for non-tabular download', () => {
    const datasetWithGuestbook = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowedButNotUpdatePermissions(),
      hasOneTabularFileAtLeast: false,
      guestbookId: 10
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }

    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithGuestbook
      )
    )

    cy.get('#download-files').parents('a').should('not.exist')
    cy.get('#download-files').click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })

  it('opens guestbook modal when guestbook exists and tabular option is clicked', () => {
    const datasetWithGuestbook = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowedButNotUpdatePermissions(),
      hasOneTabularFileAtLeast: true,
      guestbookId: 10
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }

    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithGuestbook
      )
    )

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })

  it('does not fetch the guestbook until the modal is opened', () => {
    const datasetWithGuestbook = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowedButNotUpdatePermissions(),
      hasOneTabularFileAtLeast: true,
      guestbookId: 10
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }
    const getGuestbookExecute = cy.stub(getGuestbook, 'execute').resolves({
      id: 10,
      name: 'Guestbook Test',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    })

    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithGuestbook
      )
    )

    cy.wrap(getGuestbookExecute).should('not.have.been.called')

    cy.get('#download-files').click()
    cy.findByRole('button', { name: 'Original Format' }).click()

    cy.wrap(getGuestbookExecute).should('have.been.calledOnceWith', 10)
  })

  it('submits guestbook for the dataset when all files are selected and guestbook exists', () => {
    const files = [
      FilePreviewMother.create({ id: 10, metadata: FileMetadataMother.createTabular() }),
      FilePreviewMother.create({ id: 11, metadata: FileMetadataMother.createTabular() }),
      FilePreviewMother.create({ id: 12, metadata: FileMetadataMother.createTabular() })
    ]
    const datasetWithGuestbook = DatasetMother.create({
      id: 999,
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowedButNotUpdatePermissions(),
      hasOneTabularFileAtLeast: true,
      guestbookId: 10
    })
    const fileSelection = {
      'file-a': undefined,
      'file-b': undefined,
      'file-c': undefined
    }

    cy.stub(getGuestbook, 'execute').resolves({
      id: 10,
      name: 'Guestbook Test',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    })
    const submitDatasetStub = cy
      .stub(submitGuestbookForDatasetDownload, 'execute')
      .resolves('/api/v1/access/dataset/999?token=test')
    const submitFilesStub = cy
      .stub(submitGuestbookForDatafilesDownload, 'execute')
      .resolves('/api/v1/access/datafiles/10,11,12?token=test')
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={fileSelection} />,
        datasetWithGuestbook
      )
    )

    cy.get('#download-files').click()
    cy.findByText(/Original Format/).click()
    cy.findByLabelText(/^Name/).should('be.disabled')
    cy.findByLabelText(/^Email/).should('be.disabled')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.wrap(submitDatasetStub).should('have.been.calledOnce')
    cy.wrap(submitDatasetStub).its('firstCall.args.0').should('equal', 999)
    cy.wrap(submitFilesStub).should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
  })

  it('bypasses the guestbook modal for draft datasets', () => {
    const datasetWithGuestbook = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      hasOneTabularFileAtLeast: false,
      guestbookId: 10,
      version: DatasetVersionMother.createDraft()
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }
    const getGuestbookExecute = cy.stub(getGuestbook, 'execute').resolves({
      id: 10,
      name: 'Guestbook Test',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    })

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.mountAuthenticated(
      withAccessRepository(
        withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithGuestbook
        )
      )
    )

    cy.get('#download-files').click()

    cy.wrap(getGuestbookExecute).should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
    cy.findByText('Your download has started.').should('exist')
  })

  it('bypasses the guestbook modal for users who can edit the dataset', () => {
    const datasetWithGuestbook = DatasetMother.create({
      permissions: DatasetPermissionsMother.create({
        canDownloadFiles: true,
        canUpdateDataset: true
      }),
      hasOneTabularFileAtLeast: false,
      guestbookId: 10
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createNonTabular()
    })
    const fileSelection = {
      'some-file-id': files[0]
    }
    const getGuestbookExecute = cy.stub(getGuestbook, 'execute').resolves({
      id: 10,
      name: 'Guestbook Test',
      enabled: true,
      nameRequired: true,
      emailRequired: true,
      institutionRequired: false,
      positionRequired: false,
      customQuestions: [],
      createTime: '2026-01-01T00:00:00.000Z',
      dataverseId: 1
    })

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.mountAuthenticated(
      withAccessRepository(
        withDataset(
          <DownloadFilesButton files={files} fileSelection={fileSelection} />,
          datasetWithGuestbook
        )
      )
    )

    cy.get('#download-files').click()

    cy.wrap(getGuestbookExecute).should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
    cy.findByText('Your download has started.').should('exist')
  })

  it('does not render the AccessDatasetMenu if the file store does not start with "s3"', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      fileStore: 'non-s3-file-store'
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })

  it('does not render the AccessDatasetMenu if the dataset is in draft status', () => {
    const datasetWithDownloadFilesPermission = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithFilesDownloadAllowed(),
      version: DatasetVersionMother.createDraft()
    })
    const files = FilePreviewMother.createMany(2, {
      metadata: FileMetadataMother.createTabular()
    })
    cy.mountAuthenticated(
      withDataset(
        <DownloadFilesButton files={files} fileSelection={{}} />,
        datasetWithDownloadFilesPermission
      )
    )

    cy.get('#download-files').should('not.exist')
  })
})

import { AccessDatasetMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/access-dataset-menu/AccessDatasetMenu'
import {
  DatasetDownloadUrlsMother,
  DatasetFileDownloadSizeMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { FileSizeUnit } from '../../../../../../src/files/domain/models/FileMetadata'
import { getGuestbook, submitGuestbookForDatasetDownload } from '@iqss/dataverse-client-javascript'

const downloadUrls = DatasetDownloadUrlsMother.create()

describe('AccessDatasetMenu', () => {
  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is not deaccessioned', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('renders the AccessDatasetMenu if the user has download files permissions and the dataset is deaccessioned with update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.create({
      canUpdateDataset: true,
      canDownloadFiles: true
    })
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
  })

  it('does not render the AccessDatasetMenu if the user do not have download files permissions', () => {
    const version = DatasetVersionMother.create()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadNotAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render the AccessDatasetMenu if the dataset is deaccessioned and the user does not have update dataset permissions', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.createWithUpdateDatasetNotAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render when dataset is deaccessioned and canUpdateDataset is false even if download is allowed', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    const permissions = DatasetPermissionsMother.create({
      canUpdateDataset: false,
      canDownloadFiles: true
    })
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('displays one dropdown option if there are no tabular files', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Download ZIP (2 KB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('renders empty size text in non-tabular mode when original size is missing', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createArchival({ value: 4000, unit: FileSizeUnit.BYTES })
    ]

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Download ZIP ()').should('exist')
  })

  it('displays two dropdown options if there is at least one', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES }),
      DatasetFileDownloadSizeMother.createArchival({
        value: 43483094340394,
        unit: FileSizeUnit.BYTES
      })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Original Format ZIP (2 KB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
    cy.findByText('Archival Format (.tab) ZIP (39.5 TB)')
      .should('exist')
      .should('have.attr', 'href', downloadUrls.archival)
  })

  it('renders empty size text when a download mode size is missing', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByText('Original Format ZIP (2 KB)').should('exist')
    cy.findByText('Archival Format (.tab) ZIP ()').should('exist')
  })

  it('does not render the AccessDatasetMenu if the file download sizes are zero', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 0, unit: FileSizeUnit.BYTES }),
      DatasetFileDownloadSizeMother.createArchival({
        value: 0,
        unit: FileSizeUnit.BYTES
      })
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('does not render the AccessDatasetMenu if the file store does not start with "s3"', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal(),
      DatasetFileDownloadSizeMother.createArchival()
    ]
    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="not-s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )
    cy.findByRole('button', { name: 'Access Dataset' }).should('not.exist')
  })

  it('opens DownloadWithGuestbookModal when guestbook exists and download option is clicked', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]
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
    const submitGuestbookForDatasetDownloadExecute = cy
      .stub(submitGuestbookForDatasetDownload, 'execute')
      .resolves('/api/v1/access/dataset/test-token')
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click')
    })

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
        guestbookId={10}
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByRole('button', { name: /Download ZIP/ }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByLabelText(/name/i).type('Test User')
    cy.findByLabelText(/email/i).type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()
    cy.wrap(submitGuestbookForDatasetDownloadExecute).should('have.been.calledOnce')
    cy.findByText('Your download has started.').should('exist')
  })

  it('renders download option as a button and opens guestbook modal when guestbook exists', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]

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

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
        guestbookId={10}
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByRole('button', { name: /Download ZIP/ })
      .should('exist')
      .click()
    cy.findByRole('dialog').should('exist')
  })

  it('closes DownloadWithGuestbookModal when cancel is clicked', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES })
    ]

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

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={false}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
        guestbookId={10}
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByRole('button', { name: /Download ZIP/ }).click()
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('opens guestbook modal from archival option when guestbook exists', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES }),
      DatasetFileDownloadSizeMother.createArchival({ value: 4000, unit: FileSizeUnit.BYTES })
    ]

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

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
        guestbookId={10}
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByRole('button', { name: /Archival Format \(\.tab\) ZIP/ }).click()
    cy.findByRole('dialog').should('exist')
  })

  it('keeps archival option as link when guestbook does not exist', () => {
    const version = DatasetVersionMother.createReleased()
    const permissions = DatasetPermissionsMother.createWithFilesDownloadAllowed()
    const fileDownloadSizes = [
      DatasetFileDownloadSizeMother.createOriginal({ value: 2000, unit: FileSizeUnit.BYTES }),
      DatasetFileDownloadSizeMother.createArchival({ value: 4000, unit: FileSizeUnit.BYTES })
    ]

    cy.customMount(
      <AccessDatasetMenu
        fileDownloadSizes={fileDownloadSizes}
        hasOneTabularFileAtLeast={true}
        version={version}
        permissions={permissions}
        downloadUrls={downloadUrls}
        fileStore="s3"
        persistentId="doi:10.5072/FK2/ABCDEFGH"
      />
    )

    cy.findByRole('button', { name: 'Access Dataset' }).click()
    cy.findByRole('link', { name: /Archival Format \(\.tab\) ZIP/ }).should(
      'have.attr',
      'href',
      downloadUrls.archival
    )
  })
})

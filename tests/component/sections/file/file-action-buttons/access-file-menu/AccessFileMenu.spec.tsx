import { AccessFileMenu } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/AccessFileMenu'
import { FileAccessMother } from '../../../../files/domain/models/FileAccessMother'
import { FileMetadataMother } from '../../../../files/domain/models/FileMetadataMother'
import { Suspense } from 'react'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { useTranslation } from 'react-i18next'

describe('AccessFileMenu', () => {
  const guestbook: Guestbook = {
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
  }

  const TranslationPreloader = () => {
    useTranslation('files')
    useTranslation('dataset')
    useTranslation('guestbooks')

    return null
  }

  it('renders the access file menu', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the access file menu with tooltip when asIcon is true', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon
      />
    )

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('exist')
  })

  it('does not render the access file menu with tooltip when asIcon is false', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.create()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('not.exist')
  })

  it('renders the menu headers', () => {
    cy.customMount(
      <Suspense fallback="loading">
        <AccessFileMenu
          id={1}
          access={FileAccessMother.create()}
          metadata={FileMetadataMother.create()}
          userHasDownloadPermission
          ingestInProgress={false}
          isDeaccessioned={false}
        />
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist').click()
    cy.findByRole('heading', { name: 'File Access' }).should('exist')
  })

  it('renders the access status of the file', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.createNotEmbargoed()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Public').should('exist')
  })

  it('renders the request access button', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createWithAccessRequestAllowed()}
        metadata={FileMetadataMother.createNotEmbargoed()}
        userHasDownloadPermission={false}
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Request Access' }).should('exist')
  })

  it('renders the download options header', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('renders the button as an icon when asIcon is true', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        asIcon
        isDraft={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist')
    cy.get('svg').should('exist')
  })

  it('should not render the access file menu for non-S3 files', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create({ storageIdentifier: 'local-file' })}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('not.exist')
  })

  it('should render the access file menu for draft datasets', () => {
    cy.customMount(
      <AccessFileMenu
        id={1}
        access={FileAccessMother.createPublic()}
        metadata={FileMetadataMother.create()}
        userHasDownloadPermission
        ingestInProgress={false}
        isDeaccessioned={false}
        isDraft={false}
      />
    )

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('opens the guestbook modal before starting the file download', () => {
    const guestbookRepository: GuestbookRepository = {
      getGuestbook: cy.stub().as('getGuestbook').resolves(guestbook),
      getGuestbooksByCollectionId: cy.stub().resolves([]),
      assignDatasetGuestbook: cy.stub().resolves(),
      removeDatasetGuestbook: cy.stub().resolves()
    }
    const accessRepository: AccessRepository = {
      submitGuestbookForDatasetDownload: cy.stub().resolves('signed-url-dataset'),
      submitGuestbookForDatafileDownload: cy
        .stub()
        .as('submitGuestbookForDatafileDownload')
        .resolves('signed-url-file'),
      submitGuestbookForDatafilesDownload: cy.stub().resolves('signed-url-datafiles')
    }

    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader />
        <GuestbookRepositoryProvider repository={guestbookRepository}>
          <AccessRepositoryProvider repository={accessRepository}>
            <AccessFileMenu
              id={1}
              access={FileAccessMother.createPublic()}
              metadata={FileMetadataMother.createDefault()}
              userHasDownloadPermission
              ingestInProgress={false}
              isDeaccessioned={false}
              guestbookId={10}
              datasetPersistentId="doi:10.5072/FK2/FILEPAGE"
            />
          </AccessRepositoryProvider>
        </GuestbookRepositoryProvider>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByText('Download Options').should('exist')
    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.get('@getGuestbook').should('have.been.calledOnceWith', 10)
    cy.get('@submitGuestbookForDatafileDownload').should('not.have.been.called')
    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
  })

  it('bypasses the guestbook modal for files in draft datasets', () => {
    const accessRepository: AccessRepository = {
      submitGuestbookForDatasetDownload: cy.stub().resolves('signed-url-dataset'),
      submitGuestbookForDatafileDownload: cy
        .stub()
        .as('submitGuestbookForDatafileDownload')
        .resolves('signed-url-file'),
      submitGuestbookForDatafilesDownload: cy.stub().resolves('signed-url-datafiles')
    }

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader />
        <AccessRepositoryProvider repository={accessRepository}>
          <AccessFileMenu
            id={1}
            access={FileAccessMother.createPublic()}
            metadata={FileMetadataMother.createDefault()}
            userHasDownloadPermission
            ingestInProgress={false}
            isDeaccessioned={false}
            isDraft
            guestbookId={10}
            datasetPersistentId="doi:10.5072/FK2/FILEPAGE"
          />
        </AccessRepositoryProvider>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('have.been.calledOnce')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
    cy.findByText('Your download has started.').should('exist')
  })

  it('bypasses the guestbook modal for users who can edit the dataset', () => {
    const accessRepository: AccessRepository = {
      submitGuestbookForDatasetDownload: cy.stub().resolves('signed-url-dataset'),
      submitGuestbookForDatafileDownload: cy
        .stub()
        .as('submitGuestbookForDatafileDownload')
        .resolves('signed-url-file'),
      submitGuestbookForDatafilesDownload: cy.stub().resolves('signed-url-datafiles')
    }

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      <Suspense fallback="loading">
        <TranslationPreloader />
        <AccessRepositoryProvider repository={accessRepository}>
          <AccessFileMenu
            id={1}
            access={FileAccessMother.createPublic()}
            metadata={FileMetadataMother.createDefault()}
            userHasDownloadPermission
            ingestInProgress={false}
            isDeaccessioned={false}
            isDraft={false}
            canEdit
            guestbookId={10}
            datasetPersistentId="doi:10.5072/FK2/FILEPAGE"
          />
        </AccessRepositoryProvider>
      </Suspense>
    )

    cy.findByRole('button', { name: 'Access File' }).click()
    cy.findByRole('button', { name: 'Plain Text' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('have.been.calledOnce')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
    cy.findByText('Your download has started.').should('exist')
  })
})

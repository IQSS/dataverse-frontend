import { DownloadWithGuestbookModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/DownloadWithGuestbookModal'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import {
  AccessRepository,
  GuestbookResponseDTO
} from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'

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

const guestbookWithCustomQuestions: Guestbook = {
  ...guestbook,
  customQuestions: [
    {
      question: 'Hidden question',
      required: false,
      displayOrder: 0,
      type: 'text',
      hidden: true
    },
    {
      question: 'Preferred format',
      required: false,
      displayOrder: 2,
      type: 'options',
      hidden: false,
      optionValues: [
        { value: 'CSV', displayOrder: 2 },
        { value: 'JSON', displayOrder: 1 }
      ]
    },
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 1,
      type: 'textarea',
      hidden: false
    }
  ]
}

const guestbookWithAnswerIds = {
  ...guestbook,
  email: 'email-answer-id',
  institution: 'institution-answer-id',
  position: 'position-answer-id',
  customQuestions: [
    {
      id: 501,
      question: 'Question with id',
      required: false,
      displayOrder: 1,
      type: 'text',
      hidden: false
    },
    {
      question: 'Blank optional question',
      required: false,
      displayOrder: 2,
      type: 'textarea',
      hidden: false
    }
  ]
} as Guestbook & {
  email: string
  institution: string
  position: string
}

const datasetLicense: DatasetLicense = {
  name: 'CC0 1.0',
  uri: 'https://creativecommons.org/publicdomain/zero/1.0/'
}

describe('DownloadWithGuestbookModal', () => {
  let getGuestbookImpl: (guestbookId: number) => Promise<Guestbook>
  let submitGuestbookForDatafileDownloadImpl: (
    fileId: number | string,
    guestbookResponse: GuestbookResponseDTO
  ) => Promise<string>
  let submitGuestbookForDatafilesDownloadImpl: (
    fileIds: Array<number | string>,
    guestbookResponse: GuestbookResponseDTO
  ) => Promise<string>
  let guestbookRepository: GuestbookRepository
  let accessRepository: AccessRepository

  const withRepositories = (component: React.ReactNode) => (
    <DatasetContext.Provider
      value={{
        dataset: DatasetMother.create({
          id: 123,
          persistentId: 'doi:10.5072/FK2/FILEPAGE'
        }),
        isLoading: false,
        refreshDataset: () => {}
      }}>
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <AccessRepositoryProvider repository={accessRepository}>
          {component}
        </AccessRepositoryProvider>
      </GuestbookRepositoryProvider>
    </DatasetContext.Provider>
  )

  beforeEach(() => {
    getGuestbookImpl = () => Promise.resolve(guestbook)
    submitGuestbookForDatafileDownloadImpl = () =>
      Promise.resolve('/api/v1/access/datafile/10?token=test')
    submitGuestbookForDatafilesDownloadImpl = () =>
      Promise.resolve('/api/v1/access/datafiles/10,11?token=test')

    guestbookRepository = {
      getGuestbook: cy
        .stub()
        .as('getGuestbook')
        .callsFake((guestbookId: number) => {
          return getGuestbookImpl(guestbookId)
        }),
      getGuestbooksByCollectionId: cy.stub().resolves([]),
      assignDatasetGuestbook: (_datasetId: number | string, _guestbookId: number) =>
        Promise.resolve(),
      removeDatasetGuestbook: (_datasetId: number | string) => Promise.resolve()
    }
    accessRepository = {
      submitGuestbookForDatasetDownload: cy
        .stub()
        .as('submitGuestbookForDatasetDownload')
        .resolves('/api/v1/access/dataset/:persistentId?token=test'),
      submitGuestbookForDatafileDownload: cy
        .stub()
        .as('submitGuestbookForDatafileDownload')
        .callsFake((fileId: number | string, guestbookResponse: GuestbookResponseDTO) =>
          submitGuestbookForDatafileDownloadImpl(fileId, guestbookResponse)
        ),
      submitGuestbookForDatafilesDownload: cy
        .stub()
        .as('submitGuestbookForDatafilesDownload')
        .callsFake((fileIds: Array<number | string>, guestbookResponse: GuestbookResponseDTO) =>
          submitGuestbookForDatafilesDownloadImpl(fileIds, guestbookResponse)
        )
    }
  })

  it('renders modal title and actions', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
    cy.findByRole('button', { name: 'Cancel' }).should('exist')

    cy.findByText('Dataset Terms').should('exist')
    cy.findByText('License/Data Use Agreement').should('exist')
  })

  it('renders dataset terms and license when they are provided', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
          datasetLicense={datasetLicense}
          datasetCustomTerms={undefined}
        />
      )
    )

    cy.findByText('CC0 1.0').should('exist')
  })

  it('renders custom dataset terms when custom terms are available', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
          datasetPersistentId="doi:10.5072/FK2/FILEPAGE"
          datasetLicense={undefined}
          datasetCustomTerms={{
            termsOfUse: 'File page custom terms text',
            confidentialityDeclaration: 'File page confidentiality declaration'
          }}
        />
      )
    )

    cy.findByText('File page custom terms text').should('exist')
    cy.findByText('File page confidentiality declaration').should('exist')
    cy.findByRole('link', { name: 'Custom Dataset Terms' }).should(
      'have.attr',
      'href',
      '/spa/datasets?persistentId=doi%3A10.5072%2FFK2%2FFILEPAGE&tab=terms&termsTab=guestbook'
    )
  })

  it('keeps accept disabled when no guestbook is loaded', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={undefined as unknown as number}
          fileId={10}
        />
      )
    )

    cy.findByRole('button', { name: 'Accept' }).should('be.disabled')
  })

  it('calls handleClose when clicking cancel', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={handleClose}
          guestbookId={undefined as unknown as number}
          fileId={10}
        />
      )
    )

    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('submits filled form and accepts', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal show handleClose={handleClose} guestbookId={10} fileId={10} />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('have.been.calledOnce')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
    cy.findByText('Your download has started.').should('exist')
    cy.findByText('This field is required.').should('not.exist')
  })

  it('disables name and email fields for authenticated users', () => {
    cy.mountAuthenticated(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByLabelText(/^Name/).should('be.disabled')
    cy.findByLabelText(/^Email/).should('be.disabled')
  })

  it('submits filled form and accepts for multiple files', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={handleClose}
          guestbookId={10}
          fileIds={[10, 11]}
        />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafilesDownload').should('have.been.calledOnce')
    cy.get('@submitGuestbookForDatafilesDownload')
      .its('firstCall.args.0')
      .should('deep.equal', [10, 11])
    cy.get('@submitGuestbookForDatafileDownload').should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('submits filled form and accepts for many files', () => {
    submitGuestbookForDatafilesDownloadImpl = () =>
      Promise.resolve('/api/v1/access/datafiles/10,11,12?token=test')
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={handleClose}
          guestbookId={10}
          fileIds={[10, 11, 12]}
        />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafilesDownload').should('have.been.calledOnce')
    cy.get('@submitGuestbookForDatafilesDownload')
      .its('firstCall.args.0')
      .should('deep.equal', [10, 11, 12])
    cy.get('@submitGuestbookForDatafileDownload').should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('shows required field validation after clicking accept', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findAllByText('This field is required.').should('have.length.at.least', 2)
  })

  it('does not show required field validation before clicking accept', () => {
    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByText('This field is required.').should('not.exist')
  })

  it('renders visible custom questions and submits answers with generated field ids', () => {
    getGuestbookImpl = () => Promise.resolve(guestbookWithCustomQuestions)
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal show handleClose={handleClose} guestbookId={10} fileId={10} />
      )
    )

    cy.findByText('Hidden question').should('not.exist')

    cy.findByText('How will you use this data?')
      .parents('div')
      .first()
      .find('textarea')
      .type('For a replication package')

    cy.findByText('Preferred format').parents('div').first().find('button').click()
    cy.findByText('JSON').should('exist')
    cy.findByText('CSV').click()

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafileDownload').should('have.been.calledOnce')
    cy.get('@submitGuestbookForDatafileDownload')
      .its('firstCall.args.1')
      .should('deep.equal', {
        guestbookResponse: {
          name: 'Test User',
          email: 'test.user@example.com',
          institution: undefined,
          position: undefined,
          answers: [
            { id: 'custom-question-2-0', value: 'CSV' },
            { id: 'custom-question-1-1', value: 'For a replication package' }
          ]
        }
      })
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('uses guestbook answer ids for account fields and custom question ids, while trimming empty answers', () => {
    getGuestbookImpl = () => Promise.resolve(guestbookWithAnswerIds)
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal show handleClose={handleClose} guestbookId={10} fileId={10} />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('  Test User  ')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByLabelText(/^Institution/).type('  Example University  ')
    cy.findByLabelText(/^Position/).type('  Researcher  ')
    cy.findByText('Question with id')
      .parents('div')
      .first()
      .find('input')
      .type('  Answer with id  ')
    cy.findByText('Blank optional question').parents('div').first().find('textarea').type('   ')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.get('@submitGuestbookForDatafileDownload')
      .its('firstCall.args.1')
      .should('deep.equal', {
        guestbookResponse: {
          name: 'Test User',
          email: 'test.user@example.com',
          institution: 'Example University',
          position: 'Researcher',
          answers: [{ id: 501, value: 'Answer with id' }]
        }
      })
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('normalizes an absolute signed URL to the current origin before triggering download', () => {
    submitGuestbookForDatafileDownloadImpl = () =>
      Promise.resolve('https://demo.dataverse.org/api/v1/access/datafile/10?token=test#frag')
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').callsFake(function (
        this: HTMLAnchorElement
      ) {
        ;(window as Window & { __clickedHref?: string }).__clickedHref = this.href
      })
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal show handleClose={handleClose} guestbookId={10} fileId={10} />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.window()
      .its('__clickedHref')
      .should('match', /\/api\/v1\/access\/datafile\/10\?token=test#frag$/)
  })

  it('falls back to the raw signed URL when URL normalization fails', () => {
    submitGuestbookForDatafileDownloadImpl = () => Promise.resolve('http://[invalid-url')
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').callsFake(function (
        this: HTMLAnchorElement
      ) {
        ;(window as Window & { __clickedHref?: string }).__clickedHref =
          this.getAttribute('href') ?? ''
      })
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal show handleClose={handleClose} guestbookId={10} fileId={10} />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.window().its('__clickedHref').should('eq', 'http://[invalid-url')
  })

  it('shows a dropdown box for additional questions of options type', () => {
    getGuestbookImpl = () => Promise.resolve(guestbookWithCustomQuestions)

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByText('Preferred format').parents('div').first().find('button').should('exist')
    cy.findByText('Preferred format').parents('div').first().find('button').click()
    cy.findByText('JSON').should('exist')
    cy.findByText('CSV').should('exist')
  })

  it('shows error alert when get guestbook request fails', () => {
    getGuestbookImpl = () => Promise.reject(new Error('some guestbook error'))

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByText(/Something went wrong getting the guestbook. Try again later./).should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('be.disabled')
  })

  it('shows error alert when guestbook submission fails', () => {
    submitGuestbookForDatafileDownloadImpl = () => Promise.reject(new Error('submit failed'))

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findByText('Error').should('exist')
    cy.findByText(/Something went wrong submitting guestbook responses. Try again later./i).should(
      'exist'
    )
  })

  it('shows error alert when triggering the signed URL download fails', () => {
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').throws(
        new Error('Download trigger failed')
      )
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findByText(/Download trigger failed/).should('exist')
  })

  it('shows the fallback download error when the download trigger throws a non-Error value', () => {
    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').callsFake(() => {
        throw 'unexpected download failure'
      })
    })

    cy.customMount(
      withRepositories(
        <DownloadWithGuestbookModal
          show
          handleClose={cy.stub().as('handleClose')}
          guestbookId={10}
          fileId={10}
        />
      )
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findByText(/Error/).should('exist')
    cy.findByText(/Something went wrong downloading the file. Try again later./i).should('exist')
  })
})

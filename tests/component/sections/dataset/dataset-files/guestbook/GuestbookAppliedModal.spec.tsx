import { GuestbookAppliedModal } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/GuestbookAppliedModal'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'

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

const guestbookRepository: GuestbookRepository = {} as GuestbookRepository
const accessRepository: AccessRepository = {} as AccessRepository

describe('GuestbookAppliedModal', () => {
  beforeEach(() => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)
    accessRepository.submitGuestbookForDatafileDownload = cy
      .stub()
      .resolves('/api/v1/access/datafile/10?token=test')
    accessRepository.submitGuestbookForDatafilesDownload = cy
      .stub()
      .resolves('/api/v1/access/datafiles/10,11?token=test')
  })

  it('renders modal title and actions', () => {
    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={cy.stub().as('handleClose')}
        guestbookId={10}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByRole('dialog').should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('exist')
    cy.findByRole('button', { name: 'Cancel' }).should('exist')

    cy.findByText('Dataset Terms').should('exist')
    cy.findByText('License/Data Use Agreement').should('exist')
  })

  it('keeps accept disabled when no guestbook is loaded', () => {
    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={cy.stub().as('handleClose')}
        guestbookId={undefined as unknown as number}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByRole('button', { name: 'Accept' }).should('be.disabled')
  })

  it('calls handleClose when clicking cancel', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={handleClose}
        guestbookId={undefined as unknown as number}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
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
      <GuestbookAppliedModal
        show
        handleClose={handleClose}
        guestbookId={10}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.wrap(accessRepository.submitGuestbookForDatafileDownload).should('have.been.calledOnce')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
    cy.findByText('This field is required.').should('not.exist')
  })

  it('submits filled form and accepts for multiple files', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={handleClose}
        guestbookId={10}
        fileIds={[10, 11]}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.wrap(accessRepository.submitGuestbookForDatafilesDownload).should('have.been.calledOnce')
    cy.wrap(accessRepository.submitGuestbookForDatafilesDownload)
      .its('firstCall.args.0')
      .should('deep.equal', [10, 11])
    cy.wrap(accessRepository.submitGuestbookForDatafileDownload).should('not.have.been.called')
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('shows required field validation after clicking accept', () => {
    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={cy.stub().as('handleClose')}
        guestbookId={10}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByRole('button', { name: 'Accept' }).click()

    cy.findAllByText('This field is required.').should('have.length.at.least', 2)
  })

  it('renders visible custom questions sorted and submits answers with generated field ids', () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbookWithCustomQuestions)
    const handleClose = cy.stub().as('handleClose')

    cy.window().then((window) => {
      cy.stub(window.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })

    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={handleClose}
        guestbookId={10}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByText('Hidden question').should('not.exist')

    cy.findByText('How will you use this data?')
      .parents('div')
      .first()
      .find('textarea')
      .type('For a replication package')

    cy.findByText('Preferred format')
      .parents('div')
      .first()
      .find('select')
      .within(() => {
        cy.get('option').then(($options) => {
          const values = [...$options].map((option) => option.textContent?.trim() ?? '')
          expect(values).to.deep.equal(['', 'JSON', 'CSV'])
        })
      })
      .select('CSV')

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.wrap(accessRepository.submitGuestbookForDatafileDownload).should('have.been.calledOnce')
    cy.wrap(accessRepository.submitGuestbookForDatafileDownload)
      .its('firstCall.args.1')
      .should('deep.equal', [
        { id: 'name', value: 'Test User' },
        { id: 'email', value: 'test.user@example.com' },
        { id: 'custom-question-1-0', value: 'For a replication package' },
        { id: 'custom-question-2-1', value: 'CSV' }
      ])
    cy.get('@anchorClick').should('have.been.calledOnce')
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('shows error alert when get guestbook request fails', () => {
    guestbookRepository.getGuestbook = cy.stub().rejects(new Error('some guestbook error'))

    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={cy.stub().as('handleClose')}
        guestbookId={10}
        fileId={10}
        guestbookRepository={guestbookRepository}
        accessRepository={accessRepository}
      />
    )

    cy.findByText(/Something went wrong getting the guestbook. Try again later./).should('exist')
    cy.findByRole('button', { name: 'Accept' }).should('be.disabled')
  })
})

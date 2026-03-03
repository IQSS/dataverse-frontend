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
    cy.window().then((window) => {
      cy.stub(window, 'fetch').resolves(
        new window.Response(new Blob(['test-content'], { type: 'text/plain' }), {
          status: 200,
          headers: { 'content-disposition': "attachment; filename*=UTF-8''test.txt" }
        })
      )
    })

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

    cy.findByLabelText(/^Name/).clear().type('Test User')
    cy.findByLabelText(/^Email/)
      .clear()
      .type('test.user@example.com')
    cy.findByRole('button', { name: 'Accept' }).click()

    cy.wrap(accessRepository.submitGuestbookForDatafileDownload).should('have.been.calledOnce')
    cy.findByText('This field is required.').should('not.exist')
  })

  it('submits filled form and accepts for multiple files', () => {
    cy.window().then((window) => {
      cy.stub(window, 'fetch').resolves(
        new window.Response(new Blob(['test-content'], { type: 'text/plain' }), {
          status: 200,
          headers: { 'content-disposition': "attachment; filename*=UTF-8''test.zip" }
        })
      )
    })

    cy.customMount(
      <GuestbookAppliedModal
        show
        handleClose={cy.stub().as('handleClose')}
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

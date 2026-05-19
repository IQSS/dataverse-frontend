import { act, renderHook } from '@testing-library/react'
import { type CreateGuestbookDTO, WriteError } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useCreateGuestbook } from '@/sections/guestbooks/create-guestbooks/useCreateGuestbook'
import { createGuestbookRepositoryStub } from '../createGuestbookRepositoryStub'

const guestbook: CreateGuestbookDTO = {
  name: 'Test Guestbook',
  enabled: false,
  emailRequired: true,
  nameRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 0,
      type: 'text',
      hidden: false
    }
  ]
}

describe('useCreateGuestbook', () => {
  let guestbookRepository: GuestbookRepository
  let onSuccessfulCreate: Cypress.Agent<sinon.SinonStub>

  beforeEach(() => {
    guestbookRepository = createGuestbookRepositoryStub()
    onSuccessfulCreate = cy.stub().as('onSuccessfulCreate')
  })

  it('creates guestbook and calls success callback', async () => {
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.resolves(123)

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(createGuestbookStub).to.have.been.calledOnceWith('root', guestbook)
    expect(onSuccessfulCreate).to.have.been.calledOnceWith(123)
    expect(result.current.errorCreatingGuestbook).to.deep.equal(null)
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })

  it('sets formatted error when create fails with WriteError', async () => {
    const writeError = new WriteError()
    writeError.message = 'Request failed. Reason was: [400] Guestbook name is required'
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.rejects(writeError)

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(onSuccessfulCreate).to.not.have.been.called
    expect(result.current.errorCreatingGuestbook).to.deep.equal('Guestbook name is required')
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })

  it('sets default error when create fails with unknown error', async () => {
    const createGuestbookStub =
      guestbookRepository.createGuestbook as Cypress.Agent<sinon.SinonStub>
    createGuestbookStub.rejects(new Error('unexpected'))

    const { result } = renderHook(() =>
      useCreateGuestbook({
        guestbookRepository,
        collectionIdOrAlias: 'root',
        onSuccessfulCreate
      })
    )

    await act(async () => {
      await result.current.handleCreateGuestbook(guestbook)
    })

    expect(onSuccessfulCreate).to.not.have.been.called
    expect(result.current.errorCreatingGuestbook).to.deep.equal(
      'Something went wrong creating the guestbook. Try again later.'
    )
    expect(result.current.isCreatingGuestbook).to.deep.equal(false)
  })
})

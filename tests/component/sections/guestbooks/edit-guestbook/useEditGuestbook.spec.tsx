import { act, renderHook, waitFor } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookDTO } from '@/guestbooks/domain/useCases/DTOs/GuestbookDTO'
import { useEditGuestbook } from '@/sections/guestbooks/edit-guestbook/useEditGuestbook'

const guestbookId = 10
const guestbook: GuestbookDTO = {
  name: 'Research Guestbook',
  enabled: true,
  emailRequired: true,
  nameRequired: false,
  institutionRequired: true,
  positionRequired: false,
  createTime: '2026-01-01T00:00:00.000Z',
  customQuestions: []
}

const createI18n = (): I18nInstance => {
  const instance = i18next.createInstance()
  void instance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['guestbooks'],
    defaultNS: 'guestbooks',
    initImmediate: false,
    resources: {
      en: {
        guestbooks: {
          errors: {
            editGuestbook: 'Default edit guestbook error.'
          }
        }
      }
    }
  })

  return instance
}

const createGuestbookRepositoryStub = (): GuestbookRepository => ({
  createGuestbook: cy.stub(),
  editGuestbook: cy.stub(),
  getGuestbook: cy.stub(),
  getGuestbooksByCollectionId: cy.stub(),
  getGuestbookResponsesByGuestbookId: cy.stub(),
  setGuestbookEnabled: cy.stub(),
  downloadGuestbookResponsesByCollectionId: cy.stub(),
  downloadGuestbookResponsesByGuestbookId: cy.stub(),
  assignDatasetGuestbook: cy.stub(),
  removeDatasetGuestbook: cy.stub()
})

describe('useEditGuestbook', () => {
  let i18n: I18nInstance
  let guestbookRepository: GuestbookRepository
  let onSuccessfulEdit: Cypress.Agent<sinon.SinonStub>

  beforeEach(() => {
    i18n = createI18n()
    guestbookRepository = createGuestbookRepositoryStub()
    onSuccessfulEdit = cy.stub().as('onSuccessfulEdit')
  })

  const renderUseEditGuestbook = () =>
    renderHook(
      () =>
        useEditGuestbook({
          guestbookRepository,
          onSuccessfulEdit
        }),
      {
        wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      }
    )

  it('initializes with default state', async () => {
    const { result } = renderUseEditGuestbook()

    await waitFor(() => {
      expect(result.current.isEditingGuestbook).to.equal(false)
      expect(result.current.errorEditingGuestbook).to.equal(null)
    })
  })

  it('edits a guestbook and calls success callback', async () => {
    const editGuestbookStub = guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>
    editGuestbookStub.resolves(undefined)

    const { result } = renderUseEditGuestbook()

    await act(async () => {
      await result.current.handleEditGuestbook(guestbookId, guestbook)
    })

    expect(editGuestbookStub).to.have.been.calledOnceWith(guestbookId, guestbook)
    expect(onSuccessfulEdit).to.have.been.calledOnce
    expect(result.current.isEditingGuestbook).to.equal(false)
    expect(result.current.errorEditingGuestbook).to.equal(null)
  })

  it('sets formatted error when edit fails with WriteError', async () => {
    const writeError = new WriteError('[400] Guestbook name already exists')
    const editGuestbookStub = guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>
    editGuestbookStub.rejects(writeError)

    const { result } = renderUseEditGuestbook()

    await act(async () => {
      await result.current.handleEditGuestbook(guestbookId, guestbook)
    })

    expect(onSuccessfulEdit).not.to.have.been.called
    expect(result.current.errorEditingGuestbook).to.equal('Guestbook name already exists')
    expect(result.current.isEditingGuestbook).to.equal(false)
  })

  it('sets formatted error when edit fails with WriteError-shaped Error', async () => {
    const editGuestbookStub = guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>
    editGuestbookStub.rejects(
      new Error(
        'There was an error when writing the resource. Reason was: [409] Guestbook is in use'
      )
    )

    const { result } = renderUseEditGuestbook()

    await act(async () => {
      await result.current.handleEditGuestbook(guestbookId, guestbook)
    })

    expect(onSuccessfulEdit).not.to.have.been.called
    expect(result.current.errorEditingGuestbook).to.equal('Guestbook is in use')
  })

  it('sets error message when edit fails with a regular Error', async () => {
    const editGuestbookStub = guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>
    editGuestbookStub.rejects(new Error('Network unavailable'))

    const { result } = renderUseEditGuestbook()

    await act(async () => {
      await result.current.handleEditGuestbook(guestbookId, guestbook)
    })

    expect(onSuccessfulEdit).not.to.have.been.called
    expect(result.current.errorEditingGuestbook).to.equal('Network unavailable')
  })

  it('sets default error when edit fails with an unknown error', async () => {
    const editGuestbookStub = guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>
    editGuestbookStub.rejects('Error')

    const { result } = renderUseEditGuestbook()

    await act(async () => {
      await result.current.handleEditGuestbook(guestbookId, guestbook)
    })

    expect(onSuccessfulEdit).not.to.have.been.called
    expect(result.current.errorEditingGuestbook).to.equal('Default edit guestbook error.')
  })
})

import { act, renderHook } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { useUpdateTemplateTermsOfAccess } from '@/sections/templates/edit-template-terms/useUpdateTemplateTermsOfAccess'

const termsOfAccess: TermsOfAccess = { fileAccessRequest: true }

const createI18n = (): I18nInstance => {
  const instance = i18next.createInstance()
  void instance.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    ns: ['datasetTemplates'],
    defaultNS: 'datasetTemplates',
    initImmediate: false,
    resources: {
      en: {
        datasetTemplates: {
          editTemplate: { errors: { saveTermsOfAccessFailed: 'Update failed.' } }
        }
      }
    }
  })
  return instance
}

const createRepository = (): TemplateRepository => ({} as TemplateRepository)

describe('useUpdateTemplateTermsOfAccess', () => {
  let i18n: I18nInstance

  beforeEach(() => {
    i18n = createI18n()
  })

  it('updates terms of access and calls onSuccess', async () => {
    const repository = createRepository()
    repository.updateTemplateTermsOfAccess = cy.stub().resolves()
    const onSuccess = cy.stub()

    const { result } = renderHook(
      () => useUpdateTemplateTermsOfAccess({ templateRepository: repository, onSuccess }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      const ok = await result.current.handleUpdateTermsOfAccess(7, termsOfAccess)
      expect(ok).to.equal(true)
    })

    expect(repository.updateTemplateTermsOfAccess).to.have.been.calledWith(7, termsOfAccess)
    expect(onSuccess).to.have.been.calledOnce
    expect(result.current.error).to.equal(null)
  })

  it('surfaces a WriteError reason', async () => {
    const repository = createRepository()
    repository.updateTemplateTermsOfAccess = cy.stub().rejects(new WriteError('Forbidden'))

    const { result } = renderHook(
      () =>
        useUpdateTemplateTermsOfAccess({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      const ok = await result.current.handleUpdateTermsOfAccess(7, termsOfAccess)
      expect(ok).to.equal(false)
    })

    expect(result.current.error).to.equal('Forbidden')
  })

  it('surfaces a regular Error message', async () => {
    const repository = createRepository()
    repository.updateTemplateTermsOfAccess = cy.stub().rejects(new Error('Boom'))

    const { result } = renderHook(
      () =>
        useUpdateTemplateTermsOfAccess({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      await result.current.handleUpdateTermsOfAccess(7, termsOfAccess)
    })

    expect(result.current.error).to.equal('Boom')
  })

  it('falls back to the generic message for non-Error rejections', async () => {
    const repository = createRepository()
    repository.updateTemplateTermsOfAccess = cy.stub().rejects('weird')

    const { result } = renderHook(
      () =>
        useUpdateTemplateTermsOfAccess({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      await result.current.handleUpdateTermsOfAccess(7, termsOfAccess)
    })

    expect(result.current.error).to.equal('Update failed.')
  })
})

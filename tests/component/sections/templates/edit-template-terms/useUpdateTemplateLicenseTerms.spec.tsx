import { act, renderHook } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { UpdateTemplateLicenseTermsInfo } from '@/templates/domain/models/UpdateTemplateLicenseTermsInfo'
import { useUpdateTemplateLicenseTerms } from '@/sections/templates/edit-template-terms/useUpdateTemplateLicenseTerms'

const payload: UpdateTemplateLicenseTermsInfo = { name: 'CC0 1.0' }

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
          editTemplate: { errors: { saveLicenseFailed: 'Update failed.' } }
        }
      }
    }
  })
  return instance
}

const createRepository = (): TemplateRepository => ({} as TemplateRepository)

describe('useUpdateTemplateLicenseTerms', () => {
  let i18n: I18nInstance

  beforeEach(() => {
    i18n = createI18n()
  })

  it('updates license/terms and calls onSuccess', async () => {
    const repository = createRepository()
    repository.updateTemplateLicenseTerms = cy.stub().resolves()
    const onSuccess = cy.stub()

    const { result } = renderHook(
      () => useUpdateTemplateLicenseTerms({ templateRepository: repository, onSuccess }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      const ok = await result.current.handleUpdateLicenseTerms(7, payload)
      expect(ok).to.equal(true)
    })

    expect(repository.updateTemplateLicenseTerms).to.have.been.calledWith(7, payload)
    expect(onSuccess).to.have.been.calledOnce
    expect(result.current.error).to.equal(null)
    expect(result.current.isLoading).to.equal(false)
  })

  it('surfaces a WriteError reason', async () => {
    const repository = createRepository()
    repository.updateTemplateLicenseTerms = cy.stub().rejects(new WriteError('Bad payload'))

    const { result } = renderHook(
      () => useUpdateTemplateLicenseTerms({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      const ok = await result.current.handleUpdateLicenseTerms(7, payload)
      expect(ok).to.equal(false)
    })

    expect(result.current.error).to.equal('Bad payload')
  })

  it('surfaces a regular Error message', async () => {
    const repository = createRepository()
    repository.updateTemplateLicenseTerms = cy.stub().rejects(new Error('Network error'))

    const { result } = renderHook(
      () => useUpdateTemplateLicenseTerms({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      await result.current.handleUpdateLicenseTerms(7, payload)
    })

    expect(result.current.error).to.equal('Network error')
  })

  it('falls back to the generic message for non-Error rejections', async () => {
    const repository = createRepository()
    repository.updateTemplateLicenseTerms = cy.stub().rejects('weird')

    const { result } = renderHook(
      () => useUpdateTemplateLicenseTerms({ templateRepository: repository, onSuccess: cy.stub() }),
      { wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider> }
    )

    await act(async () => {
      await result.current.handleUpdateLicenseTerms(7, payload)
    })

    expect(result.current.error).to.equal('Update failed.')
  })
})

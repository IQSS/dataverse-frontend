import { act, renderHook } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { createTemplate, WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateInfo, TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import {
  SubmissionStatus,
  useSubmitTemplate
} from '@/sections/shared/form/TemplateMetadataForm/useSubmitTemplate'

const templatePayload: TemplateInfo = {
  name: 'Template One',
  fields: []
}

const templateInstructions: TemplateInstructionInfo[] = [
  { instructionField: 'title', instructionText: 'Use the official dataset title' },
  { instructionField: 'author', instructionText: 'List all contributing authors' }
]

const templatePayloadWithInstructions: TemplateInfo = {
  name: 'Template With Instructions',
  fields: [],
  instructions: templateInstructions
}

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
          createTemplate: {
            errors: {
              saveFailed: 'Save failed.'
            }
          }
        }
      }
    }
  })

  return instance
}

describe('useSubmitTemplate', () => {
  let i18n: I18nInstance

  beforeEach(() => {
    i18n = createI18n()
  })

  it('should submit the template successfully', async () => {
    const executeStub = cy.stub(createTemplate, 'execute').resolves()

    const { result } = renderHook(() => useSubmitTemplate('root'), {
      wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.NotSubmitted)
    expect(result.current.submitError).to.equal(null)

    await act(async () => {
      const didSubmit = await result.current.submitTemplate(templatePayload)
      expect(didSubmit).to.equal(true)
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.SubmitComplete)
    expect(result.current.submitError).to.equal(null)
    cy.wrap(executeStub).should('have.been.calledWith', templatePayload, 'root')

    executeStub.restore()
  })

  it('should handle WriteError responses', async () => {
    const executeStub = cy.stub(createTemplate, 'execute').rejects(new WriteError('Write error'))

    const { result } = renderHook(() => useSubmitTemplate('root'), {
      wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    })

    await act(async () => {
      const didSubmit = await result.current.submitTemplate(templatePayload)
      expect(didSubmit).to.equal(false)
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal('Write error')

    executeStub.restore()
  })

  it('should handle non-WriteError responses with a default message', async () => {
    const executeStub = cy.stub(createTemplate, 'execute').rejects('Error')

    const { result } = renderHook(() => useSubmitTemplate('root'), {
      wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    })

    await act(async () => {
      const didSubmit = await result.current.submitTemplate(templatePayload)
      expect(didSubmit).to.equal(false)
    })

    expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
    expect(result.current.submitError).to.equal('Save failed.')

    executeStub.restore()
  })

  it('should submit template with instructions', async () => {
    const executeStub = cy.stub(createTemplate, 'execute').resolves()

    const { result } = renderHook(() => useSubmitTemplate('root'), {
      wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    })

    await act(async () => {
      const didSubmit = await result.current.submitTemplate(templatePayloadWithInstructions)
      expect(didSubmit).to.equal(true)
    })

    cy.wrap(executeStub).should('have.been.calledWith', templatePayloadWithInstructions, 'root')

    executeStub.restore()
  })
})

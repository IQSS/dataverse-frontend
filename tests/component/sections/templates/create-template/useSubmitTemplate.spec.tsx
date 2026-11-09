import { act, renderHook } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { TemplateInfo, TemplateInstructionInfo } from '@/templates/domain/models/TemplateInfo'
import { UpdateTemplateMetadataInfo } from '@/templates/domain/models/UpdateTemplateMetadataInfo'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
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

const updatePayload: UpdateTemplateMetadataInfo = {
  name: 'Renamed Template',
  fields: [],
  instructions: []
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
          },
          editTemplate: {
            errors: {
              saveMetadataFailed: 'Update failed.'
            }
          }
        }
      }
    }
  })

  return instance
}

const createRepository = (): TemplateRepository => ({} as TemplateRepository)

describe('useSubmitTemplate', () => {
  let i18n: I18nInstance

  beforeEach(() => {
    i18n = createI18n()
  })

  describe('create mode', () => {
    it('submits the template successfully', async () => {
      const repository = createRepository()
      repository.createTemplate = cy.stub().resolves()

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'create',
            templateRepository: repository,
            collectionId: 'root'
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      expect(result.current.submissionStatus).to.equal(SubmissionStatus.NotSubmitted)

      await act(async () => {
        const didSubmit = await result.current.submitTemplate(templatePayload)
        expect(didSubmit).to.equal(true)
      })

      expect(result.current.submissionStatus).to.equal(SubmissionStatus.SubmitComplete)
      expect(result.current.submitError).to.equal(null)
      expect(repository.createTemplate).to.have.been.calledWith(templatePayload, 'root')
    })

    it('submits the template with instructions', async () => {
      const repository = createRepository()
      repository.createTemplate = cy.stub().resolves()

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'create',
            templateRepository: repository,
            collectionId: 'root'
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        await result.current.submitTemplate(templatePayloadWithInstructions)
      })

      expect(repository.createTemplate).to.have.been.calledWith(
        templatePayloadWithInstructions,
        'root'
      )
    })

    it('surfaces a WriteError reason as the submit error', async () => {
      const repository = createRepository()
      repository.createTemplate = cy.stub().rejects(new WriteError('Write error'))

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'create',
            templateRepository: repository,
            collectionId: 'root'
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        const didSubmit = await result.current.submitTemplate(templatePayload)
        expect(didSubmit).to.equal(false)
      })

      expect(result.current.submissionStatus).to.equal(SubmissionStatus.Errored)
      expect(result.current.submitError).to.equal('Write error')
    })

    it('falls back to a generic message for non-WriteError, non-Error rejections', async () => {
      const repository = createRepository()
      repository.createTemplate = cy.stub().rejects('Error')

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'create',
            templateRepository: repository,
            collectionId: 'root'
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        await result.current.submitTemplate(templatePayload)
      })

      expect(result.current.submitError).to.equal('Save failed.')
    })
  })

  describe('edit mode', () => {
    it('updates the template metadata successfully', async () => {
      const repository = createRepository()
      repository.updateTemplateMetadata = cy.stub().resolves()

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'edit',
            templateRepository: repository,
            templateId: 42
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        const didSubmit = await result.current.submitTemplate(updatePayload)
        expect(didSubmit).to.equal(true)
      })

      expect(result.current.submissionStatus).to.equal(SubmissionStatus.SubmitComplete)
      expect(repository.updateTemplateMetadata).to.have.been.calledWith(42, updatePayload, true)
    })

    it('uses the edit-mode error message for non-WriteError exceptions without messages', async () => {
      const repository = createRepository()
      repository.updateTemplateMetadata = cy.stub().rejects('weird')

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'edit',
            templateRepository: repository,
            templateId: 42
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        await result.current.submitTemplate(updatePayload)
      })

      expect(result.current.submitError).to.equal('Update failed.')
    })

    it('passes through a regular Error message in edit mode', async () => {
      const repository = createRepository()
      repository.updateTemplateMetadata = cy.stub().rejects(new Error('Network down'))

      const { result } = renderHook(
        () =>
          useSubmitTemplate({
            mode: 'edit',
            templateRepository: repository,
            templateId: 42
          }),
        {
          wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
        }
      )

      await act(async () => {
        await result.current.submitTemplate(updatePayload)
      })

      expect(result.current.submitError).to.equal('Network down')
    })
  })
})

import { act, renderHook } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import i18next, { i18n as I18nInstance } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { toast } from 'react-toastify'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useCopyTemplate } from '@/sections/templates/useCopyTemplate'
import { CitationMetadataBlockInfoMother } from '../../metadata-block-info/domain/models/CitationMetadataBlockInfoMother'
import { TemplateMother } from './TemplateMother'

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
          copyNamePrefix: 'copy {{name}}',
          alerts: {
            copySuccess: 'Template copied.',
            copyError: 'Something went wrong copying the template. Try again later.'
          }
        }
      }
    }
  })

  return instance
}

describe('useCopyTemplate', () => {
  let templateRepository: TemplateRepository
  let metadataBlockInfoRepository: MetadataBlockInfoRepository
  let i18n: I18nInstance

  beforeEach(() => {
    templateRepository = {} as TemplateRepository
    metadataBlockInfoRepository = {} as MetadataBlockInfoRepository
    i18n = createI18n()
    cy.stub(toast, 'success')
    cy.stub(toast, 'error')
  })

  it('copies metadata and terms of use values to the copied template', async () => {
    const customTerms = {
      termsOfUse: 'Existing custom terms',
      confidentialityDeclaration: 'Confidentiality',
      specialPermissions: 'Special permissions',
      restrictions: 'Restrictions',
      citationRequirements: 'Citation requirements',
      depositorRequirements: 'Depositor requirements',
      conditions: 'Conditions',
      disclaimer: 'Disclaimer'
    }
    const termsOfAccess = {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Access is restricted.'
    }
    const templateToCopy = TemplateMother.create({
      id: 10,
      name: 'Template Copy',
      isDefault: false,
      datasetMetadataBlocks: [
        {
          name: 'citation',
          fields: {
            title: 'My Title'
          }
        }
      ],
      instructions: [
        {
          instructionField: 'title',
          instructionText: 'Provide a clear title.'
        }
      ],
      termsOfUse: {
        customTerms,
        termsOfAccess
      }
    })
    const copiedTemplate = TemplateMother.create({
      id: 11,
      name: 'copy Template Copy'
    })

    templateRepository.getTemplate = cy.stub().resolves(templateToCopy)
    templateRepository.createTemplate = cy.stub().resolves()
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateToCopy, copiedTemplate])
    templateRepository.updateTemplateLicenseTerms = cy.stub().resolves()
    templateRepository.updateTemplateTermsOfAccess = cy.stub().resolves()
    metadataBlockInfoRepository.getByCollectionId = cy
      .stub()
      .resolves([CitationMetadataBlockInfoMother.get()])

    const { result } = renderHook(
      () =>
        useCopyTemplate({
          collectionId: 'root',
          templateRepository,
          metadataBlockInfoRepository
        }),
      {
        wrapper: ({ children }) => <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
      }
    )

    let didCopy: boolean | undefined

    await act(async () => {
      didCopy = await result.current.copyTemplate(10)
    })

    expect(didCopy).to.equal(true)
    expect(templateRepository.createTemplate).to.have.been.calledWith(
      {
        name: 'copy Template Copy',
        isDefault: false,
        fields: [
          {
            typeName: 'title',
            multiple: false,
            typeClass: 'primitive',
            value: 'My Title'
          }
        ],
        instructions: templateToCopy.instructions
      },
      'root'
    )
    expect(templateRepository.updateTemplateLicenseTerms).to.have.been.calledWith(11, {
      customTerms
    })
    expect(templateRepository.updateTemplateTermsOfAccess).to.have.been.calledWith(
      11,
      termsOfAccess
    )
    expect(toast.success).to.have.been.calledWith('Template copied.')
    expect(result.current.isCopyingTemplate).to.equal(false)
  })
})

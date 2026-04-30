import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { License } from '@/licenses/domain/models/License'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { EditTemplateLicenseTerms } from '@/sections/templates/edit-template-terms/EditTemplateLicenseTerms'
import { TemplateMother } from '../TemplateMother'

const licenseRepository: LicenseRepository = {} as LicenseRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const mockLicenses: License[] = [
  {
    id: 1,
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: '',
    active: true,
    isDefault: true,
    sortOrder: 0
  },
  {
    id: 2,
    name: 'CC BY 4.0',
    uri: 'http://creativecommons.org/licenses/by/4.0',
    iconUri: '',
    active: true,
    isDefault: false,
    sortOrder: 2
  }
]

describe('EditTemplateLicenseTerms', () => {
  beforeEach(() => {
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
  })

  const mountEditTemplateLicenseTerms = (
    onSuccess: () => void = cy.stub().as('onSuccess'),
    template = TemplateMother.create({
      id: 5,
      name: 'Tpl',
      license: mockLicenses[0],
      termsOfUse: { termsOfAccess: { fileAccessRequest: false } }
    })
  ) =>
    cy.customMount(
      <EditTemplateLicenseTerms
        template={template}
        templateRepository={templateRepository}
        licenseRepository={licenseRepository}
        onSuccess={onSuccess}
      />
    )

  it('renders the license selector and Save Changes button', () => {
    mountEditTemplateLicenseTerms()

    cy.findByRole('button', { name: 'Save Changes' }).should('exist')
  })

  it('submits a license update with the selected license name', () => {
    templateRepository.updateTemplateLicenseTerms = cy.stub().resolves()
    const onSuccess = cy.stub()

    mountEditTemplateLicenseTerms(onSuccess)

    // Wait for licenses to load and form to revalidate
    cy.findByRole('option', { name: 'CC0 1.0' }).should('exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('not.be.disabled').click()

    cy.wrap(templateRepository.updateTemplateLicenseTerms).should('have.been.calledOnce')
    cy.wrap(templateRepository.updateTemplateLicenseTerms).then((stub) => {
      const [templateId, payload] = (stub as unknown as sinon.SinonStub).getCall(0).args
      expect(templateId).to.equal(5)
      expect((payload as { name?: string }).name).to.match(/CC0 1\.0|CC BY 4\.0/)
    })
    cy.wrap(onSuccess).should('have.been.calledOnce')
  })

  it('shows an error alert when license update fails', () => {
    templateRepository.updateTemplateLicenseTerms = cy
      .stub()
      .rejects(new Error('Cannot update license'))

    mountEditTemplateLicenseTerms()

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.findByText(/Cannot update license/i).should('exist')
  })

  it('renders a Close button when onCancel is provided', () => {
    cy.customMount(
      <EditTemplateLicenseTerms
        template={TemplateMother.create({ id: 5, name: 'Tpl' })}
        templateRepository={templateRepository}
        licenseRepository={licenseRepository}
        onSuccess={cy.stub()}
        onCancel={cy.stub()}
      />
    )

    cy.findByRole('button', { name: /Close/i }).should('exist')
  })
})

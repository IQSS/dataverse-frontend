import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { EditTemplateTermsOfAccess } from '@/sections/templates/edit-template-terms/EditTemplateTermsOfAccess'
import { TemplateMother } from '../TemplateMother'

const templateRepository: TemplateRepository = {} as TemplateRepository

const baseTemplate = TemplateMother.create({
  id: 9,
  name: 'Tpl',
  termsOfUse: {
    termsOfAccess: {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Existing terms'
    }
  }
})

describe('EditTemplateTermsOfAccess', () => {
  const mountEditTemplateTermsOfAccess = (onSuccess: () => void = cy.stub()) =>
    cy.customMount(
      <EditTemplateTermsOfAccess
        template={baseTemplate}
        templateRepository={templateRepository}
        onSuccess={onSuccess}
      />
    )

  it('pre-fills the request-access checkbox and terms textarea', () => {
    mountEditTemplateTermsOfAccess()

    cy.findByLabelText(/Enable access request/i).should('be.checked')
    cy.findByText(/Terms of Access for Restricted Files/i).should('exist')
  })

  it('submits the terms of access', () => {
    templateRepository.updateTemplateTermsOfAccess = cy.stub().resolves()
    const onSuccess = cy.stub()

    mountEditTemplateTermsOfAccess(onSuccess)

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.wrap(templateRepository.updateTemplateTermsOfAccess).should('have.been.calledOnce')
    cy.wrap(templateRepository.updateTemplateTermsOfAccess).then((stub) => {
      const [templateId, payload] = (stub as unknown as sinon.SinonStub).getCall(0).args
      expect(templateId).to.equal(9)
      expect((payload as { fileAccessRequest: boolean }).fileAccessRequest).to.equal(true)
    })
    cy.wrap(onSuccess).should('have.been.calledOnce')
  })

  it('disables Save when request-access is off and terms are empty', () => {
    cy.customMount(
      <EditTemplateTermsOfAccess
        template={TemplateMother.create({
          id: 9,
          name: 'Tpl',
          termsOfUse: {
            termsOfAccess: { fileAccessRequest: false }
          }
        })}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
      />
    )

    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('renders a Close button when onCancel is provided', () => {
    cy.customMount(
      <EditTemplateTermsOfAccess
        template={baseTemplate}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
        onCancel={cy.stub()}
      />
    )

    cy.findByRole('button', { name: /Close/i }).should('exist')
  })

  it('shows an error message when the update fails', () => {
    templateRepository.updateTemplateTermsOfAccess = cy.stub().rejects(new Error('TOA boom'))

    mountEditTemplateTermsOfAccess()

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.findByText(/TOA boom/i).should('exist')
  })
})

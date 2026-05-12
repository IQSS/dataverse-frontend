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

  it('falls back to default terms of access when the template has none', () => {
    cy.customMount(
      <EditTemplateTermsOfAccess
        template={TemplateMother.create({
          id: 9,
          name: 'Tpl',
          termsOfUse: { termsOfAccess: { fileAccessRequest: false } }
        })}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
      />
    )

    cy.findByLabelText(/Enable access request/i).should('not.be.checked')
    cy.findByLabelText(/Terms of Access for Restricted Files/i).should('have.value', '')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('submits the terms of access', () => {
    templateRepository.updateTemplateTermsOfAccess = cy.stub().resolves()
    const onSuccess = cy.stub()

    mountEditTemplateTermsOfAccess(onSuccess)

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.wrap(templateRepository.updateTemplateTermsOfAccess).should('have.been.calledOnce')
    cy.wrap(templateRepository.updateTemplateTermsOfAccess).then((stub) => {
      const args = (stub as unknown as sinon.SinonStub).getCall(0).args as [
        number,
        { fileAccessRequest: boolean }
      ]
      expect(args[0]).to.equal(9)
      expect(args[1].fileAccessRequest).to.equal(true)
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

  it('shows the required message when request-access is off and terms are cleared', () => {
    cy.customMount(
      <EditTemplateTermsOfAccess
        template={TemplateMother.create({
          id: 9,
          name: 'Tpl',
          termsOfUse: {
            termsOfAccess: {
              fileAccessRequest: false,
              termsOfAccessForRestrictedFiles: 'Existing terms'
            }
          }
        })}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
      />
    )

    cy.findByLabelText(/Terms of Access for Restricted Files/i)
      .clear()
      .blur()
    cy.findByText(
      'Add information about terms of access for restricted files when request access is disabled.'
    ).should('exist')
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

  it('calls onCancel when Close is clicked', () => {
    const onCancel = cy.stub().as('onCancel')

    cy.customMount(
      <EditTemplateTermsOfAccess
        template={baseTemplate}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
        onCancel={onCancel}
      />
    )

    cy.findByRole('button', { name: /Close/i }).click()

    cy.get('@onCancel').should('have.been.calledOnce')
  })

  it('shows an error message when the update fails', () => {
    templateRepository.updateTemplateTermsOfAccess = cy.stub().rejects(new Error('TOA boom'))

    mountEditTemplateTermsOfAccess()

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.findByText(/TOA boom/i).should('exist')
  })

  it('shows the saving label while the update is in flight', () => {
    templateRepository.updateTemplateTermsOfAccess = cy
      .stub()
      .callsFake(() => Cypress.Promise.delay(200))

    mountEditTemplateTermsOfAccess()

    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByRole('button', { name: 'Saving' }).should('be.disabled')
  })

  it('enables Save and submits when request access is off but terms are provided', () => {
    templateRepository.updateTemplateTermsOfAccess = cy.stub().resolves()

    cy.customMount(
      <EditTemplateTermsOfAccess
        template={TemplateMother.create({
          id: 9,
          name: 'Tpl',
          termsOfUse: {
            termsOfAccess: {
              fileAccessRequest: false,
              termsOfAccessForRestrictedFiles: ''
            }
          }
        })}
        templateRepository={templateRepository}
        onSuccess={cy.stub()}
      />
    )

    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
    cy.findByLabelText(/Terms of Access for Restricted Files/i).type('Provide contact details')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled').click()

    cy.wrap(templateRepository.updateTemplateTermsOfAccess).should('have.been.calledWith', 9, {
      fileAccessRequest: false,
      termsOfAccessForRestrictedFiles: 'Provide contact details'
    })
  })
})

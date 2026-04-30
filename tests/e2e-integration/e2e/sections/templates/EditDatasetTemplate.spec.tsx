import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'

const TEMPLATES_PAGE_URL = '/spa/root/templates'
const editUrl = (id: number, mode: 'METADATA' | 'LICENSE') =>
  `/spa/templates/edit?id=${id}&ownerId=root&editMode=${mode}`

describe('Edit Dataset Template', () => {
  let templateId: number | undefined

  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })

    cy.wrap(null).then(async () => {
      const created = await DatasetHelper.createTemplate()
      templateId = created.id
    })
  })

  afterEach(() => {
    cy.wrap(null).then(async () => {
      if (!templateId) return
      await DatasetHelper.deleteDatasetTemplate(templateId).catch(() => {})
      templateId = undefined
    })
  })

  it('opens the edit-metadata page from the templates listing dropdown', () => {
    cy.visit(TEMPLATES_PAGE_URL)

    cy.findByText('Dataset Template One')
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: /Edit Template/i }).click({ force: true })
      })

    cy.findByText('Metadata').click({ force: true })

    cy.url().should('match', /\/templates\/edit\?.*editMode=METADATA/)
    cy.findByRole('heading', { name: /Edit Template Metadata/i }).should('exist')
  })

  it('updates the template name and redirects to the templates listing', () => {
    cy.wrap(null).then(() => {
      if (!templateId) throw new Error('Template not created')
      cy.visit(editUrl(templateId, 'METADATA'))
    })

    cy.findByLabelText(/Template Name/).should('have.value', 'Dataset Template One')
    cy.findByLabelText(/Template Name/)
      .clear()
      .type('Renamed Template')

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.url().should('include', TEMPLATES_PAGE_URL)
    cy.findByText('Renamed Template').should('exist')
    cy.findByText(/Template updated/i).should('exist')
  })

  it('renders the terms page with two horizontal tabs', () => {
    cy.wrap(null).then(() => {
      if (!templateId) throw new Error('Template not created')
      cy.visit(editUrl(templateId, 'LICENSE'))
    })

    cy.findByRole('tab', { name: /Dataset Terms/i }).should('exist')
    cy.findByRole('tab', { name: /Restricted Files \+ Terms of Access/i }).should('exist')
  })

  it('updates the terms-of-access and redirects to the templates listing', () => {
    cy.wrap(null).then(() => {
      if (!templateId) throw new Error('Template not created')
      cy.visit(editUrl(templateId, 'LICENSE'))
    })

    cy.findByRole('tab', { name: /Restricted Files \+ Terms of Access/i }).click()

    cy.findByLabelText(/Enable access request/i).check({ force: true })

    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.url().should('include', TEMPLATES_PAGE_URL)
    cy.findByText(/Template updated/i).should('exist')
  })

  it('cancels editing and returns to the templates listing', () => {
    cy.wrap(null).then(() => {
      if (!templateId) throw new Error('Template not created')
      cy.visit(editUrl(templateId, 'METADATA'))
    })

    cy.findByRole('button', { name: 'Cancel' }).click()

    cy.url().should('include', TEMPLATES_PAGE_URL)
  })
})

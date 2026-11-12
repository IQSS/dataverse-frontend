import { useLocation } from 'react-router-dom'
import { EditTemplateTerms } from '@/sections/templates/edit-template-terms'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { License } from '@/licenses/domain/models/License'
import { TemplateMother } from '../TemplateMother'

const templateRepository: TemplateRepository = {} as TemplateRepository
const licenseRepository: LicenseRepository = {} as LicenseRepository

const mockLicenses: License[] = [
  {
    id: 1,
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: '',
    active: true,
    isDefault: true,
    sortOrder: 0
  }
]

const template = TemplateMother.create({
  id: 5,
  name: 'Tpl',
  license: mockLicenses[0],
  termsOfUse: {
    termsOfAccess: {
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Existing terms'
    }
  }
})

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{location.pathname}</div>
}

describe('EditTemplateTerms', () => {
  beforeEach(() => {
    templateRepository.getTemplate = cy.stub().resolves(template)
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
  })

  const mountEditTemplateTerms = (
    initialEntries = ['/templates/edit?id=5&ownerId=root&editMode=LICENSE']
  ) =>
    cy.customMount(
      <>
        <EditTemplateTerms
          collectionId="root"
          templateId={5}
          templateRepository={templateRepository}
          licenseRepository={licenseRepository}
        />
        <LocationDisplay />
      </>,
      initialEntries
    )

  it('shows the loading skeleton while the template is loading', () => {
    const delayedTime = 200
    templateRepository.getTemplate = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(delayedTime).then(() => template)
    })

    mountEditTemplateTerms()

    cy.clock()
    cy.findByTestId('edit-template-terms-skeleton').should('exist')

    cy.tick(delayedTime)
    cy.findByTestId('edit-template-terms-skeleton').should('not.exist')
  })

  it('renders the page title and tabs', () => {
    mountEditTemplateTerms()

    cy.findByRole('heading', { name: /Edit Template Terms/i }).should('exist')
    cy.findByRole('tab', { name: /Dataset Terms/i }).should('exist')
    cy.findByRole('tab', { name: /Terms of Access/i }).should('exist')
  })

  it('shows the success alert after navigating from template creation', () => {
    mountEditTemplateTerms([
      {
        pathname: '/templates/edit',
        search: '?id=5&ownerId=root&editMode=LICENSE',
        state: { fromCreateTemplate: true }
      }
    ])

    cy.findByText(/Template has been created/i).should('exist')
  })

  it('shows an error alert when the template fetch fails', () => {
    templateRepository.getTemplate = cy.stub().rejects(new Error('Template fetch boom'))

    mountEditTemplateTerms()

    cy.findByText(/Something went wrong getting the template\. Try again later\./i).should('exist')
  })

  it('navigates back to the templates list when Close is clicked', () => {
    mountEditTemplateTerms()

    cy.findByTestId('location-display').should('have.text', '/templates/edit')
    cy.findByRole('button', { name: 'Close' }).click()
    cy.findByTestId('location-display').should('have.text', '/root/templates')
  })
})

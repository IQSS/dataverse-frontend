import { createSandbox, SinonSandbox } from 'sinon'
import { DataverseVersionMother } from '../../../info/domain/models/DataverseVersionMother'
import { FooterMother } from './FooterMother'
import { Footer } from '../../../../../src/sections/layout/footer/Footer'
import { applyTestAppConfig } from '../../../../support/bootstrapAppConfig'
import type { AppConfig } from '@/config'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'
import { spaVersion } from '@/version/spaVersion'

describe('Footer component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testVersion = DataverseVersionMother.create()
  const currentYear = new Date().getFullYear().toString()
  const defaultFooterEnv = Cypress.env('footer') as AppConfig['footer']

  afterEach(() => {
    Cypress.env('footer', defaultFooterEnv)
    applyTestAppConfig()
  })

  it('should render footer content', () => {
    cy.customMount(FooterMother.withDataverseVersion(sandbox, testVersion))

    cy.contains(`Copyright © ${currentYear}, The President & Fellows of Harvard College`).should(
      'exist'
    )
    cy.findByText('Privacy Policy').should('exist')
    cy.findByAltText('The Dataverse Project logo').should('exist')
    cy.findByText(testVersion).should('exist')
    cy.findByText(`frontend version: ${spaVersion}`).should('exist')
  })

  it('should call dataverseInfoRepository.getVersion on mount', () => {
    const dataverseInfoRepository = new DataverseInfoMockRepository()
    sandbox.spy(dataverseInfoRepository, 'getVersion')

    cy.customMount(<Footer dataverseInfoRepository={dataverseInfoRepository} />)

    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    cy.wrap(dataverseInfoRepository.getVersion).should('have.been.called')
  })

  it('should fall back to Dataverse Project when copyright holder is not configured', () => {
    Cypress.env('footer', { privacyPolicyUrl: defaultFooterEnv?.privacyPolicyUrl })
    applyTestAppConfig()

    cy.customMount(FooterMother.withDataverseVersion(sandbox, testVersion))

    cy.contains(`Copyright © ${currentYear}, Dataverse Project`).should('exist')
  })

  it('should open privacy policy link in new tab', () => {
    cy.customMount(FooterMother.withDataverseVersion(sandbox))

    cy.findByText('Privacy Policy')
      .should('have.attr', 'href', defaultFooterEnv?.privacyPolicyUrl)
      .and('have.attr', 'target', '_blank')
  })
})

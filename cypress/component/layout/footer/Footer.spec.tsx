import { Footer } from '../../../../src/sections/layout/footer/Footer'
import { createSandbox, SinonSandbox } from 'sinon'
import { DataverseVersionMother } from '../../../../tests/info/models/DataverseVersionMother'
import { FooterMother } from '../../../../tests/sections/layout/footer/FooterMother'
import { DataverseInfoRepository } from '../../../../src/info/domain/repositories/DataverseInfoRepository'

describe('Footer component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testVersion = DataverseVersionMother.create()

  it('should render footer content', () => {
    cy.customMount(FooterMother.withDataverseVersion(sandbox, testVersion))

    cy.findByText('Privacy Policy').should('exist')
    cy.findByAltText('The Dataverse Project logo').should('exist')
    cy.findByText(testVersion).should('exist')
  })

  it('should call dataverseInfoRepository.getVersion on mount', () => {
    const dataverseInfoRepository: DataverseInfoRepository = {
      getVersion: cy.stub().resolves(testVersion)
    }

    cy.customMount(<Footer dataverseInfoRepository={dataverseInfoRepository} />)

    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    cy.wrap(dataverseInfoRepository.getVersion).should('have.been.called')
  })

  it('should open privacy policy link in new tab', () => {
    cy.customMount(FooterMother.withDataverseVersion(sandbox))

    cy.findByText('Privacy Policy').should('exist')
  })
})

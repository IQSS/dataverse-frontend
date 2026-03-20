import { createSandbox, SinonSandbox } from 'sinon'
import { DataverseVersionMother } from '../../../info/domain/models/DataverseVersionMother'
import { DataverseInfoRepository } from '../../../../../src/info/domain/repositories/DataverseInfoRepository'
import { FooterMother } from './FooterMother'
import { Footer } from '../../../../../src/sections/layout/footer/Footer'
import { applyTestAppConfig } from '../../../../support/bootstrapAppConfig'
import type { AppConfig } from '@/config'
import type { DatasetMetadataExportFormats } from '@/info/domain/models/DatasetMetadataExportFormats'
import type { TermsOfUse } from '@/info/domain/models/TermsOfUse'
import type { ZipDownloadLimit } from '@/settings/domain/models/ZipDownloadLimit'
import type { Setting } from '@/settings/domain/models/Setting'

describe('Footer component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testVersion = DataverseVersionMother.create()
  const currentYear = new Date().getFullYear().toString()
  const defaultFooterEnv = Cypress.env('footer') as AppConfig['footer']

  it('should render footer content', () => {
    cy.customMount(FooterMother.withDataverseVersion(sandbox, testVersion))

    cy.contains(`Copyright © ${currentYear}, The President & Fellows of Harvard College`).should(
      'exist'
    )
    cy.findByText('Privacy Policy').should('exist')
    cy.findByAltText('The Dataverse Project logo').should('exist')
    cy.findByText(testVersion).should('exist')
  })

  it('should call dataverseInfoRepository.getVersion on mount', () => {
    const dataverseInfoRepository: DataverseInfoRepository = {
      getVersion: cy.stub().resolves(testVersion),
      getTermsOfUse: cy.stub().resolves({} as TermsOfUse),
      getZipDownloadLimit: cy.stub().resolves({} as Setting<ZipDownloadLimit>),
      getMaxEmbargoDurationInMonths: cy.stub().resolves({} as Setting<number>),
      getHasPublicStore: cy.stub().resolves({} as Setting<boolean>),
      getExternalStatusesAllowed: cy.stub().resolves({} as Setting<string[]>),
      getAvailableDatasetMetadataExportFormats: cy
        .stub()
        .resolves({} as DatasetMetadataExportFormats)
    }

    cy.customMount(<Footer dataverseInfoRepository={dataverseInfoRepository} />)

    /* eslint-disable-next-line @typescript-eslint/unbound-method */
    cy.wrap(dataverseInfoRepository.getVersion).should('have.been.called')
  })

  it('should open privacy policy link in new tab', () => {
    Cypress.env('footer', defaultFooterEnv)
    applyTestAppConfig()
    cy.customMount(FooterMother.withDataverseVersion(sandbox))

    cy.findByText('Privacy Policy')
      .should('have.attr', 'href', defaultFooterEnv?.privacyPolicyUrl)
      .and('have.attr', 'target', '_blank')
  })
})

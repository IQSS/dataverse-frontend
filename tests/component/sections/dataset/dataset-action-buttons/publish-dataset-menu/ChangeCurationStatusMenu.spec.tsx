import { ChangeCurationStatusMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/publish-dataset-menu/ChangeCurationStatusMenu'

import { SettingMother } from '../../../../settings/domain/models/SettingMother'
import { SettingsProvider } from '../../../../../../src/sections/settings/SettingsProvider'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { NotImplementedModalProvider } from '../../../../../../src/sections/not-implemented/NotImplementedModalProvider'

const dataverseInfoRepository = {} as DataverseInfoRepository

describe('ChangeCurationStatusMenu', () => {
  beforeEach(() => {
    dataverseInfoRepository.getHasPublicStore = cy.stub().resolves({})
    dataverseInfoRepository.getExternalStatusesAllowed = cy.stub().resolves({})
    dataverseInfoRepository.getMaxEmbargoDurationInMonths = cy.stub().resolves({})
    dataverseInfoRepository.getZipDownloadLimit = cy.stub().resolves({})
  })

  it('renders the ChangeCurationStatusMenu if external statuses are allowed and the user has update dataset permissions', () => {
    dataverseInfoRepository.getExternalStatusesAllowed = cy
      .stub()
      .resolves(SettingMother.createExternalStatusesAllowed(['Author Contacted', 'Privacy Review']))

    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <ChangeCurationStatusMenu />
      </SettingsProvider>
    )

    cy.findByRole('button', { name: 'Change Curation Status' })
      .should('exist')
      .should('be.enabled')
      .click()

    cy.findByRole('button', { name: 'Author Contacted' }).should('exist')
    cy.findByRole('button', { name: 'Privacy Review' }).should('exist')
    cy.findByRole('button', { name: 'Remove Current Status' }).should('exist')
  })

  it('does not render the ChangeCurationStatusMenu if external statuses are not allowed', () => {
    cy.customMount(<ChangeCurationStatusMenu />)

    cy.findByRole('button', { name: 'Change Curation Status' }).should('not.exist')
  })
  it('renders the Not Implemented Modal when button is clicked', () => {
    dataverseInfoRepository.getExternalStatusesAllowed = cy
      .stub()
      .resolves(SettingMother.createExternalStatusesAllowed(['Author Contacted', 'Privacy Review']))

    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <NotImplementedModalProvider>
          <ChangeCurationStatusMenu />
        </NotImplementedModalProvider>
      </SettingsProvider>
    )

    cy.findByRole('button', { name: 'Change Curation Status' })
      .should('exist')
      .should('be.enabled')
      .click()

    cy.findByRole('button', { name: 'Author Contacted' }).should('exist').click()
  })
})

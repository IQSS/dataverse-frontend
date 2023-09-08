import { ChangeCurationStatusMenu } from '../../../../../src/sections/dataset/dataset-action-buttons/ChangeCurationStatusMenu'

import { SettingMother } from '../../../settings/domain/models/SettingMother'
import { SettingsProvider } from '../../../../../src/sections/settings/SettingsProvider'
import { SettingRepository } from '../../../../../src/settings/domain/repositories/SettingRepository'

describe('ChangeCurationStatusMenu', () => {
  it('renders the ChangeCurationStatusMenu if external statuses are allowed and the user has update dataset permissions', () => {
    const settingRepository = {} as SettingRepository
    settingRepository.getByName = cy
      .stub()
      .resolves(SettingMother.createExternalStatusesAllowed(['Author Contacted', 'Privacy Review']))

    cy.customMount(
      <SettingsProvider repository={settingRepository}>
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
})

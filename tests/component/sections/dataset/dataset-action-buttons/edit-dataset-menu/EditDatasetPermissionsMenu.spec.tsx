import { EditDatasetPermissionsMenu } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/EditDatasetPermissionsMenu'
import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../dataset/domain/models/DatasetMother'
import { SettingRepository } from '../../../../../../src/settings/domain/repositories/SettingRepository'
import { SettingMother } from '../../../../settings/domain/models/SettingMother'
import { SettingsProvider } from '../../../../../../src/sections/settings/SettingsProvider'

describe('EditDatasetPermissionsMenu', () => {
  it('renders the EditDatasetPermissionsMenu if the user has  manage dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithManageDatasetPermissionsAllowed(),
      locks: []
    })

    cy.customMount(<EditDatasetPermissionsMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Permissions' }).should('exist').click()
    cy.findByRole('button', { name: 'Dataset' }).should('exist')
  })

  it('renders the EditDatasetPermissionsMenu if the user has  manage files permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithManageFilesPermissionsAllowed(),
      locks: []
    })

    cy.customMount(<EditDatasetPermissionsMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Permissions' }).should('exist').click()
    cy.findByRole('button', { name: 'File' }).should('exist')
  })

  it('renders the Permissions button with no options if there is public store', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithManageFilesPermissionsAllowed(),
      locks: []
    })

    const settingRepository = {} as SettingRepository
    settingRepository.getByName = cy.stub().resolves(SettingMother.createHasPublicStore(true))

    cy.customMount(
      <SettingsProvider repository={settingRepository}>
        <EditDatasetPermissionsMenu dataset={dataset} />
      </SettingsProvider>
    )

    cy.wait(1000) // Wait for the settings to be loaded

    cy.findByRole('button', { name: 'Permissions' }).should('exist').click()
    cy.findByRole('button', { name: 'File' }).should('not.exist')
    cy.findByRole('button', { name: 'Dataset' }).should('not.exist')
  })

  it('does not render the EditDatasetPermissionsMenu if the user does not have manage dataset permissions or manage files permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithManagePermissionsNotAllowed(),
      locks: []
    })

    cy.customMount(<EditDatasetPermissionsMenu dataset={dataset} />)

    cy.findByRole('button', { name: 'Permissions' }).should('not.exist')
  })
})

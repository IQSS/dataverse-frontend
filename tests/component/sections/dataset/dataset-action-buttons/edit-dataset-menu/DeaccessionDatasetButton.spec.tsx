import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../dataset/domain/models/DatasetMother'
import { DeaccessionDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/edit-dataset-menu/DeaccessionDatasetButton'

describe('DeaccessionDatasetButton', () => {
  it('renders the DeaccessionDatasetButton if the user has publish dataset permissions and the dataset is released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      isReleased: true
    })

    cy.customMount(<DeaccessionDatasetButton dataset={dataset} />)

    cy.findByRole('separator').should('exist')
    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('exist')
  })

  it('does not render the DeaccessionDatasetButton if the user does not have publish dataset permissions', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetNotAllowed(),
      isReleased: true
    })

    cy.customMount(<DeaccessionDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('not.exist')
  })

  it('does not render the DeaccessionDatasetButton if the dataset is not released', () => {
    const dataset = DatasetMother.create({
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed(),
      isReleased: false
    })

    cy.customMount(<DeaccessionDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Deaccession Dataset' }).should('not.exist')
  })
})

import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { LinkDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/link-dataset-button/LinkDatasetButton'

describe('LinkDatasetButton', () => {
  it('renders the LinkDatasetButton if the user is authenticated and the dataset version is not deaccessioned and the dataset is released', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased()
    })

    cy.mountAuthenticated(<LinkDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })

  it('does not render the LinkDatasetButton if the user is not authenticated', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased()
    })

    cy.customMount(<LinkDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('does not render the LinkDatasetButton if the dataset version is deaccessioned', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDeaccessioned()
    })

    cy.mountAuthenticated(<LinkDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('does not render the LinkDatasetButton if the dataset is not released', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createNotReleased()
    })

    cy.mountAuthenticated(<LinkDatasetButton dataset={dataset} />)

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })
})

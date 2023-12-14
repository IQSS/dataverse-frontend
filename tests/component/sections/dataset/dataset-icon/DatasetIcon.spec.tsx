import { DatasetIcon } from '../../../../../src/sections/dataset/dataset-icon/DatasetIcon'

describe('DatasetIcon', () => {
  it('renders the dataset icon', () => {
    cy.customMount(<DatasetIcon />)

    cy.findByLabelText('icon-dataset').should('exist')
  })
})

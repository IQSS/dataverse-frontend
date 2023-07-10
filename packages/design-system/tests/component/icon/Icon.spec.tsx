import { DataverseIconName, Icon } from '../../../src/lib'

describe('Icon', () => {
  it('renders the icon with the correct text', () => {
    cy.mount(<Icon name={DataverseIconName.DATASET} />)
    cy.findByRole('img', { name: DataverseIconName.DATASET }).should('exist')
  })
})

import { IconName, Icon } from '../../../src/lib'

describe('Icon', () => {
  it('renders the icon with the correct text', () => {
    cy.mount(<Icon name={IconName.DATASET} />)
    cy.findByRole('img', { name: IconName.DATASET }).should('exist')
  })
})

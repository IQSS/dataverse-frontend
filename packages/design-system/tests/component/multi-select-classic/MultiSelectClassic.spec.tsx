import { MultiSelectClassic } from '../../../src/lib/components/multi-select-classic/MultiSelectClassic'

describe('MultiSelectClassic', () => {
  it('renders the MultiSelectClassic', () => {
    cy.mount(
      <MultiSelectClassic
        value={['a', 'b']}
        options={['a', 'b', 'c', 'd']}
        setSelected={() => {}}
      />
    )

    cy.findByText('a').should('exist')
  })
})

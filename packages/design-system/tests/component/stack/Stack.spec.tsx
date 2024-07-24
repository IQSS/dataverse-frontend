import { Stack } from '../../../src/lib/components/stack/Stack'

describe('Stack', () => {
  it('renders vertically by default', () => {
    cy.mount(
      <Stack data-testid="vertical-by-default">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Stack>
    )

    cy.findByTestId('vertical-by-default').should('have.css', 'flex-direction', 'column')
  })

  it('renders horizontally when direction="horizontal"', () => {
    cy.mount(
      <Stack direction="horizontal" data-testid="horizontal">
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Stack>
    )

    cy.findByTestId('horizontal').should('have.css', 'flex-direction', 'row')
  })

  it('renders with the correct gap', () => {
    cy.mount(
      <Stack gap={4} data-testid="gap">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>
    )

    cy.findByTestId('gap').should('have.css', 'gap', '24px')
  })
})

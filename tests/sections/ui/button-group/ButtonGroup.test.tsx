import { render } from '@testing-library/react'
import { ButtonGroup } from '../../../../src/sections/ui/button-group/ButtonGroup'
import { Button } from '../../../../src/sections/ui/button/Button'

describe('ButtonGroup', () => {
  it('renders with children', () => {
    const { getByText } = render(
      <ButtonGroup>
        <Button>Button 1</Button>
        <Button>Button 2</Button>
      </ButtonGroup>
    )
    expect(getByText('Button 1')).toBeInTheDocument()
    expect(getByText('Button 2')).toBeInTheDocument()
  })

  it('renders vertically when vertical prop is set to true', () => {
    const { getByRole } = render(<ButtonGroup vertical data-testid="button-group" />)
    expect(getByRole('group')).toHaveClass('btn-group-vertical')
  })

  it('does not render vertically when vertical prop is not set', () => {
    const { getByRole } = render(<ButtonGroup data-testid="button-group" />)
    expect(getByRole('group')).not.toHaveClass('btn-group-vertical')
  })
})

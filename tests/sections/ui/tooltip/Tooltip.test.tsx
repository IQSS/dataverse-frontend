import { render } from '@testing-library/react'
import { Tooltip, TooltipProps } from '../../../../src/sections/ui/tooltip/Tooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'top',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    render(<Tooltip {...defaultProps} />)
  })
})

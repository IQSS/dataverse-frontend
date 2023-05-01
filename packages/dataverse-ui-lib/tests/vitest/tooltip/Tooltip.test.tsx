import { fireEvent, render } from '@testing-library/react'
import { Tooltip, TooltipProps } from '../../../src/lib/components/tooltip/Tooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'top',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    render(<Tooltip {...defaultProps} />)
  })
  it('renders the tooltip on mouseOver', async () => {
    const { getByRole, findByRole } = render(<Tooltip {...defaultProps} />)
    const svg = getByRole('img')
    expect(svg).toBeInTheDocument()
    fireEvent.mouseOver(svg)
    expect(await findByRole('tooltip')).toBeInTheDocument()
  })
})

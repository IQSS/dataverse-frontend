import { fireEvent, render } from '@testing-library/react'
import { Tooltip, TooltipProps } from '../../../../src/sections/ui/tooltip/Tooltip'

describe('Tooltip', () => {
  const defaultProps: TooltipProps = {
    placement: 'top',
    message: 'This is a tooltip message'
  }

  it('renders without crashing', () => {
    render(<Tooltip {...defaultProps} />)
  })
  it('renders without crashing', () => {
    const { container, findByText } = render(<Tooltip {...defaultProps} />)
    const svg = container.querySelector('span > svg')
    expect(svg).toBeInTheDocument()
    fireEvent.mouseOver(svg)
    //expect(findByText('Tooltip')).toBeInTheDocument()
  })
  /*
  it('try example without crashing', async () => {
    const { container, findByText } = render(<Tooltip {...defaultProps} />)
    const svg = container.querySelector('span > svg')
    expect(svg).toBeInTheDocument()
    fireEvent.mouseOver(svg)
    expect(await findByText('Tooltip').toBeInTheDocument())
  })*/
})

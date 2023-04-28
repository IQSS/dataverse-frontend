import { Breadcrumb } from '../../../../packages/dataverse-ui-lib/src/lib/breadcrumb/Breadcrumb'
import { render } from '@testing-library/react'

describe('Breadcrumb', () => {
  test('renders without errors when given valid props', () => {
    const { getByRole } = render(<Breadcrumb>Test</Breadcrumb>)
    expect(getByRole('navigation')).toBeInTheDocument()
  })

  test('renders the children prop', () => {
    const { getByText } = render(<Breadcrumb>Test</Breadcrumb>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('has the correct role', () => {
    const { getByRole } = render(<Breadcrumb>Test</Breadcrumb>)
    expect(getByRole('navigation')).toBeInTheDocument()
  })
})

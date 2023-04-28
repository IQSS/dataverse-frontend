import { BreadcrumbItem } from '../../../../packages/dataverse-ui-lib/src/lib/breadcrumb/BreadcrumbItem'
import { render } from '@testing-library/react'

describe('BreadcrumbItem', () => {
  test('renders without errors when given valid props', () => {
    const { getByText } = render(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('renders the children prop', () => {
    const { getByText } = render(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    expect(getByText('Test')).toBeInTheDocument()
  })

  test('has the correct href attribute', () => {
    const { getByText } = render(<BreadcrumbItem href="/home">Test</BreadcrumbItem>)
    const link = getByText('Test')
    expect(link).toHaveAttribute('href', '/home')
  })

  test('has the active class when the active prop is true', () => {
    const { getByText } = render(<BreadcrumbItem active>Test</BreadcrumbItem>)
    const item = getByText('Test')
    expect(item).toHaveClass('active')
  })

  test('does not have the active class when the active prop is false or not present', () => {
    const { getByText } = render(<BreadcrumbItem>Test</BreadcrumbItem>)
    const item = getByText('Test')
    expect(item).not.toHaveClass('active')
  })
})

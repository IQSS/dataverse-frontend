import { render, screen } from '@testing-library/react'
import { HelloDataverse } from '../../../src/sections/hello-dataverse/HelloDataverse'

test('renders hello dataverse title', () => {
  render(<HelloDataverse />)
  const titleElement = screen.getByText(/hello dataverse/i)
  expect(titleElement).toBeInTheDocument()
})

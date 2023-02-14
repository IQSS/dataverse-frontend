import { render, screen } from '@testing-library/react'
import App from '../src/App'

test('renders hello dataverse title', () => {
  render(<App />)
  const titleElement = screen.getByText(/hello dataverse/i)
  expect(titleElement).toBeInTheDocument()
})

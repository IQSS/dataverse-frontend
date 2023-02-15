import { screen } from '@testing-library/react'
import { HelloDataverse } from '../../../src/sections/hello-dataverse/HelloDataverse'
import { renderWithRouter } from '../../renderWithRouter'

test('renders hello dataverse title', () => {
  renderWithRouter(<HelloDataverse />)

  const titleElement = screen.getByText(/hello dataverse/i)
  expect(titleElement).toBeInTheDocument()
})

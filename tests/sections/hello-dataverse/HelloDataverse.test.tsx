import { screen } from '@testing-library/react'
import { HelloDataverse } from '../../../src/sections/hello-dataverse/HelloDataverse'
import { renderWithRouter } from '../../renderWithRouter'

test('renders hello dataverse title', () => {
  renderWithRouter(<HelloDataverse />)

  const titleElement = screen.getByRole('heading', { name: 'title' })
  expect(titleElement).toBeInTheDocument()
})

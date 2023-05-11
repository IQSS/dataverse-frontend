import { render } from '@testing-library/react'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'

describe('DatasetCitation component', () => {
  const displayCitation = 'displayCitation'

  it('renders citation information', () => {
    const { getByText, getByRole } = render(<DatasetCitation displayCitation={displayCitation} />)

    expect(getByText(displayCitation)).toBeInTheDocument()
    expect(getByText('Dropdown Citation')).toBeInTheDocument()
    expect(getByText('Data Citation Standards.')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Data Citation Standards.' })).toHaveAttribute(
      'href',
      'https://dataverse.org'
    )
    expect(getByRole('article')).toBeInTheDocument()
  })

  it('does not render anything when dataset is not available', () => {
    const { queryByRole } = render(<DatasetCitation displayCitation={''} />)

    expect(queryByRole('article')).not.toBeInTheDocument()
  })
})

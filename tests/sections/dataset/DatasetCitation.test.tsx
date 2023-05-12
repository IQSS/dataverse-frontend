import { render } from '@testing-library/react'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'
import { Citation } from '../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation component', () => {
  const citationFields: Citation = {
    authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
    title: 'Test Terms',
    creationYear: 2023,
    persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
    persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
    publisher: 'Demo Dataverse',
    version: 'V1'
  }

  it('renders citation information', () => {
    const { getByText, getByRole } = render(<DatasetCitation citation={citationFields} />)

    expect(getByText(citationFields.publisher)).toBeInTheDocument()
    expect(getByText('Dropdown Citation')).toBeInTheDocument()
    expect(getByText('Data Citation Standards.')).toBeInTheDocument()
    expect(getByRole('link', { name: 'Data Citation Standards.' })).toHaveAttribute(
      'href',
      'https://dataverse.org'
    )
    expect(getByRole('article')).toBeInTheDocument()
  })
  /*
  it('does not render anything when dataset is not available', () => {
    const { queryByRole } = render(<DatasetCitation citation={undefined} />)

    expect(queryByRole('article')).not.toBeInTheDocument()
  }) */
})

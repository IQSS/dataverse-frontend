import { render } from '@testing-library/react'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'
import { Citation } from '../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation component', () => {
  it('renders citation information', () => {
    const citationFields: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'V1'
    }
    const { getByText, getByRole, queryByText } = render(
      <DatasetCitation citation={citationFields} />
    )
    citationFields.authors.map((author) => {
      expect(getByText(new RegExp(`${author}`))).toBeInTheDocument()
    })
    expect(getByText('Data Citation Standards.')).toBeInTheDocument()
    expect(getByText(new RegExp(`${citationFields.title}`))).toBeInTheDocument()
    expect(getByText(new RegExp(`${citationFields.creationYear}`))).toBeInTheDocument()
    expect(getByText(new RegExp(`${citationFields.publisher}`))).toBeInTheDocument()
    expect(getByText(new RegExp(`${citationFields.version}`))).toBeInTheDocument()
    expect(getByRole('link', { name: citationFields.persistentIdentifier })).toHaveAttribute(
      'href',
      citationFields.persistentIdentifierUrl
    )
    expect(getByRole('link', { name: 'Data Citation Standards.' })).toHaveAttribute(
      'href',
      'https://dataverse.org/best-practices/data-citation'
    )
    expect(getByRole('article')).toBeInTheDocument()
    expect(queryByText(/DEACCESSIONED VERSION/)).not.toBeInTheDocument()
  })

  it('renders Deaccession information', () => {
    const deaccessionedCitation: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'V1',
      isDeaccessioned: true
    }
    const { getByText, getByRole } = render(<DatasetCitation citation={deaccessionedCitation} />)

    expect(getByText(/DEACCESSIONED VERSION/)).toBeInTheDocument()
  })
})

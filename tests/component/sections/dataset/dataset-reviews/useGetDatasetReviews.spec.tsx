import { renderHook, waitFor } from '@testing-library/react'
import { DatasetReview } from '@/dataset/domain/models/DatasetReview'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useGetDatasetReviews } from '@/sections/dataset/dataset-reviews/useGetDatasetReviews'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const datasetId = 'doi:10.5072/FK2/ABC123'
const datasetReviews: DatasetReview[] = [
  {
    id: 23,
    title: 'Review of Some Title',
    authors: ['Reviewer One'],
    persistentId: 'doi:10.5072/FK2/REVIEW1',
    persistentIdUrl: 'https://doi.org/10.5072/FK2/REVIEW1',
    citation: 'Review citation',
    citationHtml: 'Review citation',
    datePublished: '2026-02-03',
    description: 'A review dataset',
    rubricMetadataBlocks: []
  }
]

describe('useGetDatasetReviews', () => {
  it('should return dataset reviews correctly', async () => {
    datasetRepository.getDatasetReviews = cy.stub().resolves(datasetReviews)

    const { result } = renderHook(() =>
      useGetDatasetReviews({
        datasetRepository,
        datasetId
      })
    )

    expect(result.current.isLoading).to.equal(true)
    expect(result.current.error).to.equal(null)
    expect(result.current.datasetReviews).to.deep.equal([])

    await waitFor(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(null)
      expect(result.current.datasetReviews).to.deep.equal(datasetReviews)
    })
    cy.wrap(datasetRepository.getDatasetReviews).should('have.been.calledWith', datasetId)
  })

  it('should return the error message when the request fails with an Error', async () => {
    datasetRepository.getDatasetReviews = cy.stub().rejects(new Error('Error message'))

    const { result } = renderHook(() =>
      useGetDatasetReviews({
        datasetRepository,
        datasetId
      })
    )

    expect(result.current.isLoading).to.equal(true)
    expect(result.current.error).to.equal(null)
    expect(result.current.datasetReviews).to.deep.equal([])

    await waitFor(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal('Error message')
      expect(result.current.datasetReviews).to.deep.equal([])
    })
  })

  it('should return the default error message when the request fails with an Error without a message', async () => {
    datasetRepository.getDatasetReviews = cy.stub().rejects(new Error(''))

    const { result } = renderHook(() =>
      useGetDatasetReviews({
        datasetRepository,
        datasetId
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(
        'Something went wrong getting the dataset reviews. Try again later.'
      )
      expect(result.current.datasetReviews).to.deep.equal([])
    })
  })

  it('should return the default error message when the request fails with a non-Error exception', async () => {
    datasetRepository.getDatasetReviews = cy.stub().rejects('Unexpected error')

    const { result } = renderHook(() =>
      useGetDatasetReviews({
        datasetRepository,
        datasetId
      })
    )

    await waitFor(() => {
      expect(result.current.isLoading).to.equal(false)
      expect(result.current.error).to.equal(
        'Something went wrong getting the dataset reviews. Try again later.'
      )
      expect(result.current.datasetReviews).to.deep.equal([])
    })
  })
})

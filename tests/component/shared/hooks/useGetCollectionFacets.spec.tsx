import { act, renderHook } from '@testing-library/react'
import { CollectionFacetMother } from '@tests/component/collection/domain/models/CollectionFacetMother'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionFacets } from '@/shared/hooks/useGetCollectionFacets'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const collectionFacetsMock = CollectionFacetMother.createFacets()

describe('useGetCollectionFacets', () => {
  it('should return collection facets correctly', async () => {
    collectionRepository.getFacets = cy.stub().resolves(collectionFacetsMock)

    const { result } = renderHook(() =>
      useGetCollectionFacets({
        collectionRepository,
        collectionId: 'collectionId'
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.collectionFacets).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.collectionFacets).to.deep.equal(collectionFacetsMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      collectionRepository.getFacets = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetCollectionFacets({
          collectionRepository,
          collectionId: 'collectionId'
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal('Error message')
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      collectionRepository.getFacets = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetCollectionFacets({
          collectionRepository,
          collectionId: 'collectionId'
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the facets for the collection. Try again later.'
        )
      })
    })
  })
})

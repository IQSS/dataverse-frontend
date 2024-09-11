import { act, renderHook } from '@testing-library/react'
import { useGetCollectionFacets } from '../../../../src/sections/create-collection/useGetCollectionFacets'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionFacetMother } from '../../collection/domain/models/CollectionFacetMother'
import { ROOT_COLLECTION_ALIAS } from '../../../../src/collection/domain/models/Collection'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const collectionFacetsMock = CollectionFacetMother.createFacets()

describe('useGetCollectionFacets', () => {
  it('should return collection facets correctly', async () => {
    collectionRepository.getFacets = cy.stub().resolves(collectionFacetsMock)

    const { result } = renderHook(() =>
      useGetCollectionFacets({
        collectionRepository,
        collectionId: ROOT_COLLECTION_ALIAS
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
          collectionId: ROOT_COLLECTION_ALIAS
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
          collectionId: ROOT_COLLECTION_ALIAS
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

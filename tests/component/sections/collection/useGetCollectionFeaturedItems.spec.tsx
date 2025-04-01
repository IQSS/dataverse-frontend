import { act, renderHook } from '@testing-library/react'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { useGetCollectionFeaturedItems } from '@/sections/collection/useGetCollectionFeaturedItems'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const featuredItemsMock = CollectionFeaturedItemMother.createFeaturedItems()

describe('useGetCollectionUserPermissions', () => {
  it('should return collection featured items correctly', async () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves(featuredItemsMock)

    const { result } = renderHook(() => useGetCollectionFeaturedItems(collectionRepository))

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.collectionFeaturedItems).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.collectionFeaturedItems).to.deep.equal(featuredItemsMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      collectionRepository.getFeaturedItems = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() => useGetCollectionFeaturedItems(collectionRepository))

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
      collectionRepository.getFeaturedItems = cy.stub().rejects('Error message')

      const { result } = renderHook(() => useGetCollectionFeaturedItems(collectionRepository))

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the featured items of this collection. Try again later.'
        )
      })
    })
  })
})

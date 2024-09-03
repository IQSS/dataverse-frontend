import { act, renderHook } from '@testing-library/react'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { useGetCollectionUserPermissions } from '../../../../src/shared/hooks/useGetCollectionUserPermissions'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const userPermissionsMock = CollectionMother.createUserPermissions()

describe('useGetAllMetadataBlocksInfo', () => {
  it('should return userCollectionPermissions correctly', async () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)

    const { result } = renderHook(() =>
      useGetCollectionUserPermissions({
        collectionRepository,
        collectionIdOrAlias: 'root'
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.collectionUserPermissions).to.deep.equal(null)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.collectionUserPermissions).to.deep.equal(userPermissionsMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      collectionRepository.getUserPermissions = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetCollectionUserPermissions({
          collectionRepository,
          collectionIdOrAlias: 'root'
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
      collectionRepository.getUserPermissions = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetCollectionUserPermissions({
          collectionRepository,
          collectionIdOrAlias: 'root'
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the user permissions on this collection. Try again later.'
        )
      })
    })
  })
})

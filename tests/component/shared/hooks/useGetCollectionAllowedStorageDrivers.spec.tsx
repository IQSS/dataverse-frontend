import { renderHook, waitFor } from '@testing-library/react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionAllowedStorageDrivers } from '@/shared/hooks/useGetCollectionAllowedStorageDrivers'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const allowedStorageDriversMock = {
  s3: 's3',
  swift: 'Swift'
}

describe('useGetCollectionAllowedStorageDrivers', () => {
  it('should return allowed storage drivers correctly', async () => {
    collectionRepository.getAllowedStorageDrivers = cy.stub().resolves(allowedStorageDriversMock)

    const { result } = renderHook(() =>
      useGetCollectionAllowedStorageDrivers({
        collectionRepository,
        collectionIdOrAlias: 'root'
      })
    )

    expect(result.current.isLoading).to.deep.equal(true)
    expect(result.current.allowedStorageDrivers).to.deep.equal({})

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.allowedStorageDrivers).to.deep.equal(allowedStorageDriversMock)
    })
  })

  it('should not fetch allowed storage drivers when disabled', () => {
    const getAllowedStorageDrivers = cy.stub().as('getAllowedStorageDrivers')
    collectionRepository.getAllowedStorageDrivers = getAllowedStorageDrivers

    const { result } = renderHook(() =>
      useGetCollectionAllowedStorageDrivers({
        collectionRepository,
        collectionIdOrAlias: 'root',
        enabled: false
      })
    )

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.allowedStorageDrivers).to.deep.equal({})
    expect(result.current.error).to.deep.equal(null)
    expect(getAllowedStorageDrivers).not.to.have.been.called
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      collectionRepository.getAllowedStorageDrivers = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetCollectionAllowedStorageDrivers({
          collectionRepository,
          collectionIdOrAlias: 'root'
        })
      )

      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)

      await waitFor(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        expect(result.current.error).to.deep.equal('Error message')
      })
    })

    it('should return correct error message when there is not an error type catched', async () => {
      collectionRepository.getAllowedStorageDrivers = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetCollectionAllowedStorageDrivers({
          collectionRepository,
          collectionIdOrAlias: 'root'
        })
      )

      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)

      await waitFor(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        expect(result.current.error).to.deep.equal(
          'Something went wrong getting the allowed storage drivers for this collection. Try again later.'
        )
      })
    })
  })
})

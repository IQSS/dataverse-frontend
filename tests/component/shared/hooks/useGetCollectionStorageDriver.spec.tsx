import { renderHook, waitFor } from '@testing-library/react'
import { StorageDriver } from '@/collection/domain/models/StorageDriver'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { useGetCollectionStorageDriver } from '@/shared/hooks/useGetCollectionStorageDriver'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const storageDriverMock: StorageDriver = {
  name: 's3',
  type: 's3',
  label: 's3',
  directUpload: true,
  directDownload: true,
  uploadOutOfBand: false
}

describe('useGetCollectionStorageDriver', () => {
  it('should return storage driver correctly', async () => {
    const getStorageDriver = cy.stub().as('getStorageDriver').resolves(storageDriverMock)
    collectionRepository.getStorageDriver = getStorageDriver

    const { result } = renderHook(() =>
      useGetCollectionStorageDriver({
        collectionRepository,
        collectionIdOrAlias: 'root',
        getEffective: true
      })
    )

    expect(result.current.isLoading).to.deep.equal(true)
    expect(result.current.storageDriver).to.deep.equal(null)

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.storageDriver).to.deep.equal(storageDriverMock)
      expect(getStorageDriver).to.have.been.calledWith('root', true)
    })
  })

  it('should return null when storage driver is undefined', async () => {
    collectionRepository.getStorageDriver = cy.stub().resolves(undefined)

    const { result } = renderHook(() =>
      useGetCollectionStorageDriver({
        collectionRepository,
        collectionIdOrAlias: 'root',
        getEffective: false
      })
    )

    expect(result.current.isLoading).to.deep.equal(true)
    expect(result.current.storageDriver).to.deep.equal(null)

    await waitFor(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      expect(result.current.storageDriver).to.deep.equal(null)
    })
  })

  it('should not fetch storage driver when disabled', () => {
    const getStorageDriver = cy.stub().as('getStorageDriver')
    collectionRepository.getStorageDriver = getStorageDriver

    const { result } = renderHook(() =>
      useGetCollectionStorageDriver({
        collectionRepository,
        collectionIdOrAlias: 'root',
        enabled: false
      })
    )

    expect(result.current.isLoading).to.deep.equal(false)
    expect(result.current.storageDriver).to.deep.equal(null)
    expect(result.current.error).to.deep.equal(null)
    expect(getStorageDriver).not.to.have.been.called
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      collectionRepository.getStorageDriver = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetCollectionStorageDriver({
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
      collectionRepository.getStorageDriver = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetCollectionStorageDriver({
          collectionRepository,
          collectionIdOrAlias: 'root'
        })
      )

      expect(result.current.isLoading).to.deep.equal(true)
      expect(result.current.error).to.deep.equal(null)

      await waitFor(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        expect(result.current.error).to.deep.equal(
          'Something went wrong getting the storage driver for this collection. Try again later.'
        )
      })
    })
  })
})

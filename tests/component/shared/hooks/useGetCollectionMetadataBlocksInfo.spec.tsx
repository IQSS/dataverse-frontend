import { act, renderHook } from '@testing-library/react'
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { useGetCollectionMetadataBlocksInfo } from '@/shared/hooks/useGetCollectionMetadataBlocksInfo'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const metadataBlocksInfoMock = MetadataBlockInfoMother.getAllBlocks()

describe('useGetCollectionMetadataBlocksInfo', () => {
  it('should return metadataBlockDisplayFormatInfo correctly', async () => {
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(metadataBlocksInfoMock)

    const { result } = renderHook(() =>
      useGetCollectionMetadataBlocksInfo({
        collectionId: 'collectionId',
        metadataBlockInfoRepository
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.metadataBlocksInfo).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.metadataBlocksInfo).to.deep.equal(metadataBlocksInfoMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      metadataBlockInfoRepository.getByCollectionId = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetCollectionMetadataBlocksInfo({
          collectionId: 'collectionId',
          metadataBlockInfoRepository
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
      metadataBlockInfoRepository.getByCollectionId = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetCollectionMetadataBlocksInfo({
          collectionId: 'collectionId',
          metadataBlockInfoRepository
        })
      )

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(true)
        return expect(result.current.error).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoading).to.deep.equal(false)
        return expect(result.current.error).to.deep.equal(
          'Something went wrong getting the information from the metadata blocks. Try again later.'
        )
      })
    })
  })
})

import { act, renderHook } from '@testing-library/react'
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { useGetAllMetadataBlocksInfo } from '@/shared/hooks/useGetAllMetadataBlocksInfo'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const allMetadataBlocksInfoMock = MetadataBlockInfoMother.getAllBlocks()

describe('useGetAllMetadataBlocksInfo', () => {
  it('should return metadataBlockDisplayFormatInfo correctly', async () => {
    metadataBlockInfoRepository.getAll = cy.stub().resolves(allMetadataBlocksInfoMock)

    const { result } = renderHook(() =>
      useGetAllMetadataBlocksInfo({
        metadataBlockInfoRepository
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.allMetadataBlocksInfo).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      const allMetadataBlocksInfoNormalized =
        MetadataFieldsHelper.replaceMetadataBlocksInfoDotNamesKeysWithSlash(
          allMetadataBlocksInfoMock
        )

      return expect(result.current.allMetadataBlocksInfo).to.deep.equal(
        allMetadataBlocksInfoNormalized
      )
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      metadataBlockInfoRepository.getAll = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetAllMetadataBlocksInfo({
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
      metadataBlockInfoRepository.getAll = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetAllMetadataBlocksInfo({
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

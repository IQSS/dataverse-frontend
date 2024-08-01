import { act, renderHook } from '@testing-library/react'
import { useGetMetadataBlockDisplayFormatInfo } from '../../../../src/sections/dataset/useGetMetadataBlockDisplayFormatInfo'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { MetadataBlockName } from '../../../../src/dataset/domain/models/Dataset'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const metadataBlockInfoMock = MetadataBlockInfoMother.create()

describe('useGetMetadataBlockDisplayFormatInfo', () => {
  beforeEach(() => {
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)
  })
  it('should return metadataBlockDisplayFormatInfo correctly', async () => {
    const { result } = renderHook(() =>
      useGetMetadataBlockDisplayFormatInfo({
        metadataBlockName: MetadataBlockName.CITATION,
        metadataBlockInfoRepository
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.metadataBlockDisplayFormatInfo).to.deep.equal(undefined)
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)
      return expect(result.current.metadataBlockDisplayFormatInfo).to.deep.equal(
        metadataBlockInfoMock
      )
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      metadataBlockInfoRepository.getByName = cy.stub().rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetMetadataBlockDisplayFormatInfo({
          metadataBlockName: MetadataBlockName.CITATION,
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
      metadataBlockInfoRepository.getByName = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetMetadataBlockDisplayFormatInfo({
          metadataBlockName: MetadataBlockName.CITATION,
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
          'There was an error getting the metadata block info by name'
        )
      })
    })
  })
})

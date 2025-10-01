import { act, renderHook } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { useGetAvailableDatasetMetadataExportFormats } from '@/info/domain/hooks/useGetAvailableDatasetMetadataExportFormats'
import { DatasetMetadataExportFormatsMother } from '../models/DatasetMetadataExportFormatsMother'

const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
const availableDsMetadataExportFormats = DatasetMetadataExportFormatsMother.create()

describe('useGetAvailableDatasetMetadataExportFormats', () => {
  it('should return availables dataset metadata export formats', async () => {
    dataverseInfoRepository.getAvailableDatasetMetadataExportFormats = cy
      .stub()
      .resolves(availableDsMetadataExportFormats)

    const { result } = renderHook(() =>
      useGetAvailableDatasetMetadataExportFormats({
        dataverseInfoRepository
      })
    )

    await act(() => {
      expect(result.current.isLoadingExportFormats).to.deep.equal(true)
      return expect(result.current.datasetMetadataExportFormats).to.deep.equal(null)
    })

    await act(() => {
      expect(result.current.isLoadingExportFormats).to.deep.equal(false)

      return expect(result.current.datasetMetadataExportFormats).to.deep.equal(
        availableDsMetadataExportFormats
      )
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when it is a ReadError instance from js-dataverse', async () => {
      dataverseInfoRepository.getAvailableDatasetMetadataExportFormats = cy
        .stub()
        .rejects(new ReadError('Error message'))

      const { result } = renderHook(() =>
        useGetAvailableDatasetMetadataExportFormats({
          dataverseInfoRepository
        })
      )

      await act(() => {
        expect(result.current.isLoadingExportFormats).to.deep.equal(true)
        return expect(result.current.errorGetExportFormats).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingExportFormats).to.deep.equal(false)
        return expect(result.current.errorGetExportFormats).to.deep.equal('Error message')
      })
    })

    it('should return correct default error message when it is not a ReadError instance from js-dataverse', async () => {
      dataverseInfoRepository.getAvailableDatasetMetadataExportFormats = cy
        .stub()
        .rejects('Error message')

      const { result } = renderHook(() =>
        useGetAvailableDatasetMetadataExportFormats({
          dataverseInfoRepository
        })
      )

      await act(() => {
        expect(result.current.isLoadingExportFormats).to.deep.equal(true)
        return expect(result.current.errorGetExportFormats).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingExportFormats).to.deep.equal(false)
        return expect(result.current.errorGetExportFormats).to.deep.equal(
          'Something went wrong getting the dataset export formats. Try again later.'
        )
      })
    })
  })
})

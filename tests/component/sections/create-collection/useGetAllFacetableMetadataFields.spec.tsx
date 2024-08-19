import { act, renderHook } from '@testing-library/react'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { useGetAllFacetableMetadataFields } from '../../../../src/sections/create-collection/useGetAllFacetableMetadataFields'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const allFacetableMetadataFieldsMock = MetadataBlockInfoMother.createFacetableMetadataFields()

describe('useGetAllFacetableMetadataFields', () => {
  it('should return all facetable metadata fields correctly', async () => {
    metadataBlockInfoRepository.getAllFacetableMetadataFields = cy
      .stub()
      .resolves(allFacetableMetadataFieldsMock)

    const { result } = renderHook(() =>
      useGetAllFacetableMetadataFields({
        metadataBlockInfoRepository
      })
    )

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(true)
      return expect(result.current.facetableMetadataFields).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoading).to.deep.equal(false)

      return expect(result.current.facetableMetadataFields).to.deep.equal(
        allFacetableMetadataFieldsMock
      )
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when there is an error type catched', async () => {
      metadataBlockInfoRepository.getAllFacetableMetadataFields = cy
        .stub()
        .rejects(new Error('Error message'))

      const { result } = renderHook(() =>
        useGetAllFacetableMetadataFields({
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
      metadataBlockInfoRepository.getAllFacetableMetadataFields = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetAllFacetableMetadataFields({
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
          'Something went wrong getting all the facetable metadata fields. Try again later.'
        )
      })
    })
  })
})

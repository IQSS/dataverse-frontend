import { act, renderHook } from '@testing-library/react'
import { DatasetTemplateMother } from '../models/DatasetTemplateMother'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useGetDatasetTemplates } from '@/dataset/domain/hooks/useGetDatasetTemplates'
import { ReadError } from '@iqss/dataverse-client-javascript'

const templateRepository: TemplateRepository = {} as TemplateRepository
const datasetTemplatesMock = DatasetTemplateMother.createMany(3)

describe('useGetDatasetTemplates', () => {
  it('should return dataset templates', async () => {
    templateRepository.getDatasetTemplates = cy.stub().resolves(datasetTemplatesMock)

    const { result } = renderHook(() =>
      useGetDatasetTemplates({
        templateRepository,
        collectionIdOrAlias: 'collection-alias'
      })
    )

    await act(() => {
      expect(result.current.isLoadingDatasetTemplates).to.deep.equal(true)
      return expect(result.current.datasetTemplates).to.deep.equal([])
    })

    await act(() => {
      expect(result.current.isLoadingDatasetTemplates).to.deep.equal(false)

      return expect(result.current.datasetTemplates).to.deep.equal(datasetTemplatesMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when it is a ReadError instance from js-dataverse', async () => {
      templateRepository.getDatasetTemplates = cy.stub().rejects(new ReadError('Error message'))

      const { result } = renderHook(() =>
        useGetDatasetTemplates({
          templateRepository,
          collectionIdOrAlias: 'collection-alias'
        })
      )

      await act(() => {
        expect(result.current.isLoadingDatasetTemplates).to.deep.equal(true)
        return expect(result.current.errorGetDatasetTemplates).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingDatasetTemplates).to.deep.equal(false)
        return expect(result.current.errorGetDatasetTemplates).to.deep.equal('Error message')
      })
    })

    it('should return correct default error message when it is not a ReadError instance from js-dataverse', async () => {
      templateRepository.getDatasetTemplates = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetDatasetTemplates({
          templateRepository,
          collectionIdOrAlias: 'collection-alias'
        })
      )

      await act(() => {
        expect(result.current.isLoadingDatasetTemplates).to.deep.equal(true)
        return expect(result.current.errorGetDatasetTemplates).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingDatasetTemplates).to.deep.equal(false)
        return expect(result.current.errorGetDatasetTemplates).to.deep.equal(
          'Something went wrong getting the dataset templates. Try again later.'
        )
      })
    })
  })
})

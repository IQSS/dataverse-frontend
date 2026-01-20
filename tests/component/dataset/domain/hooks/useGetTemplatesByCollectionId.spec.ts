import { act, renderHook } from '@testing-library/react'
import { TemplateMother } from '../../../sections/templates/TemplateMother'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useGetTemplatesByCollectionId } from '@/templates/domain/hooks/useGetTemplatesByCollectionId'
import { ReadError } from '@iqss/dataverse-client-javascript'

const templateRepository: TemplateRepository = {} as TemplateRepository
const datasetTemplatesMock = TemplateMother.createMany(3)

describe('useGetTemplatesByCollectionId', () => {
  it('should return dataset templates', async () => {
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves(datasetTemplatesMock)

    const { result } = renderHook(() =>
      useGetTemplatesByCollectionId({
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
      templateRepository.getTemplatesByCollectionId = cy
        .stub()
        .rejects(new ReadError('Error message'))

      const { result } = renderHook(() =>
        useGetTemplatesByCollectionId({
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
      templateRepository.getTemplatesByCollectionId = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetTemplatesByCollectionId({
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

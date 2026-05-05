import { act, renderHook } from '@testing-library/react'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useGetTemplate } from '@/templates/domain/hooks/useGetTemplate'
import { TemplateMother } from './TemplateMother'
import { ReadError } from '@iqss/dataverse-client-javascript'

const templateRepository: TemplateRepository = {} as TemplateRepository
const templateMock = TemplateMother.create({ id: 1, name: 'Template One' })

describe('useGetTemplate', () => {
  it('should return the template', async () => {
    templateRepository.getTemplate = cy.stub().resolves(templateMock)

    const { result } = renderHook(() =>
      useGetTemplate({
        templateRepository,
        templateId: 1
      })
    )

    await act(() => {
      expect(result.current.isLoadingTemplate).to.deep.equal(true)
      return expect(result.current.template).to.deep.equal(null)
    })

    await act(() => {
      expect(result.current.isLoadingTemplate).to.deep.equal(false)
      return expect(result.current.template).to.deep.equal(templateMock)
    })
  })

  it('should allow manual fetch when autoFetch is false', async () => {
    templateRepository.getTemplate = cy.stub().resolves(templateMock)

    const { result } = renderHook(() =>
      useGetTemplate({
        templateRepository,
        templateId: 1,
        autoFetch: false
      })
    )

    await act(() => {
      expect(result.current.isLoadingTemplate).to.deep.equal(false)
      return expect(result.current.template).to.deep.equal(null)
    })

    await act(() => result.current.fetchTemplate())

    await act(() => {
      expect(result.current.isLoadingTemplate).to.deep.equal(false)
      return expect(result.current.template).to.deep.equal(templateMock)
    })
  })

  describe('Error handling', () => {
    it('should return correct error message when it is a ReadError instance', async () => {
      templateRepository.getTemplate = cy.stub().rejects(new ReadError('Error message'))

      const { result } = renderHook(() =>
        useGetTemplate({
          templateRepository,
          templateId: 1
        })
      )

      await act(() => {
        expect(result.current.isLoadingTemplate).to.deep.equal(true)
        return expect(result.current.errorGetTemplate).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingTemplate).to.deep.equal(false)
        return expect(result.current.errorGetTemplate).to.deep.equal('Error message')
      })
    })

    it('should return correct default error message when it is not a ReadError instance', async () => {
      templateRepository.getTemplate = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetTemplate({
          templateRepository,
          templateId: 1
        })
      )

      await act(() => {
        expect(result.current.isLoadingTemplate).to.deep.equal(true)
        return expect(result.current.errorGetTemplate).to.deep.equal(null)
      })

      await act(() => {
        expect(result.current.isLoadingTemplate).to.deep.equal(false)
        return expect(result.current.errorGetTemplate).to.deep.equal(
          'Something went wrong getting the template. Try again later.'
        )
      })
    })
  })
})

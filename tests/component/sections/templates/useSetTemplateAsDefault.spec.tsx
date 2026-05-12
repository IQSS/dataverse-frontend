import { renderHook, act, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { toast } from 'react-toastify'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { useSetTemplateAsDefault } from '@/sections/templates/useSetTemplateAsDefault'

describe('useSetTemplateAsDefault', () => {
  let templateRepository: TemplateRepository
  const collectionId = 'test-collection'

  beforeEach(() => {
    templateRepository = {} as TemplateRepository
    cy.stub(toast, 'success')
    cy.stub(toast, 'error')
  })

  it('should initialize with default state', async () => {
    const { result } = renderHook(() =>
      useSetTemplateAsDefault({ collectionId, templateRepository })
    )

    await waitFor(() => {
      expect(result.current.isSettingDefault).to.deep.equal(false)
      expect(typeof result.current.handleSetTemplateAsDefault).to.deep.equal('function')
      expect(typeof result.current.handleUnsetTemplateAsDefault).to.deep.equal('function')
    })
  })

  describe('handleSetTemplateAsDefault', () => {
    it('should successfully set template as default', async () => {
      templateRepository.setTemplateAsDefault = cy.stub().resolves()

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      let success: boolean | undefined

      await act(async () => {
        success = await result.current.handleSetTemplateAsDefault(123)
      })

      expect(success).to.equal(true)
      expect(templateRepository.setTemplateAsDefault).to.have.been.calledWith(123, collectionId)
      expect(toast.success).to.have.been.calledOnce
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })

    it('should handle WriteError and show the reason', async () => {
      templateRepository.setTemplateAsDefault = cy
        .stub()
        .rejects(new WriteError('Permission denied'))

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      let success: boolean | undefined

      await act(async () => {
        success = await result.current.handleSetTemplateAsDefault(123)
      })

      expect(success).to.equal(false)
      expect(toast.error).to.have.been.calledWith('Permission denied')
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })

    it('should handle WriteError and fall back to the error message when no reason is present', async () => {
      const error = new WriteError()

      templateRepository.setTemplateAsDefault = cy.stub().rejects(error)

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      await act(async () => {
        await result.current.handleSetTemplateAsDefault(123)
      })

      expect(toast.error).to.have.been.calledWith(error.message)
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })

    it('should handle unknown errors and show generic error toast', async () => {
      templateRepository.setTemplateAsDefault = cy.stub().rejects(new Error('Network error'))

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      await act(async () => {
        await result.current.handleSetTemplateAsDefault(123)
      })

      expect(toast.error).to.have.been.calledOnce
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })
  })

  describe('handleUnsetTemplateAsDefault', () => {
    it('should successfully unset template as default', async () => {
      templateRepository.unsetTemplateAsDefault = cy.stub().resolves()

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      let success: boolean | undefined

      await act(async () => {
        success = await result.current.handleUnsetTemplateAsDefault()
      })

      expect(success).to.equal(true)
      expect(templateRepository.unsetTemplateAsDefault).to.have.been.calledWith(collectionId)
      expect(toast.success).to.have.been.calledOnce
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })

    it('should handle WriteError and show the reason', async () => {
      templateRepository.unsetTemplateAsDefault = cy
        .stub()
        .rejects(new WriteError('Not authorized'))

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      let success: boolean | undefined

      await act(async () => {
        success = await result.current.handleUnsetTemplateAsDefault()
      })

      expect(success).to.equal(false)
      expect(toast.error).to.have.been.calledWith('Not authorized')
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })

    it('should handle unknown errors and show generic error toast', async () => {
      templateRepository.unsetTemplateAsDefault = cy.stub().rejects(new Error('Network error'))

      const { result } = renderHook(() =>
        useSetTemplateAsDefault({ collectionId, templateRepository })
      )

      await act(async () => {
        await result.current.handleUnsetTemplateAsDefault()
      })

      expect(toast.error).to.have.been.calledOnce
      expect(result.current.isSettingDefault).to.deep.equal(false)
    })
  })
})

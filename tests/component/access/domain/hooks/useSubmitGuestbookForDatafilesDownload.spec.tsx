import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import {
  AccessRepository,
  GuestbookResponseAnswer
} from '@/access/domain/repositories/AccessRepository'
import { useSubmitGuestbookForDatafilesDownload } from '@/access/hooks/useSubmitGuestbookForDatafilesDownload'
import i18next from '@/i18n'

const accessRepository: AccessRepository = {} as AccessRepository
const answersMock: GuestbookResponseAnswer[] = [{ id: 123, value: 'Good' }]
const fileIdsMock: Array<number | string> = [10, 11]

describe('useSubmitGuestbookForDatafilesDownload', () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
  )

  it('should submit guestbook answers for multiple files and return signed url', async () => {
    accessRepository.submitGuestbookForDatafilesDownload = cy
      .stub()
      .resolves('signed-url-datafiles')

    const { result } = renderHook(
      () => useSubmitGuestbookForDatafilesDownload({ accessRepository }),
      { wrapper }
    )
    await waitFor(() => {
      expect(result.current).to.not.deep.equal(null)
      expect(typeof result.current.handleSubmitGuestbookForDatafilesDownload).to.deep.equal(
        'function'
      )
    })

    await act(async () => {
      const signedUrl = await result.current.handleSubmitGuestbookForDatafilesDownload(
        fileIdsMock,
        answersMock
      )
      expect(signedUrl).to.deep.equal('signed-url-datafiles')
    })

    expect(accessRepository.submitGuestbookForDatafilesDownload).to.have.been.calledWith(
      fileIdsMock,
      answersMock
    )
    expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
    expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
  })

  describe('Error handling', () => {
    it('should set fallback translated error on unknown error', async () => {
      accessRepository.submitGuestbookForDatafilesDownload = cy.stub().rejects(new Error('unknown'))
      accessRepository.submitGuestbookForDatafileDownload = cy.stub().resolves('unused')

      const { result } = renderHook(
        () => useSubmitGuestbookForDatafilesDownload({ accessRepository }),
        { wrapper }
      )
      await waitFor(() => {
        expect(result.current).to.not.deep.equal(null)
        expect(typeof result.current.handleSubmitGuestbookForDatafilesDownload).to.deep.equal(
          'function'
        )
      })

      await act(async () => {
        await result.current.handleSubmitGuestbookForDatafilesDownload(fileIdsMock, answersMock)
      })

      expect(result.current.errorSubmitGuestbook).to.deep.equal(
        'Something went wrong submitting guestbook responses. Try again later.'
      )
      expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
    })

    it('should set write error message when a WriteError is thrown', async () => {
      accessRepository.submitGuestbookForDatafilesDownload = cy.stub().rejects(new WriteError())
      accessRepository.submitGuestbookForDatafileDownload = cy.stub().resolves('unused')

      const { result } = renderHook(
        () => useSubmitGuestbookForDatafilesDownload({ accessRepository }),
        { wrapper }
      )
      await waitFor(() => {
        expect(result.current).to.not.deep.equal(null)
        expect(typeof result.current.handleSubmitGuestbookForDatafilesDownload).to.deep.equal(
          'function'
        )
      })

      await act(async () => {
        await result.current.handleSubmitGuestbookForDatafilesDownload(fileIdsMock, answersMock)
      })

      expect(result.current.errorSubmitGuestbook).to.be.a('string')
      expect(result.current.errorSubmitGuestbook).to.not.deep.equal(null)
      expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
    })
  })
})

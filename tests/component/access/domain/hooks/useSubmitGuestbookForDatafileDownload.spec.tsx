import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import {
  AccessRepository,
  GuestbookResponseAnswer
} from '@/access/domain/repositories/AccessRepository'
import { useSubmitGuestbookForDatafileDownload } from '@/access/hooks/useSubmitGuestbookForDatafileDownload'
import i18next from '@/i18n'

const accessRepository: AccessRepository = {} as AccessRepository
const answersMock: GuestbookResponseAnswer[] = [{ id: 123, value: 'Good' }]

describe('useSubmitGuestbookForDatafileDownload', () => {
  const wrapper = ({ children }: PropsWithChildren) => (
    <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
  )

  it('should submit guestbook answers and return signed url', async () => {
    accessRepository.submitGuestbookForDatafileDownload = cy.stub().resolves('signed-url-datafile')
    accessRepository.submitGuestbookForDatafilesDownload = cy.stub().resolves('unused')

    const { result } = renderHook(
      () => useSubmitGuestbookForDatafileDownload({ accessRepository }),
      { wrapper }
    )
    await waitFor(() => {
      expect(result.current).to.not.deep.equal(null)
      expect(typeof result.current.handleSubmitGuestbookForDatafileDownload).to.deep.equal(
        'function'
      )
    })

    await act(async () => {
      const signedUrl = await result.current.handleSubmitGuestbookForDatafileDownload(
        10,
        answersMock
      )
      expect(signedUrl).to.deep.equal('signed-url-datafile')
    })

    expect(accessRepository.submitGuestbookForDatafileDownload).to.have.been.calledWith(
      10,
      answersMock
    )
    expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
    expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
  })

  describe('Error handling', () => {
    it('should set fallback translated error on unknown error', async () => {
      accessRepository.submitGuestbookForDatafileDownload = cy.stub().rejects(new Error('unknown'))

      const { result } = renderHook(
        () => useSubmitGuestbookForDatafileDownload({ accessRepository }),
        { wrapper }
      )
      await waitFor(() => {
        expect(result.current).to.not.deep.equal(null)
        expect(typeof result.current.handleSubmitGuestbookForDatafileDownload).to.deep.equal(
          'function'
        )
      })

      await act(async () => {
        await result.current.handleSubmitGuestbookForDatafileDownload(10, answersMock)
      })

      expect(result.current.errorSubmitGuestbook).to.deep.equal(
        'Something went wrong submitting guestbook responses. Try again later.'
      )
      expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
    })

    it('should set write error message when a WriteError is thrown', async () => {
      accessRepository.submitGuestbookForDatafileDownload = cy.stub().rejects(new WriteError())
      accessRepository.submitGuestbookForDatafilesDownload = cy.stub().resolves('unused')

      const { result } = renderHook(
        () => useSubmitGuestbookForDatafileDownload({ accessRepository }),
        { wrapper }
      )
      await waitFor(() => {
        expect(result.current).to.not.deep.equal(null)
        expect(typeof result.current.handleSubmitGuestbookForDatafileDownload).to.deep.equal(
          'function'
        )
      })

      await act(async () => {
        await result.current.handleSubmitGuestbookForDatafileDownload(10, answersMock)
      })

      expect(result.current.errorSubmitGuestbook).to.be.a('string')
      expect(result.current.errorSubmitGuestbook).to.not.deep.equal(null)
      expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
    })
  })
})

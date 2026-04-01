import { ReadError } from '@iqss/dataverse-client-javascript'
import { renderHook, waitFor } from '@testing-library/react'
import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import { createGuestbookRepositoryStub } from '@/../tests/component/sections/guestbooks/createGuestbookRepositoryStub'

const guestbook: Guestbook = {
  id: 10,
  name: 'Guestbook Test',
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 1
}

const TranslationPreloader = ({ children }: { children: ReactNode }) => {
  useTranslation('guestbooks')

  return <>{children}</>
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={null}>
    <TranslationPreloader>{children}</TranslationPreloader>
  </Suspense>
)

describe('useGetGuestbookById', () => {
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    guestbookRepository = createGuestbookRepositoryStub()
  })

  it('should return guestbook', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result } = renderHook(
      () => useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
      expect(result.current.guestbook).to.deep.equal(guestbook)
    })

    expect(guestbookRepository.getGuestbook).to.have.been.calledOnceWith(guestbook.id)
  })

  it('should not fetch guestbook when guestbookId is undefined', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result } = renderHook(
      () => useGetGuestbookById({ guestbookRepository, guestbookId: undefined }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
    })

    expect(guestbookRepository.getGuestbook).to.not.have.been.called
  })

  it('should not fetch guestbook when disabled', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result } = renderHook(
      () => useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id, enabled: false }),
      { wrapper }
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
      expect(result.current.guestbook).to.deep.equal(undefined)
    })

    expect(guestbookRepository.getGuestbook).to.not.have.been.called
  })

  it('should fetch guestbook after being enabled', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result, rerender } = renderHook(
      ({ enabled }: { enabled: boolean }) =>
        useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id, enabled }),
      {
        initialProps: { enabled: false },
        wrapper
      }
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.guestbook).to.deep.equal(undefined)
    })

    expect(guestbookRepository.getGuestbook).to.not.have.been.called

    rerender({ enabled: true })

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
      expect(result.current.guestbook).to.deep.equal(guestbook)
    })

    expect(guestbookRepository.getGuestbook).to.have.been.calledOnceWith(guestbook.id)
  })

  describe('Error handling', () => {
    it('should return correct error message when it is a ReadError instance from js-dataverse', async () => {
      guestbookRepository.getGuestbook = cy.stub().rejects(new ReadError('Error message'))

      const { result } = renderHook(
        () => useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoadingGuestbook).to.deep.equal(false)
        expect(result.current.guestbook).to.deep.equal(undefined)
        expect(result.current.errorGetGuestbook).to.deep.equal('Error message')
      })
    })

    it('should return correct default error message when it is not a ReadError instance from js-dataverse', async () => {
      guestbookRepository.getGuestbook = cy.stub().rejects('Error message')

      const { result } = renderHook(
        () => useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id }),
        { wrapper }
      )

      await waitFor(() => {
        expect(result.current.isLoadingGuestbook).to.deep.equal(false)
        expect(result.current.guestbook).to.deep.equal(undefined)
        expect(result.current.errorGetGuestbook).to.deep.equal(
          'Something went wrong getting the guestbook. Try again later.'
        )
      })
    })
  })
})

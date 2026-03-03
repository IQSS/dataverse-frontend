import { ReadError } from '@iqss/dataverse-client-javascript'
import { renderHook, waitFor } from '@testing-library/react'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useGetGuestbookById } from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'

const guestbookRepository: GuestbookRepository = {} as GuestbookRepository
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

describe('useGetGuestbookById', () => {
  it('should return guestbook', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result } = renderHook(() =>
      useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id })
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
      expect(result.current.guestbook).to.deep.equal(guestbook)
    })

    cy.wrap(guestbookRepository.getGuestbook).should('have.been.calledOnceWith', guestbook.id)
  })

  it('should not fetch guestbook when guestbookId is undefined', async () => {
    guestbookRepository.getGuestbook = cy.stub().resolves(guestbook)

    const { result } = renderHook(() =>
      useGetGuestbookById({ guestbookRepository, guestbookId: undefined })
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbook).to.deep.equal(false)
      expect(result.current.errorGetGuestbook).to.deep.equal(null)
    })

    cy.wrap(guestbookRepository.getGuestbook).should('not.have.been.called')
  })

  describe('Error handling', () => {
    it('should return correct error message when it is a ReadError instance from js-dataverse', async () => {
      guestbookRepository.getGuestbook = cy.stub().rejects(new ReadError('Error message'))

      const { result } = renderHook(() =>
        useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id })
      )

      await waitFor(() => {
        expect(result.current.isLoadingGuestbook).to.deep.equal(false)
        expect(result.current.guestbook).to.deep.equal(undefined)
        expect(result.current.errorGetGuestbook).to.deep.equal('Error message')
      })
    })

    it('should return correct default error message when it is not a ReadError instance from js-dataverse', async () => {
      guestbookRepository.getGuestbook = cy.stub().rejects('Error message')

      const { result } = renderHook(() =>
        useGetGuestbookById({ guestbookRepository, guestbookId: guestbook.id })
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

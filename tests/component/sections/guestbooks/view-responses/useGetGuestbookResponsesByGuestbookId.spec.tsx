import { act, renderHook, waitFor } from '@testing-library/react'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { EventType, GuestbookResponse } from '@/guestbooks/domain/models/GuestbookResponse'
import { GuestbookResponseSubset } from '@/guestbooks/domain/models/GuestbookResponse'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { useGetGuestbookResponsesByGuestbookId } from '@/sections/guestbooks/view-responses/useGetGuestbookResponsesByGuestbookId'
import { createGuestbookRepositoryStub } from '../createGuestbookRepositoryStub'

const guestbookResponse: GuestbookResponse = {
  id: 1,
  dataset: 'Response Dataset',
  datasetPid: 'doi:10.5072/FK2/RESP',
  date: '2026-01-01T00:00:00.000Z',
  type: EventType.DOWNLOAD,
  email: 'user@example.com',
  fileId: 101,
  fileName: 'response.csv',
  userName: 'Guest',
  customQuestions: [{ question: 'Purpose', response: 'Research' }]
}

describe('useGetGuestbookResponsesByGuestbookId', () => {
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    guestbookRepository = createGuestbookRepositoryStub()
  })

  it('returns guestbook responses when request succeeds', async () => {
    const getGuestbookResponsesByGuestbookIdStub =
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    getGuestbookResponsesByGuestbookIdStub.resolves({
      guestbookResponses: [guestbookResponse],
      totalGuestbookResponseCount: 1
    })

    const { result } = renderHook(() =>
      useGetGuestbookResponsesByGuestbookId({
        guestbookRepository,
        guestbookId: 10,
        limit: 10,
        offset: 0
      })
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbookResponses).to.deep.equal(false)
      expect(result.current.errorGetGuestbookResponses).to.deep.equal(null)
      expect(result.current.guestbookResponses).to.deep.equal([guestbookResponse])
      expect(result.current.totalGuestbookResponseCount).to.deep.equal(1)
    })

    cy.wrap(getGuestbookResponsesByGuestbookIdStub).should('have.been.calledOnceWith', 10, 10, 0)
  })

  it('does not fetch when guestbook id is undefined', async () => {
    const getGuestbookResponsesByGuestbookIdStub =
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    getGuestbookResponsesByGuestbookIdStub.resolves({
      guestbookResponses: [guestbookResponse],
      totalGuestbookResponseCount: 1
    })

    const { result } = renderHook(() =>
      useGetGuestbookResponsesByGuestbookId({
        guestbookRepository,
        guestbookId: undefined
      })
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbookResponses).to.deep.equal(false)
      expect(result.current.errorGetGuestbookResponses).to.deep.equal(null)
      expect(result.current.guestbookResponses).to.deep.equal([])
      expect(result.current.totalGuestbookResponseCount).to.deep.equal(0)
    })

    cy.wrap(getGuestbookResponsesByGuestbookIdStub).should('not.have.been.called')
  })

  it('uses empty defaults when response fields are missing', async () => {
    const getGuestbookResponsesByGuestbookIdStub =
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    getGuestbookResponsesByGuestbookIdStub.resolves({} as GuestbookResponseSubset)

    const { result } = renderHook(() =>
      useGetGuestbookResponsesByGuestbookId({
        guestbookRepository,
        guestbookId: 10,
        limit: 5,
        offset: 15
      })
    )

    await waitFor(() => {
      expect(result.current.isLoadingGuestbookResponses).to.deep.equal(false)
      expect(result.current.errorGetGuestbookResponses).to.deep.equal(null)
      expect(result.current.guestbookResponses).to.deep.equal([])
      expect(result.current.totalGuestbookResponseCount).to.deep.equal(0)
    })

    cy.wrap(getGuestbookResponsesByGuestbookIdStub).should('have.been.calledOnceWith', 10, 5, 15)
  })

  it('resets responses and sets formatted message when request fails with ReadError', async () => {
    const getGuestbookResponsesByGuestbookIdStub =
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    getGuestbookResponsesByGuestbookIdStub.onFirstCall().resolves({
      guestbookResponses: [guestbookResponse],
      totalGuestbookResponseCount: 1
    })
    getGuestbookResponsesByGuestbookIdStub
      .onSecondCall()
      .rejects(new ReadError('ReadError message'))

    const { result } = renderHook(() =>
      useGetGuestbookResponsesByGuestbookId({
        guestbookRepository,
        guestbookId: 10
      })
    )

    await waitFor(() => {
      expect(result.current.guestbookResponses).to.deep.equal([guestbookResponse])
      expect(result.current.totalGuestbookResponseCount).to.deep.equal(1)
    })

    await act(async () => {
      await result.current.fetchGuestbookResponses()
    })

    expect(result.current.isLoadingGuestbookResponses).to.deep.equal(false)
    expect(result.current.guestbookResponses).to.deep.equal([])
    expect(result.current.totalGuestbookResponseCount).to.deep.equal(0)
    expect(result.current.errorGetGuestbookResponses).to.deep.equal('ReadError message')
  })

  it('resets responses and sets default message when request fails with non-ReadError', async () => {
    const getGuestbookResponsesByGuestbookIdStub =
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    getGuestbookResponsesByGuestbookIdStub.onFirstCall().resolves({
      guestbookResponses: [guestbookResponse],
      totalGuestbookResponseCount: 1
    })
    getGuestbookResponsesByGuestbookIdStub.onSecondCall().rejects(new Error('unexpected'))

    const { result } = renderHook(() =>
      useGetGuestbookResponsesByGuestbookId({
        guestbookRepository,
        guestbookId: 10
      })
    )

    await waitFor(() => {
      expect(result.current.guestbookResponses).to.deep.equal([guestbookResponse])
      expect(result.current.totalGuestbookResponseCount).to.deep.equal(1)
    })

    await act(async () => {
      await result.current.fetchGuestbookResponses()
    })

    expect(result.current.isLoadingGuestbookResponses).to.deep.equal(false)
    expect(result.current.guestbookResponses).to.deep.equal([])
    expect(result.current.totalGuestbookResponseCount).to.deep.equal(0)
    expect(result.current.errorGetGuestbookResponses).to.deep.equal(
      'Something went wrong getting guestbook responses. Try again later.'
    )
  })
})

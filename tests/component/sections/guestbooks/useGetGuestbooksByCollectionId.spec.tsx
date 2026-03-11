import { act, renderHook, waitFor } from '@testing-library/react'
import { ReadError, getGuestbooksByCollectionId } from '@iqss/dataverse-client-javascript'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { useGetGuestbooksByCollectionId } from '@/sections/guestbooks/useGetGuestbooksByCollectionId'

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

describe('useGetGuestbooksByCollectionId', () => {
  it('returns guestbooks when request succeeds', async () => {
    const executeStub = cy.stub(getGuestbooksByCollectionId, 'execute').resolves([guestbook])

    const { result } = renderHook(() => useGetGuestbooksByCollectionId({ collectionIdOrAlias: 1 }))

    expect(result.current.isLoadingGuestbooksByCollectionId).to.deep.equal(true)
    expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(null)
    expect(result.current.guestbooks).to.deep.equal([])

    await waitFor(() => {
      expect(result.current.isLoadingGuestbooksByCollectionId).to.deep.equal(false)
      expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(null)
      expect(result.current.guestbooks).to.deep.equal([guestbook])
    })

    cy.wrap(executeStub).should('have.been.calledOnceWith', 1)
  })

  it('does not fetch when collection id is undefined', async () => {
    const executeStub = cy.stub(getGuestbooksByCollectionId, 'execute').resolves([guestbook])

    const { result } = renderHook(() =>
      useGetGuestbooksByCollectionId({ collectionIdOrAlias: undefined })
    )

    await act(() => {
      expect(result.current.isLoadingGuestbooksByCollectionId).to.deep.equal(false)
      expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(null)
      return expect(result.current.guestbooks).to.deep.equal([])
    })

    cy.wrap(executeStub).should('not.have.been.called')
  })

  it('resets guestbooks and sets formatted message when request fails with ReadError', async () => {
    const executeStub = cy.stub(getGuestbooksByCollectionId, 'execute')
    executeStub.onFirstCall().resolves([guestbook])
    executeStub.onSecondCall().rejects(new ReadError('ReadError message'))

    const { result } = renderHook(() =>
      useGetGuestbooksByCollectionId({ collectionIdOrAlias: 1, autoFetch: false })
    )

    await act(async () => {
      await result.current.fetchGuestbooksByCollectionId()
    })

    expect(result.current.guestbooks).to.deep.equal([guestbook])
    expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(null)

    await act(async () => {
      await result.current.fetchGuestbooksByCollectionId()
    })

    expect(result.current.guestbooks).to.deep.equal([])
    expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal('ReadError message')
    expect(result.current.isLoadingGuestbooksByCollectionId).to.deep.equal(false)
  })

  it('resets guestbooks and sets default message when request fails with non-ReadError', async () => {
    const executeStub = cy.stub(getGuestbooksByCollectionId, 'execute')
    executeStub.onFirstCall().resolves([guestbook])
    executeStub.onSecondCall().rejects(new Error('unexpected'))

    const { result } = renderHook(() =>
      useGetGuestbooksByCollectionId({ collectionIdOrAlias: 1, autoFetch: false })
    )

    await act(async () => {
      await result.current.fetchGuestbooksByCollectionId()
    })

    expect(result.current.guestbooks).to.deep.equal([guestbook])
    expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(null)

    await act(async () => {
      await result.current.fetchGuestbooksByCollectionId()
    })

    expect(result.current.guestbooks).to.deep.equal([])
    expect(result.current.errorGetGuestbooksByCollectionId).to.deep.equal(
      'Something went wrong getting guestbooks by collection id. Try again later.'
    )
    expect(result.current.isLoadingGuestbooksByCollectionId).to.deep.equal(false)
  })
})

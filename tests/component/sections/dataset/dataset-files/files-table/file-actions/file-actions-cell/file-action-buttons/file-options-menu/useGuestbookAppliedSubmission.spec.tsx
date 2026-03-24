import { act, renderHook, waitFor } from '@testing-library/react'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { useGuestbookCollectSubmission } from '@/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/useGuestbookCollectSubmission'

const accessRepository: AccessRepository = {} as AccessRepository
const guestbookResponse = {
  guestbookResponse: {
    name: 'Test User',
    answers: []
  }
}

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

describe('useGuestbookCollectSubmission', () => {
  beforeEach(() => {
    accessRepository.submitGuestbookForDatasetDownload = cy.stub().resolves('signed-url-dataset')
    accessRepository.submitGuestbookForDatafileDownload = cy.stub().resolves('signed-url-datafile')
    accessRepository.submitGuestbookForDatafilesDownload = cy
      .stub()
      .resolves('signed-url-datafiles')
  })

  it('initializes with default state', async () => {
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose: cy.stub().as('handleClose'),
        accessRepository,
        downloadFromSignedUrl: cy.stub().resolves(undefined)
      })
    )

    await waitFor(() => {
      expect(result.current.hasAttemptedAccept).to.deep.equal(false)
      expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
      expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
      expect(result.current.errorDownloadSignedUrlFile).to.deep.equal(null)
      expect(typeof result.current.handleSubmit).to.deep.equal('function')
      expect(typeof result.current.handleModalClose).to.deep.equal('function')
    })
  })

  it('does not submit when account fields are invalid', async () => {
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().resolves(undefined)
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: true,
        guestbook,
        guestbookResponse
      })
    })

    expect(result.current.hasAttemptedAccept).to.deep.equal(true)
    expect(accessRepository.submitGuestbookForDatasetDownload).to.not.have.been.called
    expect(accessRepository.submitGuestbookForDatafileDownload).to.not.have.been.called
    expect(accessRepository.submitGuestbookForDatafilesDownload).to.not.have.been.called
    expect(downloadFromSignedUrl).to.not.have.been.called
    expect(handleClose).to.not.have.been.called
  })

  it('submits for a single file id and triggers download', async () => {
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().resolves(undefined)
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    expect(accessRepository.submitGuestbookForDatasetDownload).to.not.have.been.called
    expect(accessRepository.submitGuestbookForDatafileDownload).to.have.been.calledWith(
      10,
      guestbookResponse
    )
    expect(accessRepository.submitGuestbookForDatafilesDownload).to.not.have.been.called
    expect(handleClose).to.have.been.calledOnce
    expect(downloadFromSignedUrl).to.have.been.calledOnceWith('signed-url-datafile')
    expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
  })

  it('submits for multiple file ids and triggers download', async () => {
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().resolves(undefined)
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileIds: [10, 11],
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    expect(accessRepository.submitGuestbookForDatasetDownload).to.not.have.been.called
    expect(accessRepository.submitGuestbookForDatafilesDownload).to.have.been.calledWith(
      [10, 11],
      guestbookResponse
    )
    expect(accessRepository.submitGuestbookForDatafileDownload).to.not.have.been.called
    expect(handleClose).to.have.been.calledOnce
    expect(downloadFromSignedUrl).to.have.been.calledOnceWith('signed-url-datafiles')
    expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
  })

  it('sets formatted message for WriteError', async () => {
    accessRepository.submitGuestbookForDatafileDownload = cy.stub().rejects(new WriteError(''))
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().resolves(undefined)
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    expect(handleClose).to.not.have.been.called
    expect(downloadFromSignedUrl).to.not.have.been.called
    expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
    expect(result.current.errorSubmitGuestbook).to.deep.equal(
      'There was an error when writing the resource.'
    )
  })

  it('sets default message for non-WriteError exceptions', async () => {
    accessRepository.submitGuestbookForDatafileDownload = cy.stub().rejects(new Error('unknown'))
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose: cy.stub().as('handleClose'),
        accessRepository,
        downloadFromSignedUrl: cy.stub().resolves(undefined)
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    expect(result.current.errorSubmitGuestbook).to.deep.equal(
      'Something went wrong submitting guestbook responses. Try again later.'
    )
    expect(result.current.isSubmittingGuestbook).to.deep.equal(false)
  })

  it('sets download error when downloadFromSignedUrl fails', async () => {
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().rejects(new Error('Download failed'))
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    await waitFor(() => {
      expect(result.current.errorDownloadSignedUrlFile).to.deep.equal('Download failed')
    })

    expect(handleClose).to.have.been.calledOnce
    expect(downloadFromSignedUrl).to.have.been.calledOnce
  })

  it('resets submission state on handleModalClose', async () => {
    const handleClose = cy.stub().as('handleClose')
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        fileId: 10,
        handleClose,
        accessRepository,
        downloadFromSignedUrl: cy.stub().resolves(undefined)
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: true,
        guestbook,
        guestbookResponse
      })
    })
    expect(result.current.hasAttemptedAccept).to.deep.equal(true)

    act(() => {
      result.current.handleModalClose()
    })

    await waitFor(() => {
      expect(result.current.hasAttemptedAccept).to.deep.equal(false)
      expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
      expect(result.current.errorDownloadSignedUrlFile).to.deep.equal(null)
    })
    expect(handleClose).to.have.been.calledOnce
  })

  it('submits for dataset id and triggers download', async () => {
    const handleClose = cy.stub().as('handleClose')
    const downloadFromSignedUrl = cy.stub().resolves(undefined)
    const { result } = renderHook(() =>
      useGuestbookCollectSubmission({
        datasetId: 999,
        handleClose,
        accessRepository,
        downloadFromSignedUrl
      })
    )

    await act(async () => {
      await result.current.handleSubmit({
        hasFormErrors: false,
        guestbook,
        guestbookResponse
      })
    })

    expect(accessRepository.submitGuestbookForDatasetDownload).to.have.been.calledWith(
      999,
      guestbookResponse
    )
    expect(accessRepository.submitGuestbookForDatafileDownload).to.not.have.been.called
    expect(accessRepository.submitGuestbookForDatafilesDownload).to.not.have.been.called
    expect(handleClose).to.have.been.calledOnce
    expect(downloadFromSignedUrl).to.have.been.calledOnceWith('signed-url-dataset')
    expect(result.current.errorSubmitGuestbook).to.deep.equal(null)
  })
})

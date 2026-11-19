import { renderHook, waitFor } from '@testing-library/react'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { useLoadDatasetCurationStatus } from '@/sections/dataset/dataset-curation-status/useLoadDatasetCurationStatus'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '@tests/component/dataset/domain/models/DatasetMother'

const currentStatus = {
  label: 'Privacy Review',
  createTime: '2025-01-15 10:30:00.0',
  assigner: '@dataverseAdmin'
}
const allowedLabels = ['Author Contacted', 'Privacy Review']

const draftDataset = (canPublishDataset = true) =>
  DatasetMother.create({
    version: DatasetVersionMother.createDraftAsLatestVersion(),
    permissions: DatasetPermissionsMother.create({ canUpdateDataset: true, canPublishDataset })
  })

describe('useLoadDatasetCurationStatus', () => {
  let datasetRepository: DatasetRepository

  beforeEach(() => {
    datasetRepository = {} as DatasetRepository
    datasetRepository.getCurationStatus = cy.stub().resolves(currentStatus)
    datasetRepository.getAllowedCurationLabels = cy.stub().resolves(allowedLabels)
  })

  it('loads the current status and allowed labels for a curator on a draft', async () => {
    const dataset = draftDataset()

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: true })
    )

    await waitFor(() => {
      expect(result.current.canSeeCurationStatus).to.equal(true)
      expect(result.current.canChangeCurationStatus).to.equal(true)
      expect(result.current.currentStatus).to.deep.equal(currentStatus)
      expect(result.current.allowedLabels).to.deep.equal(allowedLabels)
    })
    cy.wrap(datasetRepository.getCurationStatus).should(
      'have.been.calledWith',
      dataset.persistentId
    )
    cy.wrap(datasetRepository.getAllowedCurationLabels).should(
      'have.been.calledWith',
      dataset.persistentId
    )
  })

  it('does not request allowed labels for users who cannot publish', async () => {
    const dataset = draftDataset(false)

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: true })
    )

    await waitFor(() => {
      expect(result.current.canSeeCurationStatus).to.equal(true)
      expect(result.current.canChangeCurationStatus).to.equal(false)
      expect(result.current.allowedLabels).to.deep.equal([])
    })
    cy.wrap(datasetRepository.getAllowedCurationLabels).should('not.have.been.called')
  })

  it('hides the status when the user is not allowed to read it', async () => {
    datasetRepository.getCurationStatus = cy.stub().rejects(new Error('Forbidden'))
    datasetRepository.getAllowedCurationLabels = cy.stub().rejects(new Error('Forbidden'))

    const dataset = draftDataset()

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: true })
    )

    await waitFor(() => {
      expect(datasetRepository.getCurationStatus).to.have.been.called
    })
    expect(result.current.canSeeCurationStatus).to.equal(false)
    expect(result.current.canChangeCurationStatus).to.equal(false)
    expect(result.current.currentStatus).to.equal(null)
  })

  it('does not request anything for released versions', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed()
    })

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: true })
    )

    expect(result.current.canSeeCurationStatus).to.equal(false)
    cy.wrap(datasetRepository.getCurationStatus).should('not.have.been.called')
  })

  it('does not request anything for anonymous users', () => {
    const dataset = draftDataset()

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: false })
    )

    expect(result.current.canSeeCurationStatus).to.equal(false)
    cy.wrap(datasetRepository.getCurationStatus).should('not.have.been.called')
  })

  it('reloads the current status when refreshed', async () => {
    const dataset = draftDataset()

    const { result } = renderHook(() =>
      useLoadDatasetCurationStatus({ datasetRepository, dataset, isAuthenticated: true })
    )

    await waitFor(() => {
      expect(result.current.currentStatus).to.deep.equal(currentStatus)
    })

    datasetRepository.getCurationStatus = cy.stub().resolves(null)
    result.current.refreshCurationStatus()

    await waitFor(() => {
      expect(result.current.currentStatus).to.equal(null)
    })
  })
})

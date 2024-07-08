/// <reference types="cypress" />

import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { renderHook } from '@testing-library/react'
import useCheckPublishCompleted from '../../../../src/sections/dataset/useCheckPublishCompleted'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../../../../src/stories/dataset/DatasetMockRepository'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'

interface TestComponentProps {
  publishInProgress: boolean | undefined
  dataset: Dataset | undefined
  datasetRepository: DatasetRepository
}
function TestComponent({ publishInProgress, dataset, datasetRepository }: TestComponentProps) {
  const publishCompleted = useCheckPublishCompleted(publishInProgress, dataset, datasetRepository)

  return <div data-testid="publish-completed">{publishCompleted ? 'true' : 'false'}</div>
}

describe('useCheckPublishCompleted Hook', () => {
  it('should not set publishCompleted if publishInProgress is false', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const { result } = renderHook(() =>
      useCheckPublishCompleted(false, DatasetMother.create(), datasetRepository)
    )
    cy.wait(3000).then(() => {
      cy.wrap(result.current).should('equal', false)
    })
  })
  it('should not set publishCompleted to true when locks are found initially', () => {
    const datasetRepository: DatasetMockRepository = new DatasetMockRepository()
    cy.stub(datasetRepository, 'getLocks').resolves([{ lockId: 'test-lock' }])

    const { result } = renderHook(() =>
      useCheckPublishCompleted(true, DatasetMother.create(), datasetRepository)
    )

    cy.wait(3000).then(() => {
      cy.wrap(result.current).should('equal', false)
    })
  })
  it('should set publishCompleted to true when no locks are found initially', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getLocks = cy.stub().resolves([])

    const { result } = renderHook(() =>
      useCheckPublishCompleted(true, DatasetMother.create(), datasetRepository)
    )
    cy.wait(3000).then(() => {
      cy.wrap(result.current).should('equal', true)
    })
  })

  it('should set publishCompleted to true after polling finds no locks', () => {
    const datasetRepository: DatasetMockRepository = new DatasetMockRepository()
    const getLocksStub = cy.stub(datasetRepository, 'getLocks')

    // First call finds locks, subsequent calls find no locks
    getLocksStub.onFirstCall().resolves([{ lockId: 'test-lock' }])
    getLocksStub.callsFake(() => Promise.resolve([]))

    cy.customMount(
      <TestComponent
        publishInProgress={true}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.wait(3000).then(() => {
      cy.get('[data-testid="publish-completed"]').should('have.text', 'true')
    })
  })
})

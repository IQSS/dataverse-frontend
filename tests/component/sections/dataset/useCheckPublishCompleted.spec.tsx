/// <reference types="cypress" />

import { needsUpdateStore } from '@/notifications/domain/hooks/needsUpdateStore'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import useCheckPublishCompleted from '../../../../src/sections/dataset/useCheckPublishCompleted'
import { DatasetMockRepository } from '../../../../src/stories/dataset/DatasetMockRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'

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
  beforeEach(() => {
    cy.stub(needsUpdateStore, 'setNeedsUpdate').as('setNeedsUpdate')
  })

  it('should not set publishCompleted if publishInProgress is false', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository

    cy.clock()
    cy.customMount(
      <TestComponent
        publishInProgress={false}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )

    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.tick(10_000)
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.get('@setNeedsUpdate').should('not.have.been.called')
  })

  it('should not set publishCompleted to true when locks are found initially', () => {
    const datasetRepository: DatasetMockRepository = new DatasetMockRepository()
    cy.stub(datasetRepository, 'getLocks').resolves([{ lockId: 'test-lock' }])

    cy.clock()
    cy.customMount(
      <TestComponent
        publishInProgress={true}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )

    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.tick(10_000)
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.get('@setNeedsUpdate').should('not.have.been.called')
  })

  it('should set publishCompleted to true (and mark needsUpdate) when no locks are found initially', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getLocks = cy.stub().resolves([])

    cy.clock()
    cy.customMount(
      <TestComponent
        publishInProgress={true}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )

    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.tick(2_000)
    cy.get('[data-testid="publish-completed"]').should('have.text', 'true')
    cy.get('@setNeedsUpdate').should('have.been.calledOnceWith', true)
  })
  it('sets publishCompleted to true after polling finds no locks', () => {
    const datasetRepository: DatasetMockRepository = new DatasetMockRepository()
    const getLocksStub = cy.stub(datasetRepository, 'getLocks')

    // First lock check still sees the publish lock; the next one sees it cleared.
    getLocksStub.onFirstCall().resolves([{ lockId: 'test-lock' }])
    getLocksStub.resolves([])

    cy.customMount(
      <TestComponent
        publishInProgress={true}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )

    cy.wrap(getLocksStub).should('have.been.calledOnce')
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')

    cy.wait(2500)
    cy.get('[data-testid="publish-completed"]').should('have.text', 'true')
    cy.get('@setNeedsUpdate').should('have.been.calledWith', true)
  })

  it('stops polling and stays incomplete on a polling error (cancelled latch)', () => {
    const datasetRepository: DatasetMockRepository = new DatasetMockRepository()
    const getLocksStub = cy.stub(datasetRepository, 'getLocks')

    // First call sees a lock → polling kicks in. Subsequent calls
    // reject. With the cancelled latch in place, the catch fires once
    // and no more polls run thereafter — call count stays at exactly 2
    // even after several poll cycles' worth of wall clock have passed.
    getLocksStub.onFirstCall().resolves([{ lockId: 'test-lock' }])
    getLocksStub.rejects(new Error('locks api boom'))

    cy.customMount(
      <TestComponent
        publishInProgress={true}
        dataset={DatasetMother.create()}
        datasetRepository={datasetRepository}
      />
    )

    cy.wrap(getLocksStub).should('have.been.calledOnce')
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')

    cy.wait(7000)
    cy.wrap(getLocksStub).should('have.callCount', 2)
    cy.get('[data-testid="publish-completed"]').should('have.text', 'false')
    cy.get('@setNeedsUpdate').should('not.have.been.called')
  })
})

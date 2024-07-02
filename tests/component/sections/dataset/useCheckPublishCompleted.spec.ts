/// <reference types="cypress" />

import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { renderHook } from '@testing-library/react'
import useCheckPublishCompleted from '../../../../src/sections/dataset/useCheckPublishCompleted'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../../../../src/stories/dataset/DatasetMockRepository'

describe('useCheckPublishCompleted Hook', () => {
  beforeEach(() => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    datasetRepository.getLocks = cy.stub().resolves([])
  })
  it('should not set publishCompleted if publishInProgress is false', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const { result } = renderHook(() =>
      useCheckPublishCompleted(false, DatasetMother.create(), datasetRepository)
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

    cy.stub(datasetRepository, 'getLocks')
      .resolves([{}])
      .onFirstCall()
      .resolves([])
      .callsFake(() => Promise.resolve([]))

    const { result } = renderHook(() =>
      useCheckPublishCompleted(true, DatasetMother.create(), datasetRepository)
    )

    cy.wrap(result.current).should('equal', false)
    cy.wait(3000).then(() => {
      cy.wrap(result.current).should('equal', true)
    })
  })
})

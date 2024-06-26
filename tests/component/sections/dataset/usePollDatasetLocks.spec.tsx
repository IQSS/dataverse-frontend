import React from 'react'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import usePollDatasetLocks from '../../../../src/sections/dataset/usePollDatasetLocks'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import * as reactRouterDom from 'react-router-dom'
const TestComponent: React.FC<{
  datasetRepository: DatasetRepository
  dataset: Dataset
  navigate: any
}> = ({ datasetRepository, dataset, navigate }) => {
  const location = useLocation()
  const state = location.state as { publishInProgress: boolean }

  usePollDatasetLocks(state?.publishInProgress, dataset, datasetRepository)

  return <div>Test Component</div>
}

const WrappedTestComponent: React.FC<{ navigate: any; datasetRepository: DatasetRepository }> = ({
  navigate,
  datasetRepository
}) => (
  <MemoryRouter initialEntries={[{ pathname: '/test', state: { publishInProgress: true } }]}>
    <Routes>
      <Route
        path="/test"
        element={
          <TestComponent
            datasetRepository={datasetRepository}
            dataset={{ persistentId: '123' } as Dataset}
            navigate={navigate}
          />
        }
      />
    </Routes>
  </MemoryRouter>
)

describe('usePollDatasetLocks', () => {
  let navigateStub: Cypress.Agent<sinon.SinonStub>
  let getLocksStub: Cypress.Agent<sinon.SinonStub>
  let datasetRepository: DatasetRepository

  beforeEach(() => {
    navigateStub = cy.stub()
    getLocksStub = cy.stub()
    datasetRepository = {
      getLocks: getLocksStub
    } as unknown as DatasetRepository
    cy.stub(reactRouterDom, 'useNavigate').returns(navigateStub)
  })

  it('should navigate to released version if there are no locks initially', () => {
    getLocksStub.resolves([])

    cy.mount(<WrappedTestComponent navigate={navigateStub} datasetRepository={datasetRepository} />)

    cy.then(() => {
      expect(getLocksStub).to.have.been.calledWith('123')
      expect(navigateStub).to.have.been.calledWith('/datasets?persistentId=123', {
        state: { publishInProgress: false }
      })
    })
  })

  it('should poll for locks and navigate to released version when locks are cleared', () => {
    getLocksStub
      .onFirstCall()
      .resolves(['lock1'])
      .onSecondCall()
      .resolves(['lock1'])
      .onThirdCall()
      .resolves([])

    cy.mount(<WrappedTestComponent navigate={navigateStub} datasetRepository={datasetRepository} />)

    cy.then(() => {
      expect(getLocksStub).to.have.been.calledWith('123')
    })

    cy.wait(2000).then(() => {
      expect(getLocksStub).to.have.been.calledTwice
    })

    cy.wait(2000).then(() => {
      expect(getLocksStub).to.have.been.calledThrice
      expect(navigateStub).to.have.been.calledWith('/datasets?persistentId=123', {
        state: { publishInProgress: false }
      })
    })
  })

  it('should clear interval and stop polling if there is an error', () => {
    getLocksStub.onFirstCall().resolves(['lock1']).onSecondCall().rejects(new Error('Error'))

    cy.mount(<WrappedTestComponent navigate={navigateStub} datasetRepository={datasetRepository} />)

    cy.then(() => {
      expect(getLocksStub).to.have.been.calledWith('123')
    })

    cy.wait(2000).then(() => {
      expect(getLocksStub).to.have.been.calledTwice
      expect(navigateStub).not.to.have.been.called
    })
  })
})

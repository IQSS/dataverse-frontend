import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { useDataset } from '../../../../src/sections/dataset/DatasetContext'
import { LoadingProvider } from '../../../../src/shared/contexts/loading/LoadingProvider'

function TestComponent() {
  const { dataset, isLoading } = useDataset()

  return (
    <div>
      {dataset ? <span>{dataset.version.title}</span> : <span>Dataset Not Found</span>}
      {isLoading && <div>Loading...</div>}
    </div>
  )
}

const datasetRepository: DatasetRepository = {} as DatasetRepository
const dataset = DatasetMother.create()

describe('DatasetProvider', () => {
  beforeEach(() => {
    datasetRepository.getByPersistentId = cy
      .stub()
      .resolves(Cypress.Promise.resolve(dataset).delay(1000))
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)
  })

  it('gets the dataset by persistentId', () => {
    cy.mount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should('be.calledOnceWith', dataset.persistentId)
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('gets the dataset by persistentId and version', () => {
    cy.mount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId, version: 'draft' }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should(
      'be.calledOnceWith',
      dataset.persistentId,
      'draft'
    )
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('gets the dataset by privateUrlToken', () => {
    cy.mount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ privateUrlToken: 'some-private-url-token' }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPrivateUrlToken).should(
      'be.calledOnce',
      'some-private-url-token'
    )
    cy.findByText(dataset.version.title).should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('stops loading if searchParams not passed', () => {
    cy.mount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={{}}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('stops loading if error happens', () => {
    cy.stub(console, 'error').as('consoleError')
    datasetRepository.getByPersistentId = cy.stub().rejects(new Error('some error'))
    cy.mount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.findByText('Loading...').should('exist')
    cy.wrap(datasetRepository.getByPersistentId).should('have.been.calledOnce')
    cy.get('@consoleError').should(
      'have.been.calledWithMatch',
      'There was an error getting the dataset'
    )
    cy.findByText('Dataset Not Found').should('exist')
    cy.findByText('Loading...').should('not.exist')
  })

  it('does not fetch the dataset while publishing', () => {
    cy.mount(
      <LoadingProvider>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ persistentId: dataset.persistentId }}
          isPublishing>
          <TestComponent />
        </DatasetProvider>
      </LoadingProvider>
    )

    cy.wrap(datasetRepository.getByPersistentId).should('not.have.been.called')
    cy.wrap(datasetRepository.getByPrivateUrlToken).should('not.have.been.called')
    cy.findByText('Loading...').should('exist')
    cy.findByText('Dataset Not Found').should('exist')
  })
})

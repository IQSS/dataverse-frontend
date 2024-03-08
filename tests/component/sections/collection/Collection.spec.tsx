import { Collection } from '../../../../src/sections/collection/Collection'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetPreviewMother } from '../../dataset/domain/models/DatasetPreviewMother'
import { UserMother } from '../../users/domain/models/UserMother'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { SessionProvider } from '../../../../src/sections/session/SessionProvider'

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const totalDatasetsCount = 200
const datasets = DatasetPreviewMother.createMany(totalDatasetsCount)

describe('Collection page', () => {
  beforeEach(() => {
    datasetRepository.getAll = cy.stub().resolves(datasets)
    datasetRepository.getTotalDatasetsCount = cy.stub().resolves(totalDatasetsCount)
  })

  it('renders collection title', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} id="collection" />)
    cy.findByRole('heading').should('contain.text', 'Collection')
  })

  it('does not render the Add Data dropdown button', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} id="collection" />)
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  before(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })
  it('does render the Add Data dropdown button when user logged in', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Collection datasetRepository={datasetRepository} id="collection" />
      </SessionProvider>
    )
    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')
    const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
    addDataBtn.should('exist')
    addDataBtn.click()
    cy.findByText('New Collection').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('renders the datasets list', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} id="collection" />)

    cy.findByText('1 to 10 of 200 Datasets').should('exist')

    datasets.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })

  it('renders the correct page when passing the page number as a query param', () => {
    cy.customMount(<Collection datasetRepository={datasetRepository} page={5} id="collection" />)

    cy.findByText('41 to 50 of 200 Datasets').should('exist')
  })

  it('renders the datasets list with infinite scrolling enabled', () => {
    const first10Elements = datasets.slice(0, 10)
    datasetRepository.getAll = cy.stub().resolves(first10Elements)

    cy.customMount(
      <Collection datasetRepository={datasetRepository} id="collection" infiniteScrollEnabled />
    )

    cy.findByText('10 of 200 Datasets seen').should('exist')

    first10Elements.forEach((dataset) => {
      cy.findByText(dataset.version.title).should('exist')
    })
  })
})

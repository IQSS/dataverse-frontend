import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { LinkAndUnlinkActions } from '@/sections/dataset/dataset-action-buttons/link-and-unlink-actions/LinkAndUnlinkActions'
import { CollectionSummaryMother } from '@tests/component/collection/domain/models/CollectionSummaryMother'
import {
  DatasetMother,
  DatasetVersionMother
} from '@tests/component/dataset/domain/models/DatasetMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

const dataset = DatasetMother.create({
  version: DatasetVersionMother.createReleased()
})

const linkedCollection = CollectionSummaryMother.create({
  id: 1,
  displayName: 'Collection 1',
  alias: 'collection-1'
})

const linkableCollection = CollectionSummaryMother.create({
  id: 3,
  displayName: 'Collection 3',
  alias: 'collection-3'
})

const mountAuthenticatedLinkAndUnlinkActions = () =>
  cy.mountAuthenticated(
    <WithRepositories collectionRepository={collectionRepository}>
      <LinkAndUnlinkActions dataset={dataset} datasetRepository={datasetRepository} />
    </WithRepositories>
  )

describe('LinkAndUnlinkActions', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    datasetRepository.link = cy.stub().as('linkDataset').resolves()
    datasetRepository.unlink = cy.stub().as('unlinkDataset').resolves()
  })

  it('remounts the actions after linking a dataset successfully', () => {
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .onCall(0)
      .resolves([])
      .onCall(1)
      .resolves([])
      .onCall(2)
      .resolves([linkedCollection])
    collectionRepository.getForLinking = cy.stub().resolves([linkableCollection])
    collectionRepository.getForUnlinking = cy.stub().resolves([linkedCollection])

    mountAuthenticatedLinkAndUnlinkActions()

    cy.findByRole('button', { name: 'Unlink Dataset' }).should('not.exist')

    cy.findByRole('button', { name: 'Link Dataset' }).click()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByRole('textbox', { name: 'Your Collection' }).should('have.value', 'Collection 3')
      })

    cy.findByTestId('confirm-link-dataset-button').click()

    cy.get('@linkDataset').should('have.been.calledOnce')
    cy.get('@getDatasetLinkedCollections').should('have.callCount', 3)
    cy.findByRole('button', { name: 'Unlink Dataset' }).should('exist')
  })

  it('remounts the actions after unlinking a dataset successfully', () => {
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .onCall(0)
      .resolves([linkedCollection])
      .onCall(1)
      .resolves([])
    collectionRepository.getForLinking = cy.stub().resolves([linkableCollection])
    collectionRepository.getForUnlinking = cy.stub().resolves([linkedCollection])

    mountAuthenticatedLinkAndUnlinkActions()

    cy.findByRole('button', { name: 'Unlink Dataset' }).should('exist').click()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByRole('textbox', { name: 'Your Collection' }).should('have.value', 'Collection 1')
      })

    cy.findByTestId('confirm-unlink-dataset-button').click()

    cy.get('@unlinkDataset').should('have.been.calledOnce')
    cy.get('@getDatasetLinkedCollections').should('have.callCount', 2)
    cy.findByRole('button', { name: 'Unlink Dataset' }).should('not.exist')
  })
})

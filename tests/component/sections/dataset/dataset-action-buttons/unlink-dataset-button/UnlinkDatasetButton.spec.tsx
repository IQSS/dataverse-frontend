import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { UnlinkDatasetButton } from '@/sections/dataset/dataset-action-buttons/link-and-unlink-actions/unlink-dataset-button/UnlinkDatasetButton'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { ReadError, WriteError } from '@iqss/dataverse-client-javascript'
import { CollectionSummaryMother } from '@tests/component/collection/domain/models/CollectionSummaryMother'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

const dataset = DatasetMother.create({
  version: DatasetVersionMother.createReleased()
})

const clickUnlinkDatasetButton = () => {
  cy.findByRole('button', { name: /Unlink Dataset/i })
    .should('exist')
    .click()
}

describe('UnlinkDatasetButton', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    // Default stubs for common happy-path
    datasetRepository.unlink = cy.stub().as('unlinkDataset').resolves()
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .resolves(CollectionSummaryMother.createManyRealistic(5))
    collectionRepository.getForUnlinking = cy
      .stub()
      .as('getCollectionsForUnlinking')
      .resolves(CollectionSummaryMother.createManyRealistic(5))
  })

  it('renders the UnlinkDatasetButton if the user is authenticated and the dataset version is not deaccessioned and the dataset is released', () => {
    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Unlink Dataset' }).should('exist')
  })

  it('does not render the UnlinkDatasetButton if the user is not authenticated', () => {
    cy.customMount(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('does not render the UnlinkDatasetButton if the dataset version is deaccessioned', () => {
    const datasetDeaccessioned = DatasetMother.create({
      version: DatasetVersionMother.createDeaccessioned()
    })

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={datasetDeaccessioned}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('does not render the UnlinkDatasetButton if the dataset has no linked collections', () => {
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .resolves([])

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Unlink Dataset' }).should('not.exist')
  })

  it('selects a collection and unlinks the dataset successfully', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createReleased()
    })
    const updateParentSpy = cy.spy().as('updateParentSpy')

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={updateParentSpy}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        // Save disabled without selection
        cy.findByRole('button', { name: /Remove Linked Dataset/i }).should('be.disabled')

        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 1').should('exist').click()

        cy.findByRole('button', { name: /Remove Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@unlinkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const unlinkingCollectionIdArg = linkSpy.getCall(0).args[1] as number

          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(unlinkingCollectionIdArg).to.equal(1)
        })

        cy.get('@updateParentSpy').should('have.been.calledOnce')
      })

    // Success toast should appear
    cy.findByText(/Dataset unlinked from/i)
      .should('exist')
      .should('be.visible')
  })

  it('searches for a collection to link', () => {
    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={new CollectionMockRepository()}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByRole('button', { name: /Remove Linked Dataset/i }).should('be.disabled')

        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()

        // No results
        cy.findByPlaceholderText('Enter Collection Name').type('XYZ')
        cy.wait(500)
        cy.findByText('No collections found').should('exist')

        // Matching result
        cy.findByPlaceholderText('Enter Collection Name').clear().type('Collection 3')
        cy.wait(500)
        cy.findByText('Collection 3').should('exist')
      })
  })

  it('shows no collections to unlink message', () => {
    collectionRepository.getForUnlinking = cy.stub().resolves([])

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/No collections are showing up to unlink./)
          .should('exist')
          .should('be.visible')
      })

    cy.findByRole('button', { name: /Remove Linked Dataset/i }).should('be.disabled')
  })

  it('shows only one collection message and auto-selects it', () => {
    collectionRepository.getForUnlinking = cy.stub().resolves([
      CollectionSummaryMother.create({
        id: 555,
        displayName: 'Bar Collection',
        alias: 'bar-collection'
      })
    ])

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/You have one collection you can remove linked collection and datasets from./)
          .should('exist')
          .should('be.visible')

        cy.findByLabelText('Your Collection')
          .should('have.value', 'Bar Collection')
          .and('have.attr', 'readonly')
      })

    cy.findByRole('button', { name: /Remove Linked Dataset/i })
      .should('not.be.disabled')
      .click()

    cy.get('@unlinkDataset').should((spy) => {
      const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
      const datasetIdArg = linkSpy.getCall(0).args[0] as string
      const linkingCollectionIdArg = linkSpy.getCall(0).args[1] as number

      expect(datasetIdArg).to.equal(dataset.persistentId)
      expect(linkingCollectionIdArg).to.equal(555)
    })
  })

  it('handles error when unlinking the dataset fails', () => {
    datasetRepository.unlink = cy.stub().as('unlinkDataset').rejects(new Error('Unlinking failed'))

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 2').should('exist').click()

        cy.findByRole('button', { name: /Remove Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@unlinkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const unlinkingCollectionIdArg = linkSpy.getCall(0).args[1] as number
          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(unlinkingCollectionIdArg).to.equal(2)
        })

        cy.findByText(/An unexpected error occurred while unlinking the dataset./)
          .should('exist')
          .should('be.visible')
      })

    cy.findByText(/Dataset unlinked from/i).should('not.exist')
  })

  it('handles error when unlinking fails with WriteError', () => {
    datasetRepository.unlink = cy
      .stub()
      .as('unlinkDataset')
      .rejects(new WriteError('A WriteError received'))

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 2').should('exist').click()

        cy.findByRole('button', { name: /Remove Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@unlinkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const unlinkingCollectionIdArg = linkSpy.getCall(0).args[1] as number
          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(unlinkingCollectionIdArg).to.equal(2)
        })

        cy.findByText(/A WriteError received/i)
          .should('exist')
          .should('be.visible')
      })

    cy.findByText(/Dataset unlinked from/i).should('not.exist')
  })

  it('handles error when fetching collections for linking fails', () => {
    collectionRepository.getForUnlinking = cy
      .stub()
      .rejects(new Error('Fetching collections failed'))

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/An unexpected error occurred while fetching collections for unlinking./)
          .should('exist')
          .should('be.visible')
      })
  })

  it('handles error when fetching collections fails with ReadError', () => {
    collectionRepository.getForUnlinking = cy.stub().rejects(new ReadError('A ReadError received'))

    cy.mountAuthenticated(
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickUnlinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/A ReadError received/i)
          .should('exist')
          .should('be.visible')
      })
  })
})

import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../dataset/domain/models/DatasetMother'
import { LinkDatasetButton } from '../../../../../../src/sections/dataset/dataset-action-buttons/link-and-unlink-actions/link-dataset-button/LinkDatasetButton'
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

const clickLinkDatasetButton = () => {
  cy.findByRole('button', { name: /Link Dataset/i })
    .should('exist')
    .click()
}

describe('LinkDatasetButton', () => {
  beforeEach(() => {
    cy.viewport('macbook-15')
    // Default stubs for common happy-path
    datasetRepository.link = cy.stub().as('linkDataset').resolves()
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .resolves([])
    collectionRepository.getForLinking = cy
      .stub()
      .as('getCollectionsForLinking')
      .resolves(CollectionSummaryMother.createManyRealistic(5))
  })

  it('renders the LinkDatasetButton if the user is authenticated and the dataset version is not deaccessioned and the dataset is released', () => {
    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Link Dataset' }).should('exist')
  })

  it('does not render the LinkDatasetButton if the user is not authenticated', () => {
    cy.customMount(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('does not render the LinkDatasetButton if the dataset version is deaccessioned', () => {
    const datasetDeaccessioned = DatasetMother.create({
      version: DatasetVersionMother.createDeaccessioned()
    })

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={datasetDeaccessioned}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    cy.findByRole('button', { name: 'Link Dataset' }).should('not.exist')
  })

  it('selects a collection and links the dataset successfully', () => {
    const updateParentSpy = cy.spy().as('updateParentSpy')

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={updateParentSpy}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        // Save disabled without selection
        cy.findByRole('button', { name: /Save Linked Dataset/i }).should('be.disabled')

        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 3').should('exist').click()

        cy.findByRole('button', { name: /Save Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@linkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const linkingCollectionIdArg = linkSpy.getCall(0).args[1] as number

          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(linkingCollectionIdArg).to.equal(3)
        })

        cy.get('@updateParentSpy').should('have.been.calledOnce')
      })

    // Success toast should appear
    cy.findByText(/Dataset from .* has been successfully linked to/i)
      .should('exist')
      .should('be.visible')
  })

  it('searches for a collection to link', () => {
    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={new CollectionMockRepository()}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByRole('button', { name: /Save Linked Dataset/i }).should('be.disabled')

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

  it('shows no collections to link message', () => {
    collectionRepository.getForLinking = cy.stub().resolves([])

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/No collections are showing up to link./)
          .should('exist')
          .should('be.visible')
      })

    cy.findByRole('button', { name: /Save Linked Dataset/i }).should('be.disabled')
  })

  it('shows only one collection message and auto-selects it', () => {
    collectionRepository.getForLinking = cy.stub().resolves([
      CollectionSummaryMother.create({
        id: 555,
        displayName: 'Bar Collection',
        alias: 'bar-collection'
      })
    ])

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/You have one collection you can add linked collection and datasets in./)
          .should('exist')
          .should('be.visible')

        cy.findByLabelText('Your Collection')
          .should('have.value', 'Bar Collection')
          .and('have.attr', 'readonly')
      })

    cy.findByRole('button', { name: /Save Linked Dataset/i })
      .should('not.be.disabled')
      .click()

    cy.get('@linkDataset').should((spy) => {
      const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
      const datasetIdArg = linkSpy.getCall(0).args[0] as string
      const linkingCollectionIdArg = linkSpy.getCall(0).args[1] as number

      expect(datasetIdArg).to.equal(dataset.persistentId)
      expect(linkingCollectionIdArg).to.equal(555)
    })
  })

  it('handles error when linking the dataset fails', () => {
    datasetRepository.link = cy.stub().as('linkDataset').rejects(new Error('Linking failed'))

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 2').should('exist').click()

        cy.findByRole('button', { name: /Save Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@linkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const linkingCollectionIdArg = linkSpy.getCall(0).args[1] as number
          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(linkingCollectionIdArg).to.equal(2)
        })

        cy.findByText(/An unexpected error occurred while linking the dataset./)
          .should('exist')
          .should('be.visible')
      })

    cy.findByText(/Dataset from .* has been successfully linked to/i).should('not.exist')
  })

  it('handles error when linking fails with WriteError', () => {
    datasetRepository.link = cy
      .stub()
      .as('linkDataset')
      .rejects(new WriteError('A WriteError received'))

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByLabelText(/Toggle options menu/)
          .should('exist')
          .click()
        cy.findByText('Collection 2').should('exist').click()

        cy.findByRole('button', { name: /Save Linked Dataset/i })
          .should('not.be.disabled')
          .click()

        cy.get('@linkDataset').should((spy) => {
          const linkSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
          const datasetIdArg = linkSpy.getCall(0).args[0] as string
          const linkingCollectionIdArg = linkSpy.getCall(0).args[1] as number
          expect(datasetIdArg).to.equal(dataset.persistentId)
          expect(linkingCollectionIdArg).to.equal(2)
        })

        cy.findByText(/A WriteError received/i)
          .should('exist')
          .should('be.visible')
      })

    cy.findByText(/Dataset from .* has been successfully linked to/i).should('not.exist')
  })

  it('handles error when fetching collections for linking fails', () => {
    collectionRepository.getForLinking = cy.stub().rejects(new Error('Fetching collections failed'))

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/An unexpected error occurred while fetching collections for linking./)
          .should('exist')
          .should('be.visible')
      })
  })

  it('handles error when fetching collections fails with ReadError', () => {
    collectionRepository.getForLinking = cy.stub().rejects(new ReadError('A ReadError received'))

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/A ReadError received/i)
          .should('exist')
          .should('be.visible')
      })
  })

  it('shows already linked collections for the dataset when opening the modal', () => {
    const linked = [
      CollectionSummaryMother.create({ id: 7, displayName: 'Alpha', alias: 'alpha' }),
      CollectionSummaryMother.create({ id: 8, displayName: 'Beta', alias: 'beta' }),
      CollectionSummaryMother.create({ id: 9, displayName: 'Gamma', alias: 'gamma' })
    ]
    datasetRepository.getDatasetLinkedCollections = cy
      .stub()
      .as('getDatasetLinkedCollections')
      .resolves(linked)

    cy.mountAuthenticated(
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={() => {}}
      />
    )

    clickLinkDatasetButton()

    cy.get('@getDatasetLinkedCollections').should((spy) => {
      const getSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
      const datasetIdArg = getSpy.getCall(0).args[0] as number | string
      expect(datasetIdArg).to.equal(dataset.id)
    })

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText(/Note: This dataset is already linked to the following collections:/).should(
          'exist'
        )

        cy.contains('Alpha, Beta and Gamma.').should('exist')
      })
  })
})

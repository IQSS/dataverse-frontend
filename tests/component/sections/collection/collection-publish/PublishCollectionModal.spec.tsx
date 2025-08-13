import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { PublishCollectionModal } from '../../../../../src/sections/collection/publish-collection/PublishCollectionModal'

describe('PublishCollectionModal', () => {
  it('displays an error message when publishCollection fails', () => {
    const handleClose = cy.stub()
    const refetchCollection = cy.stub()
    const repository = {} as CollectionRepository // Mock the repository as needed
    const errorMessage = 'Publishing failed'
    repository.publish = cy.stub().as('repositoryPublish').rejects(new Error(errorMessage))

    cy.mountAuthenticated(
      <PublishCollectionModal
        show={true}
        repository={repository}
        collectionId="testCollectionId"
        handleClose={handleClose}
        refetchCollection={refetchCollection}
      />
    )

    // Trigger the Publish action
    cy.findByRole('button', { name: 'Continue' }).click()

    // Check if the error message is displayed
    cy.contains(errorMessage).should('exist')
  })

  it('displays the fallback error message when publishCollection fails without an error message', () => {
    const handleClose = cy.stub()
    const refetchCollection = cy.stub()
    const repository = {} as CollectionRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').rejects('Unknown error')

    cy.mountAuthenticated(
      <PublishCollectionModal
        show={true}
        repository={repository}
        collectionId="testCollectionId"
        handleClose={handleClose}
        refetchCollection={refetchCollection}
      />
    )

    // Trigger the Publish action
    cy.findByRole('button', { name: 'Continue' }).click()

    // Check if the error message is displayed
    cy.contains(
      'Something went wrong while trying to publish the collection. Please try again later.'
    ).should('exist')
  })

  it('renders the PublishDatasetModal and triggers submitPublish on button click', () => {
    const handleClose = cy.stub()
    const refetchCollection = cy.stub()
    const repository = {} as CollectionRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    cy.customMount(
      <PublishCollectionModal
        show={true}
        repository={repository}
        collectionId="testCollectionId"
        handleClose={handleClose}
        refetchCollection={refetchCollection}
      />
    )

    // Check if the modal is rendered
    cy.findByText('Publish Collection').should('exist')
    cy.contains('Are you sure you want to publish your collection?').should('exist')
    cy.findByRole('button', { name: 'Continue' }).click()
    cy.get('@repositoryPublish').should('have.been.calledWith', 'testCollectionId')
    cy.findByText(/Your collection is now public/).should('exist')
  })
})

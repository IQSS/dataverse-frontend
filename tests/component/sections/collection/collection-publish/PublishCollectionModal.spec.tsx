import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { PublishCollectionModal } from '../../../../../src/sections/collection/publish-collection/PublishCollectionModal'

describe('PublishCollectionModal', () => {
  it('displays an error message when publishCollection fails', () => {
    const handleClose = cy.stub()
    const repository = {} as CollectionRepository // Mock the repository as needed
    const errorMessage = 'Publishing failed'
    repository.publish = cy.stub().as('repositoryPublish').rejects(new Error(errorMessage))

    cy.mountAuthenticated(
      <PublishCollectionModal
        show={true}
        repository={repository}
        collectionId="testCollectionId"
        handleClose={handleClose}
      />
    )

    // Trigger the Publish action
    cy.findByRole('button', { name: 'Continue' }).click()

    // Check if the error message is displayed
    cy.contains(errorMessage).should('exist')
  })
  it('renders the PublishDatasetModal and triggers submitPublish on button click', () => {
    const handleClose = cy.stub()
    const repository = {} as CollectionRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    cy.customMount(
      <PublishCollectionModal
        show={true}
        repository={repository}
        collectionId="testCollectionId"
        handleClose={handleClose}
      />
    )

    // Check if the modal is rendered
    cy.findByText('Publish Collection').should('exist')
    cy.contains('Are you sure you want to publish your collection?').should('exist')
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should('have.been.calledWith', 'testCollectionId')
  })
})

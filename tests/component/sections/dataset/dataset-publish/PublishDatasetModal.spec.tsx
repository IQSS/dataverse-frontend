import { VersionUpdateType } from '../../../../../src/dataset/domain/models/VersionUpdateType'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { PublishDatasetModal } from '../../../../../src/sections/dataset/publish-dataset/PublishDatasetModal'

describe('PublishDatasetModal', () => {
  it('renders the PublishDatasetModal and triggers submitPublish on button click', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    cy.customMount(
      <PublishDatasetModal
        show={true}
        repository={repository}
        persistentId="testPersistentId"
        releasedVersionExists={true}
        handleClose={handleClose}
      />
    )

    // Check if the modal is rendered
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText('Major Version').click()
    // Check if the "Publish Dataset" button is rendered and triggers submitPublish when clicked
    // Check if the "Publish Dataset" button is rendered and triggers submitPublish when clicked
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      'testPersistentId',
      VersionUpdateType.MAJOR
    )
  })
})

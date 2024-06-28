import { VersionUpdateType } from '../../../../../src/dataset/domain/models/VersionUpdateType'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { PublishDatasetModal } from '../../../../../src/sections/dataset/publish-dataset/PublishDatasetModal'

describe('PublishDatasetModal', () => {
  it('does not render the radio buttons when releasedVersionExists is false', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        persistentId="testPersistentId"
        releasedVersionExists={false}
        handleClose={handleClose}
      />
    )
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText('Major Version').should('not.exist')
    cy.findByText('Minor Version').should('not.exist')
    cy.findByText('Update Current Version').should('not.exist')
  })
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
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      'testPersistentId',
      VersionUpdateType.MAJOR
    )
  })
  describe('PublishDatasetModal', () => {
    it('renders the third radio button when user.superuser is true', () => {
      const handleClose = cy.stub()
      const repository = {} as DatasetRepository // Mock the repository as needed
      repository.publish = cy.stub().as('repositoryPublish').resolves()
      cy.mountSuperuser(
        <PublishDatasetModal
          show={true}
          repository={repository}
          persistentId="testPersistentId"
          releasedVersionExists={true}
          handleClose={handleClose}
        />
      )
      cy.findByText('Update Current Version').should('exist')
    })
  })
  describe('PublishDatasetModal', () => {
    it('does not display the third radio button when user.superuser is false', () => {
      const handleClose = cy.stub()
      const repository = {} as DatasetRepository // Mock the repository as needed
      repository.publish = cy.stub().as('repositoryPublish').resolves()
      cy.mountAuthenticated(
        <PublishDatasetModal
          show={true}
          repository={repository}
          persistentId="testPersistentId"
          releasedVersionExists={true}
          handleClose={handleClose}
        />
      )
      cy.findByText('Update Current Version').should('not.exist')
    })
  })
})

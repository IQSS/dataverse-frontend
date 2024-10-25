import { VersionUpdateType } from '../../../../../src/dataset/domain/models/VersionUpdateType'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { PublishDatasetModal } from '../../../../../src/sections/dataset/publish-dataset/PublishDatasetModal'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

describe('PublishDatasetModal', () => {
  it('display modal for never released dataset', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection()
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={false}
        handleClose={handleClose}
      />
    )
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText(
      'Are you sure you want to publish this dataset? Once you do so, it must remain public.'
    ).should('exist')
    cy.findByText('Major Release (2.0)').should('not.exist')
    cy.findByText('Minor Release (1.1)').should('not.exist')
    cy.findByText('Update Current Version').should('not.exist')
    // Trigger the Publish action
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      'testPersistentId',
      VersionUpdateType.MAJOR
    )
  })

  it('displays an error message when publishDataset fails', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    const errorMessage = 'Publishing failed'
    repository.publish = cy.stub().as('repositoryPublish').rejects(new Error(errorMessage))
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection()
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={false}
        handleClose={handleClose}
      />
    )

    // Trigger the Publish action
    cy.findByText('Continue').click()

    // Check if the error message is displayed
    cy.contains(errorMessage).should('exist')
  })
  it('displays an error message when publishCollection fails', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy
      .stub()
      .as('collectionRepositoryPublish')
      .rejects(new Error('collection error'))
    const parentCollection = UpwardHierarchyNodeMother.createCollection({ isReleased: false })
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={false}
        handleClose={handleClose}
      />
    )

    // Trigger the Publish action
    cy.findByText('Continue').click()

    // Check if the error message is displayed
    cy.contains('collection error').should('exist')
  })
  it('renders the PublishDatasetModal for previously released dataset and triggers submitPublish on button click', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection()
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={true}
        nextMajorVersion={'2.0'}
        nextMinorVersion={'1.1'}
        handleClose={handleClose}
      />
    )

    // Check if the modal is rendered
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText('Are you sure you want to republish this dataset?').should('exist')
    cy.findByText('Major Release (2.0)').click()
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      'testPersistentId',
      VersionUpdateType.MAJOR
    )
  })

  it('renders the third radio button when user.superuser is true', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection()
    cy.mountSuperuser(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={true}
        nextMajorVersion={'2.0'}
        nextMinorVersion={'1.1'}
        handleClose={handleClose}
      />
    )
    cy.findByText(/Update Current Version/).should('exist')
  })

  it('does not display the third radio button when user.superuser is false', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection()
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={true}
        nextMajorVersion={'2.0'}
        nextMinorVersion={'1.1'}
        handleClose={handleClose}
      />
    )
    cy.findByText(/Update Current Version/).should('not.exist')
  })
  it('Displays warning text for unreleased Collection', () => {
    const handleClose = cy.stub()
    const repository = {} as DatasetRepository // Mock the repository as needed
    repository.publish = cy.stub().as('repositoryPublish').resolves()
    const collectionRepository = {} as CollectionRepository
    collectionRepository.publish = cy.stub().as('collectionRepositoryPublish').resolves()
    const parentCollection = UpwardHierarchyNodeMother.createCollection({ isReleased: false })
    cy.mountAuthenticated(
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId="testPersistentId"
        releasedVersionExists={false}
        handleClose={handleClose}
      />
    )
    cy.findByText(/This dataset cannot be published until/).should('exist')
    cy.findByRole('link', { name: parentCollection.name }).should('exist')
    cy.findByRole('link', { name: parentCollection.name })
      .should('have.attr', 'href')
      .and('include', `/collections/${parentCollection.id}`)
  })
})

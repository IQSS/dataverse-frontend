import { VersionUpdateType } from '../../../../../src/dataset/domain/models/VersionUpdateType'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { PublishDatasetModal } from '../../../../../src/sections/dataset/publish-dataset/PublishDatasetModal'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { CustomTermsMother } from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { LicenseMother } from '@tests/component/dataset/domain/models/LicenseMother'
import { SettingsProvider } from '../../../../../src/sections/settings/SettingsProvider'
import { SettingMother } from '@tests/component/settings/domain/models/SettingMother'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'

const TEST_PERSISTENT_ID = 'testPersistentId'

type CreateRepositoryOptions = {
  publish?: sinon.SinonStub
}

const createDatasetRepository = (options: CreateRepositoryOptions = {}) => {
  const repository = {} as DatasetRepository
  repository.publish = options.publish ?? cy.stub().as('repositoryPublish').resolves()
  return repository
}

const createCollectionRepository = (options: CreateRepositoryOptions = {}) => {
  const collectionRepository = {} as CollectionRepository
  collectionRepository.publish =
    options.publish ?? cy.stub().as('collectionRepositoryPublish').resolves()
  return collectionRepository
}

type MountOptions = {
  mountAs?: 'authenticated' | 'superuser'
  repository?: DatasetRepository
  collectionRepository?: CollectionRepository
  parentCollection?: ReturnType<typeof UpwardHierarchyNodeMother.createCollection>
  handleClose?: sinon.SinonStub
  dataverseInfoRepository?: DataverseInfoRepository
  props?: Partial<React.ComponentProps<typeof PublishDatasetModal>>
}

const mountPublishDatasetModal = ({
  mountAs = 'authenticated',
  repository = createDatasetRepository(),
  collectionRepository = createCollectionRepository(),
  parentCollection = UpwardHierarchyNodeMother.createCollection(),
  dataverseInfoRepository,
  handleClose = cy.stub(),
  props = {}
}: MountOptions = {}) => {
  const mountFn = mountAs === 'superuser' ? cy.mountSuperuser : cy.mountAuthenticated
  const dataverseInfoWithoutCustomText = new DataverseInfoMockRepository()
  dataverseInfoWithoutCustomText.getDatasetPublishPopupCustomText = cy.stub().resolves('')
  dataverseInfoWithoutCustomText.getPublishDatasetDisclaimerText = cy.stub().resolves('')
  const resolvedDataverseInfoRepository = dataverseInfoRepository ?? dataverseInfoWithoutCustomText

  mountFn(
    <SettingsProvider dataverseInfoRepository={resolvedDataverseInfoRepository}>
      <PublishDatasetModal
        show={true}
        repository={repository}
        collectionRepository={collectionRepository}
        parentCollection={parentCollection}
        persistentId={TEST_PERSISTENT_ID}
        releasedVersionExists={false}
        handleClose={handleClose}
        license={LicenseMother.create()}
        {...props}
      />
    </SettingsProvider>
  )

  return { repository, collectionRepository, parentCollection, handleClose }
}

describe('PublishDatasetModal', () => {
  it('display modal for never released dataset', () => {
    mountPublishDatasetModal()

    cy.findByText('Publish Dataset').should('exist')
    cy.findByText(
      'Are you sure you want to publish this dataset? Once you do so, it must remain published.'
    ).should('exist')
    cy.findByText('Major Release (2.0)').should('not.exist')
    cy.findByText('Minor Release (1.1)').should('not.exist')
    cy.findByText('Update Current Version').should('not.exist')
    // Trigger the Publish action
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      TEST_PERSISTENT_ID,
      VersionUpdateType.MAJOR
    )
  })

  it('displays an error message when publishDataset fails', () => {
    const errorMessage = 'Publishing failed'
    const repository = createDatasetRepository({
      publish: cy.stub().as('repositoryPublish').rejects(new Error(errorMessage))
    })

    mountPublishDatasetModal({ repository })

    // Trigger the Publish action
    cy.findByText('Continue').click()

    // Check if the error message is displayed
    cy.contains(errorMessage).should('exist')
  })

  it('displays an error message when publishCollection fails', () => {
    const collectionRepository = createCollectionRepository({
      publish: cy.stub().as('collectionRepositoryPublish').rejects(new Error('collection error'))
    })
    const parentCollection = UpwardHierarchyNodeMother.createCollection({ isReleased: false })

    mountPublishDatasetModal({ collectionRepository, parentCollection })

    // Trigger the Publish action
    cy.findByText('Continue').click()

    // Check if the error message is displayed
    cy.contains('collection error').should('exist')
  })

  it('renders the PublishDatasetModal for previously released dataset and triggers submitPublish on button click', () => {
    mountPublishDatasetModal({
      props: {
        releasedVersionExists: true,
        nextMajorVersion: '2.0',
        nextMinorVersion: '1.1'
      }
    })

    // Check if the modal is rendered
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText('Are you sure you want to republish this dataset?').should('exist')
    cy.findByText('Major Release (2.0)').click()
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      TEST_PERSISTENT_ID,
      VersionUpdateType.MAJOR
    )
  })

  it('renders the third radio button when user.superuser is true', () => {
    mountPublishDatasetModal({
      mountAs: 'superuser',
      props: {
        releasedVersionExists: true,
        nextMajorVersion: '2.0',
        nextMinorVersion: '1.1'
      }
    })

    cy.findByText(/Update Current Version/).should('exist')
  })

  it('does not display the third radio button when user.superuser is false', () => {
    mountPublishDatasetModal({
      props: {
        releasedVersionExists: true,
        nextMajorVersion: '2.0',
        nextMinorVersion: '1.1'
      }
    })

    cy.findByText(/Update Current Version/).should('not.exist')
  })

  it('renders the PublishDatasetModal for previously released dataset that requires major version update', () => {
    mountPublishDatasetModal({
      props: {
        releasedVersionExists: true,
        nextMajorVersion: '2.0',
        requiresMajorVersionUpdate: true,
        nextMinorVersion: '1.1'
      }
    })

    // Check if the modal is rendered
    cy.findByText('Publish Dataset').should('exist')
    cy.findByText('Are you sure you want to republish this dataset?').should('exist')

    cy.findByText(
      /Due to the nature of the changes to the current draft this will be a major release \(2\.0\)/
    ).should('exist')
    cy.findByText('Continue').click()
    cy.get('@repositoryPublish').should(
      'have.been.calledWith',
      TEST_PERSISTENT_ID,
      VersionUpdateType.MAJOR
    )
  })

  it('Displays warning text for unreleased Collection', () => {
    const parentCollection = UpwardHierarchyNodeMother.createCollection({ isReleased: false })

    mountPublishDatasetModal({
      parentCollection,
      props: {
        releasedVersionExists: false
      }
    })

    cy.findByText(/This dataset cannot be published until/).should('exist')
    cy.findByRole('link', { name: parentCollection.name }).should('exist')
    cy.findByRole('link', { name: parentCollection.name })
      .should('have.attr', 'href')
      .and('include', `/collections/${parentCollection.id}`)
  })

  it('Displays custom terms when license is undefined', () => {
    const parentCollection = UpwardHierarchyNodeMother.createCollection({ isReleased: false })

    mountPublishDatasetModal({
      parentCollection,
      props: {
        license: undefined,
        customTerms: CustomTermsMother.create()
      }
    })

    cy.findByText(/Custom Dataset Terms/).should('exist')
  })

  it('Displays disclaimer text from settings', () => {
    const dataverseInfoRepository = new DataverseInfoMockRepository()
    const disclaimerText = 'This is custom text for the dataset publish popup.'

    dataverseInfoRepository.getPublishDatasetDisclaimerText = cy
      .stub()
      .resolves(SettingMother.createPublishDatasetDisclaimerText(disclaimerText))

    mountPublishDatasetModal({ dataverseInfoRepository })

    cy.findByText(disclaimerText).should('exist')
  })

  it('Disables the continue button until the user checks the disclaimer text', () => {
    const dataverseInfoRepository = new DataverseInfoMockRepository()
    const disclaimerText = 'This is disclaimer text for the dataset publish popup.'

    dataverseInfoRepository.getPublishDatasetDisclaimerText = cy
      .stub()
      .resolves(SettingMother.createPublishDatasetDisclaimerText(disclaimerText))
    mountPublishDatasetModal({ dataverseInfoRepository })

    cy.findByText(disclaimerText).should('exist')
    cy.findByRole('button', { name: 'Continue' }).should('be.disabled')
    cy.findByRole('checkbox', { name: disclaimerText }).click()
    cy.findByRole('button', { name: 'Continue' }).should('not.be.disabled')
  })

  it('Displays the custom popup text if it is available', () => {
    const dataverseInfoRepository = new DataverseInfoMockRepository()
    const popupText = 'This is custom text for the popup.'

    dataverseInfoRepository.getDatasetPublishPopupCustomText = cy
      .stub()
      .resolves(SettingMother.createDatasetPublishPopupCustomText(popupText))
    dataverseInfoRepository.getPublishDatasetDisclaimerText = cy.stub().resolves('')

    mountPublishDatasetModal({ dataverseInfoRepository })

    cy.findByText(popupText).should('exist')
    cy.findByRole('button', { name: 'Continue' }).should('not.be.disabled')
  })
})

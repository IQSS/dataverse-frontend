import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { CreateCollection } from '@/sections/create-collection/CreateCollection'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { CollectionFacetMother } from '@tests/component/collection/domain/models/CollectionFacetMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UserMother } from '@tests/component/users/domain/models/UserMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME })
const userPermissionsMock = CollectionMother.createUserPermissions()

const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()

const collectionFacetsMock = CollectionFacetMother.createFacets()

const allFacetableMetadataFieldsMock = MetadataBlockInfoMother.createFacetableMetadataFields()

const allMetadataBlocksMock = [
  MetadataBlockInfoMother.getCitationBlock(),
  MetadataBlockInfoMother.getGeospatialBlock(),
  MetadataBlockInfoMother.getAstrophysicsBlock(),
  MetadataBlockInfoMother.getBiomedicalBlock(),
  MetadataBlockInfoMother.getJournalBlock(),
  MetadataBlockInfoMother.getSocialScienceBlock()
]

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository

describe('CreateCollection', () => {
  beforeEach(() => {
    collectionRepository.create = cy.stub().resolves(1)
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
    collectionRepository.getFacets = cy.stub().resolves(collectionFacetsMock)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(collectionMetadataBlocksInfo)
    metadataBlockInfoRepository.getAll = cy.stub().resolves(allMetadataBlocksMock)
    metadataBlockInfoRepository.getAllFacetableMetadataFields = cy
      .stub()
      .resolves(allFacetableMetadataFieldsMock)
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
  })

  it('should show loading skeleton while loading the owner collection', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    cy.customMount(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        parentCollectionId="root"
      />
    )
    cy.clock()

    cy.findByTestId('create-collection-skeleton').should('exist')

    cy.tick(DELAYED_TIME)

    cy.findByTestId('create-collection-skeleton').should('not.exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('should render the correct breadcrumbs', () => {
    cy.customMount(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        parentCollectionId="root"
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Create Collection')
      .should('have.class', 'active')
  })

  it('should show page not found when owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    cy.customMount(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        parentCollectionId="root"
      />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('should show alert error message when user is not allowed to create collection', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddCollection: false
      })
    )

    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        parentCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-collection-alert').should('exist')
  })

  it('should not show alert error message when user is allowed to create collection', () => {
    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        parentCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-collection-alert').should('not.exist')
  })

  it('should show alert error message when getting the user permissions fails', () => {
    collectionRepository.getUserPermissions = cy.stub().rejects('Error')

    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        parentCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText('Error').should('exist')
  })
})

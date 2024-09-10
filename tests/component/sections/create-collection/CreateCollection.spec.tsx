import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { CreateCollection } from '../../../../src/sections/create-collection/CreateCollection'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { CollectionFacetMother } from '../../collection/domain/models/CollectionFacetMother'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UserMother } from '../../users/domain/models/UserMother'

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
    cy.customMount(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        ownerCollectionId="root"
      />
    )

    cy.findByTestId('create-collection-skeleton').should('exist')
  })

  it('should render the correct breadcrumbs', () => {
    cy.customMount(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        ownerCollectionId="root"
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
        ownerCollectionId="root"
      />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('pre-fills specific form fields with user data', () => {
    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        ownerCollectionId="root"
      />
    )

    cy.findByLabelText(/^Collection Name/i).should(
      'have.value',
      `${testUser.displayName} Collection`
    )

    cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)

    cy.findByLabelText(/^Email/i).should('have.value', testUser.email)
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
        ownerCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-collection-alert').should('exist')
  })

  it('should not show alert error message when user is allowed to create collection', () => {
    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        ownerCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-collection-alert').should('not.exist')
  })

  it('should display an alert error message for each error in loading the required data', () => {
    collectionRepository.getUserPermissions = cy
      .stub()
      .rejects(new Error('Error getting user permissions'))
    collectionRepository.getFacets = cy.stub().rejects(new Error('Error getting collection facets'))
    metadataBlockInfoRepository.getByCollectionId = cy
      .stub()
      .rejects(new Error('Error getting metadata blocks info'))
    metadataBlockInfoRepository.getAll = cy
      .stub()
      .rejects(new Error('Error getting all metadata blocks info'))
    metadataBlockInfoRepository.getAllFacetableMetadataFields = cy
      .stub()
      .rejects(new Error('Error getting all facetable metadata fields'))

    cy.mountAuthenticated(
      <CreateCollection
        collectionRepository={collectionRepository}
        ownerCollectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText(/Error getting user permissions/).should('exist')
    cy.findByText(/Error getting collection facets/).should('exist')
    cy.findByText(/Error getting metadata blocks info/).should('exist')
    cy.findByText(/Error getting all metadata blocks info/).should('exist')
    cy.findByText(/Error getting all facetable metadata fields/).should('exist')
  })
})

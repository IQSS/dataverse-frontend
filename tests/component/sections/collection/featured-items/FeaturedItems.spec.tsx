import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'

const collectionRepository = {} as CollectionRepository
const testCollectionId = 'root'

const featuredItemOne = FeaturedItemMother.createCustomFeaturedItem('css', {
  content: '<h1 class="rte-heading">Title One</h1>',
  imageFileUrl: undefined
})
const featuredItemTwo = FeaturedItemMother.createCustomFeaturedItem('css', {
  content: '<h1 class="rte-heading">Title Two</h1>',
  imageFileUrl: undefined
})

const collectionDvObjectFeaturedItem = FeaturedItemMother.createDvObjectCollectionFeaturedItem({
  dvObjectDisplayName: 'Collection Title'
})

const datasetDvObjectFeaturedItem = FeaturedItemMother.createDvObjectDatasetFeaturedItem({
  dvObjectDisplayName: 'Dataset Title'
})

const fileDvObjectFeaturedItem = FeaturedItemMother.createDvObjectFileFeaturedItem({
  dvObjectDisplayName: 'File Title'
})

const tenTestFeaturedItems = Array.from({ length: 10 }, (_, i) =>
  FeaturedItemMother.createCustomFeaturedItem('books', {
    id: i + 1,
    content: `<h1 class="rte-heading">Title ${i}</h1>`,
    imageFileUrl: undefined
  })
)

describe('FeaturedItems', () => {
  beforeEach(() => {
    cy.viewport(1440, 1080)
  })

  it('renders the collection featured items with the two items', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([featuredItemOne, featuredItemTwo])

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items').should('exist')

    cy.findByText('Title One').should('exist').should('be.visible')

    cy.findByText('Title Two').should('exist').should('be.visible')
  })

  it('renders custom and dv object featured items', () => {
    collectionRepository.getFeaturedItems = cy
      .stub()
      .resolves([
        collectionDvObjectFeaturedItem,
        datasetDvObjectFeaturedItem,
        fileDvObjectFeaturedItem,
        featuredItemOne
      ])

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items').should('exist')

    cy.findByText('Collection Title').should('exist').should('exist')
    cy.findByText('Dataset Title').should('exist').should('exist')
    cy.findByText('File Title').should('exist').should('exist')
    cy.findByText('Title One').should('exist').should('exist')
  })

  it('does not render the collection featured items when there are no items', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([])

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items').should('not.exist')
  })

  it('shows the skeleton loader while loading if withLoadingSkeleton prop is true', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([])

    cy.customMount(
      <FeaturedItems
        collectionRepository={collectionRepository}
        collectionId={testCollectionId}
        withLoadingSkeleton
      />
    )

    cy.findByTestId('featured-items-skeleton').should('exist')
  })

  it('does not show the skeleton loader while loading if withLoadingSkeleton prop is false', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([])

    cy.customMount(
      <FeaturedItems
        collectionRepository={collectionRepository}
        collectionId={testCollectionId}
        withLoadingSkeleton={false}
      />
    )

    cy.findByTestId('featured-items-skeleton').should('not.exist')
  })

  it('shows the slider navigation buttons when the slider is overflowing', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves(tenTestFeaturedItems)

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items-slider-prev-btn').should('exist')
    cy.findByTestId('featured-items-slider-next-btn').should('exist')
  })

  it('disabled next button when the slider is at the end', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves(tenTestFeaturedItems)

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items-slider-next-btn').should('not.be.disabled')
    cy.findByTestId('featured-items-slider-next-btn').click()

    cy.wait(500)
    cy.findByTestId('featured-items-slider-next-btn').click()

    cy.findByTestId('featured-items-slider-next-btn').should('be.disabled')
  })

  it('disabled back button when the slider is at the beginning', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves(tenTestFeaturedItems)

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items-slider-prev-btn').should('be.disabled')

    cy.findByTestId('featured-items-slider-next-btn').click()

    cy.wait(500)

    cy.findByTestId('featured-items-slider-prev-btn').should('not.be.disabled')

    cy.findByTestId('featured-items-slider-prev-btn').click()

    cy.wait(500)

    cy.findByTestId('featured-items-slider-prev-btn').should('be.disabled')
  })
})

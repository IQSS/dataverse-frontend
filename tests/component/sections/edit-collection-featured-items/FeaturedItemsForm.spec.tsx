import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/ContentField'
import { FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/ImageField'
import { FeaturedItemsForm } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from '@/sections/edit-collection-featured-items/types'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

// TODO:ME Test the form submition, way to test toast?

const collectionRepository = {} as CollectionRepository
const testCollection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = CollectionFeaturedItemMother.createFeaturedItem({
  id: 'item-1-id',
  type: 'custom',
  imageUrl: 'https://loremflickr.com/320/240',
  order: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const featuredItemTwo = CollectionFeaturedItemMother.createFeaturedItem({
  id: 'item-2-id',
  type: 'custom',
  order: 2,
  content: '<h1 class="rte-heading">Featured Item Two</h1>',
  imageUrl: undefined
})

const testFeaturedItems = [featuredItemOne, featuredItemTwo]

const emptyFeaturedItems = {
  featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems([])
}

const formDefaultValues: FeaturedItemsFormData = {
  featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(testFeaturedItems)
}

describe('FeaturedItemsForm', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)
  })
  it('renders the default form correctly', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={emptyFeaturedItems}
        collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
      />
    )

    cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

    cy.get('@first-item').within(() => {
      cy.findByLabelText(/Content/)
        .should('exist')
        .should('be.visible')

      cy.findByLabelText(/Image/).should('exist').should('be.visible')
    })

    cy.findByTestId('featured-item-1').should('not.exist')
  })

  it('renders the form with the default values correctly', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
        collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
      />
    )

    cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

    cy.get('@first-item').within(() => {
      cy.findByText('Order 1').should('exist').should('be.visible')

      cy.findByLabelText(/Content/)
        .should('be.visible')
        .should('have.attr', 'aria-required', 'true')
        .should('contain', 'Featured Item One')

      // Asserting that the input only exists but not visible, as this first item has an image we show the preview instead
      cy.findByLabelText(/Image/).should('exist')

      // Asserting that the existing image is shown
      cy.findByTestId('existing-file-img-0')
        .should('exist')
        .should('be.visible')
        .should('have.attr', 'src')
        .should('include', featuredItemOne.imageUrl)
    })

    cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

    cy.get('@second-item').within(() => {
      cy.findByText('Order 2').should('exist').should('be.visible')

      cy.findByLabelText(/Content/)
        .should('exist')
        .should('be.visible')
        .should('have.attr', 'aria-required', 'true')
        .should('contain', 'Featured Item Two')

      // As it does not have an image, the input should be visible
      cy.findByLabelText(/Image/).should('exist').should('be.visible')
    })
  })

  describe('Image Field', () => {
    it('should show the new selected image preview', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 })
          .then((harvardUniImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardUniImage,
                fileName: 'harvard_uni.png',
                mimeType: 'image/png'
              },
              { action: 'select' }
            )
          })
          .then(($input: JQuery<HTMLInputElement>) => {
            const files = $input[0].files

            expect(files?.[0].name).to.eq('harvard_uni.png')
            expect(files?.[0].type).to.eq('image/png')

            // Asserting that the new selected image generated a preview
            cy.findByTestId('selected-file-img-1')
              .should('exist')
              .should('be.visible')
              .should('have.attr', 'src')
              .should('include', 'blob:')
          })
      })
    })

    it('should change the initial image to the new selected image', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.get(`[aria-label="Change image"]`).should('exist').should('be.visible').click()

        cy.fixture('images/harvard_building.png', null, { timeout: 10_0000 })
          .then((harvardBuildingImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardBuildingImage,
                fileName: 'harvard_building.png',
                mimeType: 'image/png'
              },
              { action: 'select', force: true }
            )
          })
          .then(($input: JQuery<HTMLInputElement>) => {
            const files = $input[0].files

            expect(files?.[0].name).to.eq('harvard_building.png')
            expect(files?.[0].type).to.eq('image/png')

            // Asserting that the new selected image generated a preview
            cy.findByTestId('selected-file-img-0')
              .should('exist')
              .should('be.visible')
              .should('have.attr', 'src')
              .should('include', 'blob:')
          })
      })
    })

    it('should remove the initial image and then restore it', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        // Asserting that the existing image is shown
        cy.findByTestId('existing-file-img-0')
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'src')
          .should('include', featuredItemOne.imageUrl)

        cy.get(`[aria-label="Remove image"]`).should('exist').should('be.visible').click()

        // Asserting that the image preview is removed
        cy.findByTestId('existing-file-img-0').should('not.exist')

        // Restore initial image
        cy.get(`[aria-label="Restore initial image"]`).should('exist').should('be.visible').click()

        // Asserting that the existing image is shown again
        cy.findByTestId('existing-file-img-0')
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'src')
          .should('include', featuredItemOne.imageUrl)
      })
    })

    it('should change the initial image to the new selected image and then restore it', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.get(`[aria-label="Change image"]`).should('exist').should('be.visible').click()

        cy.fixture('images/harvard_building.png', null, { timeout: 10_0000 })
          .then((harvardBuildingImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardBuildingImage,
                fileName: 'harvard_building.png',
                mimeType: 'image/png'
              },
              { action: 'select', force: true }
            )
          })
          .then(($input: JQuery<HTMLInputElement>) => {
            const files = $input[0].files

            expect(files?.[0].name).to.eq('harvard_building.png')
            expect(files?.[0].type).to.eq('image/png')

            // Asserting that the new selected image generated a preview
            cy.findByTestId('selected-file-img-0')
              .should('exist')
              .should('be.visible')
              .should('have.attr', 'src')
              .should('include', 'blob:')
          })

        // Restore initial image
        cy.get(`[aria-label="Restore initial image"]`).should('exist').should('be.visible').click()

        // Asserting that the existing image is shown again
        cy.findByTestId('existing-file-img-0')
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'src')
          .should('include', featuredItemOne.imageUrl)
      })
    })

    it('should remove the just selected image', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 })
          .then((harvardUniImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardUniImage,
                fileName: 'harvard_uni.png',
                mimeType: 'image/png'
              },
              { action: 'select' }
            )
          })
          .then(($input: JQuery<HTMLInputElement>) => {
            const files = $input[0].files

            expect(files?.[0].name).to.eq('harvard_uni.png')
            expect(files?.[0].type).to.eq('image/png')

            // Asserting that the new selected image generated a preview
            cy.findByTestId('selected-file-img-1')
              .should('exist')
              .should('be.visible')
              .should('have.attr', 'src')
              .should('include', 'blob:')

            cy.get(`[aria-label="Remove image"]`).should('exist').should('be.visible').click()

            // Asserting that the image preview is removed
            cy.findByTestId('existing-file-img-1').should('not.exist')
          })
      })
    })
  })

  describe('Add and Remove Featured Items', () => {
    it('should add a new item when clicking the add button', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-1"]').should('not.exist')

      cy.get('@first-item').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.get('[data-testid="featured-item-1"]').should('exist').should('be.visible')
    })

    it('should remove an item when clicking the remove button', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-1"]').should('not.exist')

      cy.get('@first-item').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.get('[data-testid="featured-item-1"]').should('exist').should('be.visible')

      cy.get('[data-testid="featured-item-1"]').within(() => {
        cy.get(`[aria-label="Remove Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.get('[data-testid="featured-item-1"]').should('not.exist')
    })

    it('should show the top save button when there are more than 3 items', () => {
      const localTestFeaturedItemThree = CollectionFeaturedItemMother.createFeaturedItem({
        id: 'item-3-id',
        type: 'custom',
        order: 3,
        content: '<h1 class="rte-heading">Featured Item Three</h1>',
        imageUrl: undefined
      })

      const localTestFeaturedItemFour = CollectionFeaturedItemMother.createFeaturedItem({
        id: 'item-4-id',
        type: 'custom',
        order: 4,
        content: '<h1 class="rte-heading">Featured Item Four</h1>',
        imageUrl: undefined
      })

      const fourFeaturedItems = [
        featuredItemOne,
        featuredItemTwo,
        localTestFeaturedItemThree,
        localTestFeaturedItemFour
      ]

      const formDefaultValuesWith4Items: FeaturedItemsFormData = {
        featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(fourFeaturedItems)
      }

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValuesWith4Items}
          collectionFeaturedItems={fourFeaturedItems}
        />
      )

      cy.get('[data-testid="featured-item-0"]').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-1"]').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-2"]').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-3"]').should('exist').should('be.visible')

      cy.findAllByRole('button', { name: /Save Changes/ }).should('have.length', 2)
    })
  })

  describe('Form Validations', () => {
    it('should show an error message when the image is too big', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        const twiceSupportedSize = 2 * FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED
        const bigFile = Cypress.Buffer.alloc(twiceSupportedSize)
        bigFile.write('big-file-test', twiceSupportedSize)

        cy.findByLabelText(/Image/).selectFile({
          contents: bigFile,
          fileName: 'big-file-test.png',
          mimeType: 'image/png'
        })

        cy.findByText(/The file is too large./)
          .should('exist')
          .should('be.visible')
      })
    })

    it('should show an error message when the content is larger than max length accepted', () => {
      const featuredItemOne = CollectionFeaturedItemMother.createFeaturedItem({
        id: 'item-1-id',
        type: 'custom',
        imageUrl: 'https://loremflickr.com/320/240',
        order: 1,
        content: `<p class="rte-paragraph">${'a'.repeat(
          FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED
        )}</p>`
      })

      const testFeaturedItemWithLongText = [featuredItemOne]

      const formDefaultValues: FeaturedItemsFormData = {
        featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(
          testFeaturedItemWithLongText
        )
      }

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      // Type one more letter to enable the submit button because the initial value changed
      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/).type('a')
      })

      cy.findByRole('button', { name: /Save Changes/ })
        .should('be.visible')
        .should('be.enabled')
        .click()

      cy.get('@first-item').within(() => {
        cy.findByText(/Content must be 15000 characters or less./)
          .should('exist')
          .should('be.visible')
      })

      // Now change the input value to be less than the max length accepted
      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/)
          .clear()
          .type('a')

        cy.findByText(/Content must be 15000 characters or less./).should('not.exist')
      })
    })

    it('should show content required error message when the content is empty', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        cy.findByLabelText(/Content/).clear()

        cy.findByText(/Content is required/)
          .should('exist')
          .should('be.visible')
      })
    })
  })

  describe('Order Items Drag and Drop', () => {
    it('should change the order of the items when dragging and dropping', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.findByText('Order 1').should('exist').should('be.visible')

        cy.findByLabelText(/Content/)
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'aria-required', 'true')
          .should('contain', 'Featured Item One')
      })

      cy.get('@second-item').within(() => {
        cy.findByText('Order 2').should('exist').should('be.visible')

        cy.findByLabelText(/Content/)
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'aria-required', 'true')
          .should('contain', 'Featured Item Two')

        // Drag and drop the second item to the first position
        cy.findByLabelText('press space to select and keys to drag')
          .as('dragHandle')
          .realMouseDown()
          .realMouseMove(0, -200)
          .wait(200)
          .realMouseUp()
      })

      // Now we assert that the order of the items has changed by checking the content of each item
      cy.get('@first-item').within(() => {
        cy.findByText('Order 1').should('exist').should('be.visible')

        cy.findByLabelText(/Content/)
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'aria-required', 'true')
          .should('contain', 'Featured Item Two')
      })

      cy.get('@second-item').within(() => {
        cy.findByText('Order 2').should('exist').should('be.visible')

        cy.findByLabelText(/Content/)
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'aria-required', 'true')
          .should('contain', 'Featured Item One')
      })
    })
  })
})

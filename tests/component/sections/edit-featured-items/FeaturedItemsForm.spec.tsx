import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import {
  FeaturedItemsDTO,
  CustomFeaturedItemDTO,
  DvObjectFeaturedItemDTO
} from '@/collection/domain/useCases/DTOs/FeaturedItemsDTO'
import { FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/custom-form-item/ContentField'
import { FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/custom-form-item/ImageField'
import { FeaturedItemsForm } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from '@/sections/edit-collection-featured-items/types'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

const collectionRepository = {} as CollectionRepository
const testCollection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = FeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  imageFileUrl: 'https://picsum.photos/id/237/200/300',
  displayOrder: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const featuredItemTwo = FeaturedItemMother.createCustomFeaturedItem('books', {
  id: 2,
  displayOrder: 2,
  content: '<h1 class="rte-heading">Featured Item Two</h1>',
  imageFileUrl: undefined
})

const testFeaturedItems = [featuredItemOne, featuredItemTwo]

const emptyFeaturedItems = {
  featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems([])
}

const formDefaultValues: FeaturedItemsFormData = {
  featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(testFeaturedItems)
}

const toggleEditButton = () => cy.findByTestId('toggle-edit').click()
const selectCustomFeaturedItemType = () => cy.findByTestId('base-form-item-custom-option').click()

const selectDvObjectFeaturedItemType = () =>
  cy.findByTestId('base-form-item-dvobject-option').click()

describe('FeaturedItemsForm', () => {
  beforeEach(() => {
    cy.viewport(1440, 824)
  })

  it('renders the Select Featured Item Type UI initally if collection has no featured items', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={emptyFeaturedItems}
        initialExistingFeaturedItems={[]}
      />
    )

    cy.findByTestId('base-form-item-0').as('base-item').should('exist').should('be.visible')
  })

  it('renders the form with the default values correctly', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
        initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
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
        .should('include', featuredItemOne.imageFileUrl)
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
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

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
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

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
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

        // Asserting that the existing image is shown
        cy.findByTestId('existing-file-img-0')
          .should('exist')
          .should('be.visible')
          .should('have.attr', 'src')
          .should('include', featuredItemOne.imageFileUrl)

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
          .should('include', featuredItemOne.imageFileUrl)
      })
    })

    it('should change the initial image to the new selected image and then restore it', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

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
          .should('include', featuredItemOne.imageFileUrl)
      })
    })

    it('should remove the just selected image', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

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

    it('should show the aspect-ratio warning message if the selected image does not have the recommended aspect ratio', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('aspect-ratio-warning-0').should('not.exist')
      cy.findByTestId('image-helper-text-0').should('exist')

      // Testing with this harvard_uni image as it has a dimension of 800x779 and will trigger the warning
      cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 })
        .then((harvardUniImage: ArrayBuffer) => {
          cy.findByLabelText(/Image/).selectFile(
            {
              contents: harvardUniImage,
              fileName: 'harvard_uni.png',
              mimeType: 'image/png'
            },
            { action: 'select', force: true }
          )
        })
        .then(() => {
          cy.findByTestId('aspect-ratio-warning-0').should('exist')
          cy.findByTestId('image-helper-text-0').should('not.exist')
        })
    })

    it('neither helper text nor warning message should be shown if the image is invalid', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.findByTestId('image-helper-text-0').should('exist')
      cy.findByTestId('aspect-ratio-warning-0').should('not.exist')
      cy.findByTestId('image-invalid-message-0').should('not.exist')

      // Testing with this harvard_uni image as it has a dimension of 800x779 and will trigger the warning
      cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 })
        .then((harvardUniImage: ArrayBuffer) => {
          cy.findByLabelText(/Image/).selectFile(
            {
              contents: harvardUniImage,
              fileName: 'harvard_uni.png',
              mimeType: 'image/png'
            },
            { action: 'select', force: true }
          )
        })
        .then(() => {
          cy.findByTestId('image-helper-text-0').should('not.exist')
          cy.findByTestId('aspect-ratio-warning-0').should('exist')
          cy.findByTestId('image-invalid-message-0').should('not.exist')
        })

      // We remove the image and select a big image to trigger the size validation error
      cy.get(`[aria-label="Remove image"]`).should('exist').should('be.visible').click()

      const twiceSupportedSize = 2 * FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED
      const bigFile = Cypress.Buffer.alloc(twiceSupportedSize)
      bigFile.write('big-file-test', twiceSupportedSize)

      cy.findByLabelText(/Image/).selectFile({
        contents: bigFile,
        fileName: 'big-file-test.png',
        mimeType: 'image/png'
      })
      cy.findByTestId('image-helper-text-0').should('not.exist')
      cy.findByTestId('aspect-ratio-warning-0').should('not.exist')
      cy.findByTestId('image-invalid-message-0').should('exist')
    })
  })

  describe('Dataverse Object URL Field', () => {
    it('should show the correct type and identifier when entering a valid Dataverse object URL', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })

      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')

      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .type('https://foo.com/spa/collections/foo')

      cy.findByTestId('dv-object-info').within(() => {
        cy.contains('Type: collection').should('exist').should('be.visible')
        cy.contains('Identifier: foo').should('exist').should('be.visible')
      })

      cy.findByLabelText(/Dataverse Object URL/)
        .clear()
        .type('https://foo.com/spa/datasets?persistentId=doi:10.5072/FK2/HIS9DO')

      cy.findByTestId('dv-object-info').within(() => {
        cy.contains('Type: dataset').should('exist').should('be.visible')
        cy.contains('Identifier: doi:10.5072/FK2/HIS9DO').should('exist').should('be.visible')
      })

      cy.findByLabelText(/Dataverse Object URL/)
        .clear()
        .type('https://foo.com/spa/files?id=4')

      cy.findByTestId('dv-object-info').within(() => {
        cy.contains('Type: file').should('exist').should('be.visible')
        cy.contains('Identifier: 4').should('exist').should('be.visible')
      })

      cy.findByLabelText(/Dataverse Object URL/).clear()

      cy.findByTestId('dv-object-info').should('not.exist')
    })

    it('should show required error when leaving the field empty', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })

      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')

      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .type('foo')
        .clear()

      cy.findByText(/Dataverse Object URL is required/)
        .should('exist')
        .should('be.visible')
    })

    it('should show invalid URL error when entering an invalid Dataverse object URL', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })

      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')

      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .type('invalid-url')

      cy.findByText(/The URL must have the correct format/)
        .should('exist')
        .should('be.visible')
    })
  })

  it('should add a new item when clicking the add button', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
        initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
      />
    )

    cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
    cy.get('[data-testid="featured-item-2"]').should('not.exist')

    cy.get('@second-item').within(() => {
      cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
    })

    cy.findByTestId('featured-item-2').should('exist').should('be.visible')
    cy.findByTestId('base-form-item-2').should('exist').should('be.visible')
  })

  describe('Remove Featured Item Button', () => {
    it('should remove an item when clicking the remove button', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('featured-item-1').should('not.exist')

      // This item should not have the remove button as it is the first and only item
      cy.findByTestId('featured-item-0').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('featured-item-1').should('exist')

      cy.findByTestId('featured-item-1').within(() => {
        cy.get(`[aria-label="Remove Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('featured-item-1').should('not.exist')
    })

    it('should show remove confirmation dialog if user has entered some data in the fields and confirm removal', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('featured-item-1').should('not.exist')

      // This item should not have the remove button as it is the first and only item
      cy.findByTestId('featured-item-0').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('featured-item-1').should('exist')

      cy.findByTestId('featured-item-1').within(() => {
        selectCustomFeaturedItemType()

        // First enter some data in the content field
        cy.findByLabelText(/Content/).type('Some content for the featured item')

        cy.get(`[aria-label="Remove Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(/If you continue, your changes will be discarded./).should('exist')

        cy.findByRole('button', { name: /Continue/ }).click()
      })

      cy.findByTestId('featured-item-1').should('not.exist')
    })

    it('should show remove confirmation dialog if user has entered some data in the fields and cancel removal', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('featured-item-1').should('not.exist')

      // This item should not have the remove button as it is the first and only item
      cy.findByTestId('featured-item-0').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('featured-item-1').should('exist')

      cy.findByTestId('featured-item-1').within(() => {
        selectCustomFeaturedItemType()

        // First enter some data in the content field
        cy.findByLabelText(/Content/).type('Some content for the featured item')

        cy.get(`[aria-label="Remove Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(/If you continue, your changes will be discarded./).should('exist')

        cy.findByRole('button', { name: /Cancel/ }).click()
      })

      cy.findByTestId('featured-item-1').should('exist')
    })
  })

  describe('Back To Type Selection button', () => {
    it('should go back to the Select Featured Item Type UI when clicking the back button', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('[data-testid="custom-form-item-0"]').should('not.exist')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })
      cy.findByTestId('custom-form-item-0').should('exist').should('be.visible')
      cy.findByTestId('back-to-type-selection-button').should('exist').should('be.visible')
      cy.findByTestId('back-to-type-selection-button').click()
      cy.findByTestId('base-form-item-0').should('exist').should('be.visible')
      cy.get('[data-testid="custom-form-item-0"]').should('not.exist')
    })

    it('should show the confirm discard changes dialog when trying to go back to the Select Featured Item Type UI with unsaved changes and clear errors from the form', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })

      // Generate an error in the form by entering an incorrect dataverse object URL
      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .type('invalid-url')

      cy.findByText(/The URL must have the correct format/)
        .should('exist')
        .should('be.visible')

      // We now click the back button and as we have entered some new data the confirm discard changes dialog should be shown
      cy.findByTestId('back-to-type-selection-button').click()

      cy.findByRole('dialog').within(() => {
        cy.findByText(/If you go back, your changes will be discarded./).should('exist')

        cy.findByRole('button', { name: /Continue/ }).click()
      })

      cy.findByTestId('base-form-item-0').should('exist')

      // We now select again the dv object type and validate that the error is cleared
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })
      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')
      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .should('have.value', '') // The input should be cleared

      cy.findByText(/The URL must have the correct format/).should('not.exist')
    })

    it('should show the confirm discard changes dialog and stay if users cancels going back', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectDvObjectFeaturedItemType()
      })

      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')

      cy.findByLabelText(/Dataverse Object URL/)
        .should('exist')
        .should('be.visible')
        .type('https://foo.com/collections/foo')

      cy.findByTestId('back-to-type-selection-button').click()

      cy.findByRole('dialog').within(() => {
        cy.findByText(/If you go back, your changes will be discarded./).should('exist')

        cy.findByRole('button', { name: /Cancel/ }).click()
      })
      cy.findByTestId('dvobject-form-item-0').should('exist').should('be.visible')
      cy.get('[data-testid="base-form-item-0"]').should('not.exist')
    })
  })

  describe('Delete Single Featured Item', () => {
    it('should delete a single featured item when clicking the delete button and confirming the action', () => {
      collectionRepository.deleteFeaturedItem = cy.stub().as('deleteFeaturedItem').resolves()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')

        cy.findByRole('button', { name: /Delete/ }).click()
      })

      cy.get('@deleteFeaturedItem').should((spy) => {
        const deleteFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const deletedFeaturedItemIdNumber = deleteFeaturedItemsSpy.getCall(0).args[0] as number

        expect(deleteFeaturedItemsSpy).to.be.calledOnce
        expect(deletedFeaturedItemIdNumber).to.equal(featuredItemTwo.id)
      })

      cy.get('[data-testid="featured-item-1"]').should('not.exist')

      cy.findByText(/Featured item has been deleted successfully./)
        .should('exist')
        .should('be.visible')
    })

    it('should not delete a single featured item when clicking the delete button and canceling the action', () => {
      collectionRepository.deleteFeaturedItem = cy.stub().as('deleteFeaturedItem').resolves()
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })
      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')
        cy.findByRole('button', { name: /Cancel/ }).click()
      })
      cy.get('@deleteFeaturedItem').should('not.be.called')
      cy.findByTestId('featured-item-1').should('exist').should('be.visible')
    })

    it('should show WriteError when trying to delete a single featured item and receiving a WriteError from JS-dataverse', () => {
      const errorMessage = 'Error deleting featured item'
      collectionRepository.deleteFeaturedItem = cy
        .stub()
        .as('deleteFeaturedItem')
        .rejects(new WriteError(errorMessage))

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')

        cy.findByRole('button', { name: /Delete/ }).click()
      })

      cy.get('@deleteFeaturedItem').should((spy) => {
        const deleteFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const deletedFeaturedItemIdNumber = deleteFeaturedItemsSpy.getCall(0).args[0] as number

        expect(deleteFeaturedItemsSpy).to.be.calledOnce
        expect(deletedFeaturedItemIdNumber).to.equal(featuredItemTwo.id)
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(errorMessage).should('exist').should('be.visible')
        // Close dialog for next test
        cy.findByRole('button', { name: /Cancel/ }).click()
      })
    })

    it('should show fallback error when trying to delete a single featured item and not receiving an instance of WriteError from JS-dataverse', () => {
      collectionRepository.deleteFeaturedItem = cy.stub().as('deleteFeaturedItem').rejects()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')

        cy.findByRole('button', { name: /Delete/ }).click()
      })

      cy.get('@deleteFeaturedItem').should((spy) => {
        const deleteFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const deletedFeaturedItemIdNumber = deleteFeaturedItemsSpy.getCall(0).args[0] as number

        expect(deleteFeaturedItemsSpy).to.be.calledOnce
        expect(deletedFeaturedItemIdNumber).to.equal(featuredItemTwo.id)
      })

      cy.findByRole('dialog').within(() => {
        cy.findByText('An error occurred while deleting the featured item. Please try again later.')
          .should('exist')
          .should('be.visible')
        // Close dialog for next test
        cy.findByRole('button', { name: /Cancel/ }).click()
      })
    })

    it('resets the form and show the select featured item type UI when deleting the last featured item', () => {
      collectionRepository.deleteFeaturedItem = cy.stub().as('deleteFeaturedItem').resolves()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      // Delete first item
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })
      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')

        cy.findByRole('button', { name: /Delete/ }).click()
      })

      // Now we have only one item left, so we delete it too
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.get(`[aria-label="Delete Featured Item"]`).should('exist').should('be.visible').click()
      })
      cy.findByRole('dialog').within(() => {
        cy.findByText(/Are you sure you want to delete this featured item?/).should('exist')

        cy.findByRole('button', { name: /Delete/ }).click()
      })

      // We should see the Select Featured Item Type UI again
      cy.findByTestId('base-form-item-0').should('exist').should('be.visible')
    })
  })

  it('should show the top save button when there are at least 3 items', () => {
    const localTestFeaturedItemThree = FeaturedItemMother.createCustomFeaturedItem('css', {
      id: 3,
      displayOrder: 3,
      content: '<h1 class="rte-heading">Featured Item Three</h1>',
      imageFileUrl: undefined
    })

    const testFeaturedItems = [featuredItemOne, featuredItemTwo, localTestFeaturedItemThree]

    const formDefaultValuesWith4Items: FeaturedItemsFormData = {
      featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(testFeaturedItems)
    }

    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValuesWith4Items}
        initialExistingFeaturedItems={testFeaturedItems}
      />
    )

    cy.get('[data-testid="featured-item-0"]').should('exist').should('be.visible')
    cy.get('[data-testid="featured-item-1"]').should('exist').should('be.visible')
    cy.get('[data-testid="featured-item-2"]').should('exist').should('be.visible')

    cy.findAllByRole('button', { name: /Save Changes/ }).should('have.length', 2)
  })

  describe('Form Validations', () => {
    it('should show an error message when the image is too big', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

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
      const featuredItemOne = FeaturedItemMother.createCustomFeaturedItem('css', {
        id: 1,
        imageFileUrl: 'https://picsum.photos/id/237/200/300',
        displayOrder: 1,
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
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      // Type one more letter to enable the submit button because the initial value changed
      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()
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
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.findByLabelText(/Content/).clear()

        cy.findByText(/Content is required/)
          .should('exist')
          .should('be.visible')
      })
    })

    it('should show toast error message when trying to add more than 10 featured items', () => {
      const testFeaturedItems = Array.from({ length: 10 }, (_, index) =>
        FeaturedItemMother.createCustomFeaturedItem('css', {
          id: index,
          displayOrder: index,
          content: `<h1 class="rte-heading">Featured Item ${index}</h1>`,
          imageFileUrl: undefined
        })
      )

      const formDefaultValues: FeaturedItemsFormData = {
        featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(testFeaturedItems)
      }

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={testFeaturedItems}
        />
      )

      cy.findByTestId('featured-item-9').as('last-item').should('exist').should('be.visible')

      cy.get('@last-item').within(() => {
        // Enable edition
        toggleEditButton()
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByText(/You can add up to 10 featured items./)
        .should('exist')
        .should('be.visible')
    })

    it('should show an error message when submitting the form with a base form item without selecting a type', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      // Add a new item and do not select a type
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('base-form-item-2').should('exist').should('be.visible')

      // Submit the form without selecting a type
      cy.findAllByRole('button', { name: /Save Changes/ })
        .eq(0)
        .should('be.visible')
        .should('be.enabled')
        .click()

      cy.findByText(/Please select a type of featured item or remove the item./)
        .should('exist')
        .should('be.visible')
    })
  })

  // TODO: This test is failing in CI sometimes, we need to investigate why and fix it
  it.skip('should change the order of the items ', () => {
    cy.mountAuthenticated(
      <FeaturedItemsForm
        collectionId={testCollection.id}
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
        initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
      />
    )

    cy.wait(200)

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
    })
    // Focus the first item and move it to the second position with the keys
    cy.get('@first-item').within(() => {
      cy.findByLabelText('press space to select and keys to drag')
        .as('dragHandle')
        .focus()
        .type('{enter}')
        .type(
          '{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}{downArrow}',
          { delay: 100 }
        )
        .type('{enter}')
    })

    cy.wait(200)

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

  describe('Form Submission', () => {
    it('should submit the form with the new values and show toast - case when collection dont have initial items', () => {
      collectionRepository.updateFeaturedItems = cy.stub().as('updateFeaturedItems').resolves()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      // Create a custom featured item
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/).type('New Content')

        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('base-form-item-1').within(() => {
        selectCustomFeaturedItemType()
      })

      // Add a second item with content and image
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')

      cy.get('@second-item').within(() => {
        cy.findByLabelText(/Content/).type('New Content 2')

        cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 }).then(
          (harvardUniImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardUniImage,
                fileName: 'harvard_uni.png',
                mimeType: 'image/png'
              },
              { action: 'select' }
            )
          }
        )

        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('base-form-item-2').within(() => {
        selectDvObjectFeaturedItemType()
      })

      // Add a second item with content and image
      cy.findByTestId('featured-item-2').as('third-item').should('exist').should('be.visible')

      cy.get('@third-item').within(() => {
        cy.findByLabelText(/Dataverse Object URL/).type(
          'http://localhost:8000/spa/collections/dataverse-admin-collection'
        )
        cy.findByTestId('dv-object-info').within(() => {
          cy.contains('Type: collection').should('exist').should('be.visible')
          cy.contains('Identifier: dataverse-admin-collection').should('exist').should('be.visible')
        })
      })

      // Submit the form
      cy.findAllByRole('button', { name: /Save Changes/ })
        .eq(0)
        .should('be.visible')
        .should('be.enabled')
        .click()

      cy.get('@updateFeaturedItems').should((spy) => {
        const updateFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const featuredItemsDTO = updateFeaturedItemsSpy.getCall(0).args[1] as FeaturedItemsDTO

        expect(updateFeaturedItemsSpy).to.be.calledOnce

        const firstItem = featuredItemsDTO[0] as CustomFeaturedItemDTO
        const secondItem = featuredItemsDTO[1] as CustomFeaturedItemDTO
        const thirdItem = featuredItemsDTO[2] as DvObjectFeaturedItemDTO

        // First item, content only
        expect(firstItem.id).to.eq(undefined)
        expect(firstItem.displayOrder).to.eq(0)
        expect(firstItem.content).to.eq('<p class="rte-paragraph">New Content</p>')
        expect(firstItem.file).to.eq(undefined)
        expect(firstItem.keepFile).to.eq(false)

        // Second item with content and image
        expect(secondItem.id).to.eq(undefined)
        expect(secondItem.displayOrder).to.eq(1)
        expect(secondItem.content).to.eq('<p class="rte-paragraph">New Content 2</p>')
        expect(secondItem.file).to.not.eq(undefined)
        expect(secondItem.file?.name).to.eq('harvard_uni.png')
        expect(secondItem.keepFile).to.eq(false)

        // Third item, dv object
        expect(thirdItem.id).to.eq(undefined)
        expect(thirdItem.displayOrder).to.eq(2)
        expect(thirdItem.dvObjectIdentifier).to.eq('dataverse-admin-collection')
        expect(thirdItem.type).to.eq('collection')
      })

      cy.findByText(/Featured items have been updated successfully./)
        .should('exist')
        .should('be.visible')
    })

    it('should submit the form with the new values and show toast - case when collection has initial items', () => {
      collectionRepository.updateFeaturedItems = cy.stub().as('updateFeaturedItems').resolves()

      const featuredItemThree = FeaturedItemMother.createCustomFeaturedItem('css', {
        id: 3,
        displayOrder: 3,
        content: '<h1 class="rte-heading">Featured Item Two</h1>',
        imageFileUrl: undefined
      })

      const formDefaultValues: FeaturedItemsFormData = {
        featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems([
          featuredItemOne,
          featuredItemTwo,
          featuredItemThree
        ])
      }

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo, featuredItemThree]}
        />
      )
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.findByTestId('featured-item-2').as('third-item').should('exist').should('be.visible')
      // Change the content of the first item

      cy.get('@first-item').within(() => {
        // Enable edition
        toggleEditButton()

        cy.findByLabelText(/Content/)
          .clear()
          .type('New Content')
      })

      cy.get('@third-item').within(() => {
        // Enable edition
        toggleEditButton()

        // Change the image of the third item
        cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 }).then(
          (harvardUniImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardUniImage,
                fileName: 'harvard_uni.png',
                mimeType: 'image/png'
              },
              { action: 'select' }
            )
          }
        )
        // Add a fourth item with content and image
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByTestId('base-form-item-3').within(() => {
        selectCustomFeaturedItemType()
      })

      cy.findByTestId('featured-item-3').as('fourth-item').should('exist').should('be.visible')

      cy.get('@fourth-item').within(() => {
        cy.findByLabelText(/Content/).type('New Content 4')

        cy.fixture('images/harvard_uni.png', null, { timeout: 10_0000 }).then(
          (harvardUniImage: ArrayBuffer) => {
            cy.findByLabelText(/Image/).selectFile(
              {
                contents: harvardUniImage,
                fileName: 'harvard_uni.png',
                mimeType: 'image/png'
              },
              { action: 'select' }
            )
          }
        )
      })

      // Submit the form with the top save button, as we show one on top and one on the bottom since we have 3 items
      cy.findAllByRole('button', { name: /Save Changes/ })
        .should('be.visible')
        .should('be.enabled')
        .first()
        .click()

      cy.get('@updateFeaturedItems').should((spy) => {
        const updateFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const featuredItemsDTO = updateFeaturedItemsSpy.getCall(0).args[1] as FeaturedItemsDTO

        const firstItem = featuredItemsDTO[0] as CustomFeaturedItemDTO
        const secondItem = featuredItemsDTO[1] as CustomFeaturedItemDTO
        const thirdItem = featuredItemsDTO[2] as CustomFeaturedItemDTO
        const fourthItem = featuredItemsDTO[3] as CustomFeaturedItemDTO

        expect(updateFeaturedItemsSpy).to.be.calledOnce

        // First item, content changed
        expect(firstItem.id).to.eq(1)
        expect(firstItem.displayOrder).to.eq(0)
        expect(firstItem.content).to.eq('<p class="rte-paragraph">New Content</p>')
        expect(firstItem.file).to.eq(undefined)
        expect(firstItem.keepFile).to.eq(true)

        // Second item, untouched
        expect(secondItem.id).to.eq(2)
        expect(secondItem.displayOrder).to.eq(1)
        expect(secondItem.content).to.eq(featuredItemTwo.content)
        expect(secondItem.file).to.eq(undefined)
        expect(secondItem.keepFile).to.eq(false)

        // Third item, image changed
        expect(thirdItem.id).to.eq(3)
        expect(thirdItem.displayOrder).to.eq(2)
        expect(thirdItem.content).to.eq(featuredItemThree.content)
        expect(thirdItem.file).to.not.eq(undefined)
        expect(thirdItem.file?.name).to.eq('harvard_uni.png')
        expect(thirdItem.keepFile).to.eq(false)

        // New fourth item with content and image
        expect(fourthItem.id).to.eq(undefined)
        expect(fourthItem.displayOrder).to.eq(3)
        expect(fourthItem.content).to.eq('<p class="rte-paragraph">New Content 4</p>')
        expect(fourthItem.file).to.not.eq(undefined)
        expect(fourthItem.file?.name).to.eq('harvard_uni.png')
        expect(fourthItem.keepFile).to.eq(false)
      })

      cy.findByText(/Featured items have been updated successfully./)
        .should('exist')
        .should('be.visible')
    })

    it('should show an error toast when the form submission fails', () => {
      collectionRepository.updateFeaturedItems = cy
        .stub()
        .as('updateFeaturedItems')
        .rejects(new Error('Test Error'))

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByTestId('base-form-item-0').as('first-item').should('exist').should('be.visible')
      cy.get('@first-item').within(() => {
        selectCustomFeaturedItemType()
      })

      // Add content to the default empy first item
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/).type('New Content')
      })

      // Submit the form
      cy.findByRole('button', { name: /Save Changes/ })
        .should('be.visible')
        .should('be.enabled')
        .click()

      cy.findByText(/Test Error/)
        .should('exist')
        .should('be.visible')

      cy.findByText(/Featured items have been updated successfully./).should('not.exist')
    })
  })

  describe('Delete All Featured Items', () => {
    it('should not show the delete all button when the collection has no initial items', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          initialExistingFeaturedItems={[]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ }).should('not.exist')
    })

    it('should show the delete all button when the collection has initial items', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ })
        .should('exist')
        .should('be.visible')
    })

    it('should show the confirmation modal when clicking the delete all button', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ })
        .should('exist')
        .should('be.visible')
        .click()

      cy.findByRole('dialog').should('exist').should('be.visible')
    })

    it('should cancel the delete all action when clicking the cancel button in the confirmation modal', () => {
      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ })
        .should('exist')
        .should('be.visible')
        .click()

      cy.findByRole('dialog').should('exist').should('be.visible')

      cy.findByRole('button', { name: /Cancel/ }).click()

      cy.findByRole('dialog').should('not.exist')
    })

    it('should delete all featured items when clicking the confirm button in the confirmation modal', () => {
      collectionRepository.deleteFeaturedItems = cy.stub().as('deleteFeaturedItems').resolves()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ })
        .should('exist')
        .should('be.visible')
        .click()

      cy.findByRole('dialog').should('exist').should('be.visible')

      cy.findByRole('button', { name: /Continue/ }).click()

      cy.get('@deleteFeaturedItems').should((spy) => {
        const deleteAllFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionId = deleteAllFeaturedItemsSpy.getCall(0).args[0] as string

        expect(deleteAllFeaturedItemsSpy).to.be.calledOnce
        expect(collectionId).to.eq(testCollection.id)
      })

      cy.findByText(/All featured items have been deleted successfully./)
        .should('exist')
        .should('be.visible')
    })

    it('should show error toast if delete all featured items fails', () => {
      collectionRepository.deleteFeaturedItems = cy
        .stub()
        .as('deleteFeaturedItems')
        .rejects(new Error('Test Error: featured items failed to delete'))

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
          initialExistingFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

      cy.findByRole('button', { name: /Delete all featured items/ })
        .should('exist')
        .should('be.visible')
        .click()

      cy.findByRole('dialog').should('exist').should('be.visible')

      cy.findByRole('button', { name: /Continue/ }).click()

      cy.findByText(/Test Error: featured items failed to delete/)
        .should('exist')
        .should('be.visible')

      cy.findByText(/All featured items have been deleted successfully./).should('not.exist')
    })
  })
})

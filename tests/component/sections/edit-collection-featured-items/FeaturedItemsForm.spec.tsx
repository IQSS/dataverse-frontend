import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItemsDTO } from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'
import { FEATURED_ITEM_CONTENT_MAX_LENGTH_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/ContentField'
import { FEATURED_ITEM_IMAGE_MAX_SIZE_ACCEPTED } from '@/sections/edit-collection-featured-items/featured-items-form/featured-item-field/ImageField'
import { FeaturedItemsForm } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsForm'
import { FeaturedItemsFormHelper } from '@/sections/edit-collection-featured-items/featured-items-form/FeaturedItemsFormHelper'
import { FeaturedItemsFormData } from '@/sections/edit-collection-featured-items/types'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

const collectionRepository = {} as CollectionRepository
const testCollection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  imageFileUrl: 'https://loremflickr.com/320/240',
  displayOrder: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const featuredItemTwo = CollectionFeaturedItemMother.createCustomFeaturedItem('books', {
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

describe('FeaturedItemsForm', () => {
  beforeEach(() => {
    cy.viewport(1440, 824)
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
          .should('include', featuredItemOne.imageFileUrl)
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

    it('should show the top save button when there are at least 3 items', () => {
      const localTestFeaturedItemThree = CollectionFeaturedItemMother.createCustomFeaturedItem(
        'css',
        {
          id: 3,
          displayOrder: 3,
          content: '<h1 class="rte-heading">Featured Item Three</h1>',
          imageFileUrl: undefined
        }
      )

      const testFeaturedItems = [featuredItemOne, featuredItemTwo, localTestFeaturedItemThree]

      const formDefaultValuesWith4Items: FeaturedItemsFormData = {
        featuredItems: FeaturedItemsFormHelper.defineFormDefaultFeaturedItems(testFeaturedItems)
      }

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValuesWith4Items}
          collectionFeaturedItems={testFeaturedItems}
        />
      )

      cy.get('[data-testid="featured-item-0"]').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-1"]').should('exist').should('be.visible')
      cy.get('[data-testid="featured-item-2"]').should('exist').should('be.visible')

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
      const featuredItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
        id: 1,
        imageFileUrl: 'https://loremflickr.com/320/240',
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

    it('should show toast error message when trying to add more than 10 featured items', () => {
      const testFeaturedItems = Array.from({ length: 10 }, (_, index) =>
        CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
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
          collectionFeaturedItems={testFeaturedItems}
        />
      )

      cy.findByTestId('featured-item-9').as('last-item').should('exist').should('be.visible')

      cy.get('@last-item').within(() => {
        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
      })

      cy.findByText(/You can add up to 10 featured items./)
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
        collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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

  describe('Form Submition', () => {
    it('should submit the form with the new values and show toast - case when collection dont have initial items', () => {
      collectionRepository.updateFeaturedItems = cy.stub().as('updateFeaturedItems').resolves()

      cy.mountAuthenticated(
        <FeaturedItemsForm
          collectionId={testCollection.id}
          collectionRepository={collectionRepository}
          defaultValues={emptyFeaturedItems}
          collectionFeaturedItems={[]}
        />
      )

      // Add content to the default empy first item
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')

      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/).type('New Content')

        cy.get(`[aria-label="Add Featured Item"]`).should('exist').should('be.visible').click()
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
      })

      // Submit the form
      cy.findByRole('button', { name: /Save Changes/ })
        .should('be.visible')
        .should('be.enabled')
        .click()

      cy.get('@updateFeaturedItems').should((spy) => {
        const updateFeaturedItemsSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionFeaturedItemsDTO = updateFeaturedItemsSpy.getCall(0)
          .args[1] as CollectionFeaturedItemsDTO

        expect(updateFeaturedItemsSpy).to.be.calledOnce

        // First item, content only
        expect(collectionFeaturedItemsDTO[0].id).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[0].displayOrder).to.eq(0)
        expect(collectionFeaturedItemsDTO[0].content).to.eq(
          '<p class="rte-paragraph">New Content</p>'
        )
        expect(collectionFeaturedItemsDTO[0].file).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[0].keepFile).to.eq(false)

        // Second item with content and image
        expect(collectionFeaturedItemsDTO[1].id).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[1].displayOrder).to.eq(1)
        expect(collectionFeaturedItemsDTO[1].content).to.eq(
          '<p class="rte-paragraph">New Content 2</p>'
        )
        expect(collectionFeaturedItemsDTO[1].file).to.not.eq(undefined)
        expect(collectionFeaturedItemsDTO[1].file?.name).to.eq('harvard_uni.png')
        expect(collectionFeaturedItemsDTO[1].keepFile).to.eq(false)
      })

      cy.findByText(/Featured items have been updated successfully./)
        .should('exist')
        .should('be.visible')
    })

    it('should submit the form with the new values and show toast - case when collection has initial items', () => {
      collectionRepository.updateFeaturedItems = cy.stub().as('updateFeaturedItems').resolves()

      const featuredItemThree = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo, featuredItemThree]}
        />
      )
      cy.findByTestId('featured-item-0').as('first-item').should('exist').should('be.visible')
      cy.findByTestId('featured-item-1').as('second-item').should('exist').should('be.visible')
      cy.findByTestId('featured-item-2').as('third-item').should('exist').should('be.visible')
      // Change the content of the first item

      cy.get('@first-item').within(() => {
        cy.findByLabelText(/Content/)
          .clear()
          .type('New Content')
      })

      cy.get('@third-item').within(() => {
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
        const collectionFeaturedItemsDTO = updateFeaturedItemsSpy.getCall(0)
          .args[1] as CollectionFeaturedItemsDTO

        expect(updateFeaturedItemsSpy).to.be.calledOnce

        // First item, content changed
        expect(collectionFeaturedItemsDTO[0].id).to.eq(1)
        expect(collectionFeaturedItemsDTO[0].displayOrder).to.eq(0)
        expect(collectionFeaturedItemsDTO[0].content).to.eq(
          '<p class="rte-paragraph">New Content</p>'
        )
        expect(collectionFeaturedItemsDTO[0].file).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[0].keepFile).to.eq(true)

        // Second item, untouched
        expect(collectionFeaturedItemsDTO[1].id).to.eq(2)
        expect(collectionFeaturedItemsDTO[1].displayOrder).to.eq(1)
        expect(collectionFeaturedItemsDTO[1].content).to.eq(featuredItemTwo.content)
        expect(collectionFeaturedItemsDTO[1].file).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[1].keepFile).to.eq(false)

        // Third item, image changed
        expect(collectionFeaturedItemsDTO[2].id).to.eq(3)
        expect(collectionFeaturedItemsDTO[2].displayOrder).to.eq(2)
        expect(collectionFeaturedItemsDTO[2].content).to.eq(featuredItemThree.content)
        expect(collectionFeaturedItemsDTO[2].file).to.not.eq(undefined)
        expect(collectionFeaturedItemsDTO[2].file?.name).to.eq('harvard_uni.png')
        expect(collectionFeaturedItemsDTO[2].keepFile).to.eq(false)

        // New fourth item with content and image
        expect(collectionFeaturedItemsDTO[3].id).to.eq(undefined)
        expect(collectionFeaturedItemsDTO[3].displayOrder).to.eq(3)
        expect(collectionFeaturedItemsDTO[3].content).to.eq(
          '<p class="rte-paragraph">New Content 4</p>'
        )
        expect(collectionFeaturedItemsDTO[3].file).to.not.eq(undefined)
        expect(collectionFeaturedItemsDTO[3].file?.name).to.eq('harvard_uni.png')
        expect(collectionFeaturedItemsDTO[3].keepFile).to.eq(false)
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
        />
      )

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
          collectionFeaturedItems={[]}
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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
          collectionFeaturedItems={[featuredItemOne, featuredItemTwo]}
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

import { CollectionType } from '@/collection/domain/models/CollectionType'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionDTO } from '@/collection/domain/useCases/DTOs/CollectionDTO'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { collectionNameToAlias } from '@/sections/shared/form/EditCreateCollectionForm/collection-form/top-fields-section/IdentifierField'
import { EditCreateCollectionForm } from '@/sections/shared/form/EditCreateCollectionForm/EditCreateCollectionForm'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { CollectionFacetMother } from '@tests/component/collection/domain/models/CollectionFacetMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '@tests/component/metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { UserMother } from '@tests/component/users/domain/models/UserMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const userRepository: UserRepository = {} as UserRepository

const testUser = UserMother.create()

const PARENT_COLLECTION_ID = 'root'
const PARENT_COLLECTION_NAME = 'Root'
const PARENT_COLLECTION_CONTACT_EMAIL = 'root@test.com'

const COLLECTION_BEING_EDITED_ID = 'collection-being-edited-id'
const COLLECTION_BEING_EDITED_NAME = 'Collection In Edition'
const COLLECTION_BEING_EDITED_AFFILIATION = 'Collection In Edition Affiliation'
const COLLECTION_BEING_EDITED_DESCRIPTION = 'Collection In Edition Description'
const COLLECTION_BEING_EDITED_CONTACT_EMAIL = 'collectionEdited@test.com'

const defaultCollectionNameInCreateMode = `${testUser.displayName} Collection`

const collectionBeingEdited = CollectionMother.create({
  id: COLLECTION_BEING_EDITED_ID,
  name: COLLECTION_BEING_EDITED_NAME,
  description: COLLECTION_BEING_EDITED_DESCRIPTION,
  affiliation: COLLECTION_BEING_EDITED_AFFILIATION,
  type: CollectionType.JOURNALS,
  contacts: [{ email: COLLECTION_BEING_EDITED_CONTACT_EMAIL, displayOrder: 0 }],
  hierarchy: UpwardHierarchyNodeMother.createCollection({
    id: COLLECTION_BEING_EDITED_ID,
    name: COLLECTION_BEING_EDITED_NAME,
    parent: UpwardHierarchyNodeMother.createCollection({
      id: PARENT_COLLECTION_ID,
      name: PARENT_COLLECTION_NAME
    })
  }),
  isFacetRoot: false,
  isMetadataBlockRoot: false
})

const rootCollection = CollectionMother.create({
  id: PARENT_COLLECTION_ID,
  name: PARENT_COLLECTION_NAME,
  contacts: [{ email: PARENT_COLLECTION_CONTACT_EMAIL, displayOrder: 0 }],
  hierarchy: UpwardHierarchyNodeMother.createCollection({
    id: PARENT_COLLECTION_ID,
    name: PARENT_COLLECTION_NAME
  }),
  isFacetRoot: true,
  isMetadataBlockRoot: true
})

const VIEW_AND_EDIT_FIELDS_LABEL = '[+] View fields + set as hidden, required, or optional'
const VIEW_FIELDS_LABEL = '[+] View fields'

const colllectionMetadataBlocks = [MetadataBlockInfoMother.getCitationBlock()]

const allMetadataBlocksMock = [
  MetadataBlockInfoMother.getCitationBlock(),
  MetadataBlockInfoMother.getGeospatialBlock(),
  MetadataBlockInfoMother.getAstrophysicsBlock(),
  MetadataBlockInfoMother.getBiomedicalBlock(),
  MetadataBlockInfoMother.getJournalBlock(),
  MetadataBlockInfoMother.getSocialScienceBlock()
]

const collectionFacets = CollectionFacetMother.createFacets()

const allFacetableMetadataFields = MetadataBlockInfoMother.getAllFacetableMetadataFields()

// TODO:ME - e2e gets the collection by id deeply equal failinng

describe('EditCreateCollectionForm', () => {
  beforeEach(() => {
    collectionRepository.create = cy.stub().resolves(1)
    collectionRepository.edit = cy.stub().resolves({})
    collectionRepository.getFacets = cy.stub().resolves(collectionFacets)
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(colllectionMetadataBlocks)
    metadataBlockInfoRepository.getAll = cy.stub().resolves(allMetadataBlocksMock)
    metadataBlockInfoRepository.getAllFacetableMetadataFields = cy
      .stub()
      .resolves(allFacetableMetadataFields)
  })

  describe('on create mode', () => {
    it('should render the form', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      cy.findByTestId('collection-form').should('exist')
    })

    it('prefills the Host Collection field with the parent collection name', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Host Collection/i).should('have.value', PARENT_COLLECTION_NAME)
    })

    it('pre-fills specific form fields with user data', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Collection Name/i).should(
        'have.value',
        defaultCollectionNameInCreateMode
      )

      cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)

      cy.findByLabelText(/^Email/i).should('have.value', testUser.email)
    })

    it('submit button should be disabled when form has not been touched', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByRole('button', { name: 'Create Collection' }).should('be.disabled')
    })

    it('submit button should not be disabled when form has been touched', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Collection Name/i)
        .clear()
        .type('New Collection Name')

      cy.findByRole('button', { name: 'Create Collection' }).should('not.be.disabled')
    })

    it('shows error message when form is submitted with empty required fields', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Change collection name so submit button is no longer disabled
      cy.findByLabelText(/^Collection Name/i)
        .clear()
        .type('New Collection Name')

      cy.findByRole('button', { name: 'Create Collection' }).click()

      cy.findByText('Category is required').should('exist')
      cy.findByText('Identifier is required').should('exist')
    })

    it('shows error message when form is submitted with invalid email', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Email/i)
        .clear()
        .type('invalid-email')

      cy.findByRole('button', { name: 'Create Collection' }).click()

      cy.findByText('Email is not a valid email').should('exist')
    })

    it('shows error message when form is submitted with invalid identifier', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Identifier/i).type('invalid identifier')

      cy.findByRole('button', { name: 'Create Collection' }).click()

      cy.findByText(/Identifier is not valid./).should('exist')
    })

    it('submits a valid form and succeed', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      // Accept suggestion
      cy.findByRole('button', { name: 'Apply suggestion' }).click()
      // Select a Category option
      cy.findByLabelText(/^Category/i).select(1)

      cy.findByRole('button', { name: 'Create Collection' }).click()

      cy.findByText('Error').should('not.exist')
      cy.findByText('Success!').should('exist')
    })

    it('submits a valid form and fails', () => {
      collectionRepository.create = cy.stub().rejects(new Error('Error creating collection'))

      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Accept suggestion
      cy.findByRole('button', { name: 'Apply suggestion' }).click()
      // Select a Category option
      cy.findByLabelText(/^Category/i).select(1)

      cy.findByRole('button', { name: 'Create Collection' }).click()

      cy.findByText('Error').should('exist')
      cy.findByText(/Error creating collection/).should('exist')
      cy.findByText('Success!').should('not.exist')
    })

    it('cancel button is clickable', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByText('Cancel').click()
    })

    it('should display an alert error message for each error in loading the required data', () => {
      collectionRepository.getFacets = cy
        .stub()
        .rejects(new Error('Error getting collection facets'))
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
        <EditCreateCollectionForm
          mode="create"
          user={testUser}
          parentCollection={rootCollection}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByText(/Error getting collection facets/).should('exist')
      cy.findByText(/Error getting metadata blocks info/).should('exist')
      cy.findByText(/Error getting all metadata blocks info/).should('exist')
      cy.findByText(/Error getting all facetable metadata fields/).should('exist')
    })

    describe('IdentifierField suggestion functionality', () => {
      it('should show to apply an identifier suggestion', () => {
        cy.customMount(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        const aliasSuggestion = collectionNameToAlias(defaultCollectionNameInCreateMode)

        cy.findByText(/Psst... try this/).should('exist')
        cy.findByText(/Psst... try this/).should('include.text', aliasSuggestion)

        cy.findByRole('button', { name: 'Apply suggestion' }).should('exist')
      })

      it('should apply suggestion when clicking the button and hide suggestion', () => {
        cy.customMount(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        const aliasSuggestion = collectionNameToAlias(defaultCollectionNameInCreateMode)

        cy.findByRole('button', { name: 'Apply suggestion' }).click()

        cy.findByLabelText(/^Identifier/i).should('have.value', aliasSuggestion)

        cy.findByText(/Psst... try this/).should('not.exist')
      })
    })

    describe('ContactsField functionality', () => {
      it('should add a new contact field when clicking the add button', () => {
        cy.customMount(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        cy.findByLabelText('Add Email').click()

        cy.findAllByLabelText('Add Email').should('exist').should('have.length', 2)
        cy.findByLabelText('Remove Email').should('exist')
      })

      it('should add and then remove a contact field', () => {
        cy.customMount(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        cy.findByLabelText('Add Email').click()
        cy.findAllByLabelText('Add Email').should('exist').should('have.length', 2)

        cy.get('[id="contacts.1.value"]').type('test@test.com')

        cy.findByLabelText('Remove Email').should('exist')

        cy.findByLabelText('Remove Email').click()

        cy.findByLabelText('Add Email').should('exist')
        cy.findByLabelText('Remove Email').should('not.exist')

        cy.get('[id="contacts.1.value"]').should('not.exist')
      })
    })

    describe('MetadataFieldsSection functionality', () => {
      beforeEach(() => {
        cy.mountAuthenticated(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        cy.get('[data-testid="use-fields-from-parent-checkbox"]').as('useFieldsFromParentCheckbox')
      })

      describe('Use fields from parent checkbox', () => {
        it('should be checked by default', () => {
          cy.get('@useFieldsFromParentCheckbox').should('be.checked')
        })

        it('should open the reset confirmation modal when unchecking and then checking the checkbox again', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          cy.get('@useFieldsFromParentCheckbox').check({ force: true })

          cy.findByText(/Reset Modifications/).should('exist')
        })

        it('should close the reset confirmation modal if cancelling without finally checking the checkbox', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          cy.get('@useFieldsFromParentCheckbox').check({ force: true })

          cy.findByText(/Reset Modifications/).should('exist')

          cy.findByTestId('confirm-reset-modal-cancel').click()

          cy.findByText(/Reset Modifications/).should('not.exist')

          cy.get('@useFieldsFromParentCheckbox').should('not.be.checked')
        })

        it('should reset the metadata fields when confirming the reset', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck()

          // Modify a field in citation block
          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click()

          cy.findByLabelText('Subtitle').uncheck({ force: true })

          cy.findByLabelText('Subtitle').should('not.be.checked')

          cy.get('@useFieldsFromParentCheckbox').check({ force: true })

          cy.findByText(/Reset Modifications/).should('exist')

          cy.findByTestId('confirm-reset-modal-continue').click()

          cy.findByText(/Reset Modifications/).should('not.exist')

          cy.get('@useFieldsFromParentCheckbox').should('be.checked')

          // Check if field is back to its original state
          cy.findAllByRole('button', {
            name: VIEW_FIELDS_LABEL
          })
            .first()
            .click()

          cy.findByLabelText('Subtitle').should('be.checked')
        })

        it('should send metadataBlockNames and inputLevels as undefined if use fields from parent is checked', () => {
          const collectionRepository = {} as CollectionRepository
          collectionRepository.create = cy.stub().as('createCollection').resolves()
          collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

          cy.mountAuthenticated(
            <EditCreateCollectionForm
              mode="create"
              user={testUser}
              parentCollection={rootCollection}
              collectionRepository={collectionRepository}
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
          )

          // Accept suggestion
          cy.findByRole('button', { name: 'Apply suggestion' }).click()
          // Select a Category option
          cy.findByLabelText(/^Category/i).select(1)

          cy.findByRole('button', { name: 'Create Collection' }).click()

          cy.get('@createCollection').should((spy) => {
            const createCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
            const collectionDTO = createCollectionSpy.getCall(0).args[0] as CollectionDTO

            const inputLevels = collectionDTO.inputLevels
            const metadataBlockNames = collectionDTO.metadataBlockNames

            expect(inputLevels).to.be.undefined
            expect(metadataBlockNames).to.be.undefined
          })
        })

        it('should not send metadataBlockNames and inputLevels as undefined if use fields from parent is unchecked', () => {
          const collectionRepository = {} as CollectionRepository
          collectionRepository.create = cy.stub().as('createCollection').resolves()
          collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

          cy.mountAuthenticated(
            <EditCreateCollectionForm
              mode="create"
              user={testUser}
              parentCollection={rootCollection}
              collectionRepository={collectionRepository}
              metadataBlockInfoRepository={metadataBlockInfoRepository}
            />
          )

          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          // Accept suggestion
          cy.findByRole('button', { name: 'Apply suggestion' }).click()
          // Select a Category option
          cy.findByLabelText(/^Category/i).select(1)

          cy.findByRole('button', { name: 'Create Collection' }).click()

          cy.get('@createCollection').should((spy) => {
            const createCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
            const collectionDTO = createCollectionSpy.getCall(0).args[0] as CollectionDTO

            console.log({ collectionDTO })

            const inputLevels = collectionDTO.inputLevels
            const metadataBlockNames = collectionDTO.metadataBlockNames

            expect(inputLevels).to.not.be.undefined
            expect(metadataBlockNames).to.not.be.undefined
          })
        })
      })

      describe('InputLevelFieldRow', () => {
        it('On not composed fields - should unclude and include the field when checking the checkbox', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          // Open citation input levels
          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click({ force: true })

          // First unclude the subtitle field
          cy.findByLabelText('Subtitle').uncheck({ force: true })

          cy.findByLabelText('Subtitle').should('not.be.checked')

          // Go to parent td of Subtitle field and find sibling td to check if Hidden checkbox is there
          cy.findByLabelText('Subtitle')
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('exist').should('be.checked')
            })

          // Second include the subtitle field
          cy.findByLabelText('Subtitle').check({ force: true })
          cy.findByLabelText('Subtitle').should('be.checked')

          // Go to parent td of Subtitle field and find sibling td to check if Hidden checkbox is not there anymore
          cy.findByLabelText('Subtitle')
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('not.exist')
            })
        })

        it('On composed fields - should unclude and include the child field when checking the checkbox', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          // Open citation input levels
          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click()

          // First unclude the other identifier composed field
          cy.findByLabelText('Other Identifier').uncheck({ force: true })

          cy.findByLabelText('Other Identifier').should('not.be.checked')

          // Go to child fields rows and check if Hidden checkbox is there
          cy.findByText('Other Identifier Agency', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('exist').should('be.checked')
            })

          cy.findByText('Other Identifier Identifier', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('exist').should('be.checked')
            })

          // Second include the other identifier composed fields
          cy.findByLabelText('Other Identifier').check({ force: true })
          cy.findByLabelText('Other Identifier').should('be.checked')

          // Go to child fields rows and check if Hidden checkbox is not there anymore and they optional checkbox is checked
          cy.findByText('Other Identifier Agency', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('not.exist')
              cy.findByLabelText('Optional').should('be.checked')
            })

          cy.findByText('Other Identifier Identifier', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Hidden').should('not.exist')
              cy.findByLabelText('Optional').should('be.checked')
            })
        })

        it('On not composed fields - should select correctly the Required or Optional radios', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          // Open citation input levels
          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click()

          // Go to parent td of Subtitle field and find sibling td to select the Required radio
          cy.findByLabelText('Subtitle')
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Required').should('exist').should('not.be.checked')
              cy.findByLabelText('Optional').should('exist').should('be.checked')

              cy.findByLabelText('Required').check({ force: true })
              cy.findByLabelText('Required').should('be.checked')
              cy.findByLabelText('Optional').should('not.be.checked')

              cy.findByLabelText('Optional').check({ force: true })
              cy.findByLabelText('Optional').should('be.checked')
              cy.findByLabelText('Required').should('not.be.checked')
            })

          // Second set the subtitle field as optional
          // cy.findByLabelText('Subtitle').uncheck({ force: true })

          // // Go to parent td of Subtitle field and find sibling td to check if Optional radio is there
          // cy.findByLabelText('Subtitle')
          //   .closest('td')
          //   .next()
          //   .next()
          //   .within(() => {
          //     cy.findByLabelText('Optional').should('exist').should('be.checked')
          //   })
        })

        it('On composed fields - should select correctly the Required or Optional radios of child fields', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          // Open citation input levels
          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click()

          // Go to child fields row and check if Required radio is there and perform the check/uncheck
          cy.findByText('Other Identifier Identifier', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Required').should('exist').should('not.be.checked')
              cy.findByLabelText('Optional').should('exist').should('be.checked')

              cy.findByLabelText('Required').check({ force: true })
              cy.findByLabelText('Required').should('be.checked')
              cy.findByLabelText('Optional').should('not.be.checked')
            })

          cy.findByText('Other Identifier Agency', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Required').should('exist').should('not.be.checked')
              cy.findByLabelText('Optional').should('exist').should('be.checked')

              cy.findByLabelText('Required').check({ force: true })
              cy.findByLabelText('Required').should('be.checked')
              cy.findByLabelText('Optional').should('not.be.checked')

              cy.findByLabelText('Optional').check({ force: true })
              cy.findByLabelText('Optional').should('be.checked')
              cy.findByLabelText('Required').should('not.be.checked')
            })

          cy.findByText('Other Identifier Identifier', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Optional').check({ force: true })
            })

          cy.findByText('Other Identifier Agency', { exact: true })
            .closest('td')
            .next()
            .within(() => {
              cy.findByLabelText('Required').should('exist').should('not.be.checked')
              cy.findByLabelText('Optional').should('exist').should('be.checked')

              cy.findByLabelText('Required').check({ force: true })
              cy.findByLabelText('Required').should('be.checked')
              cy.findByLabelText('Optional').should('not.be.checked')

              cy.findByLabelText('Optional').check({ force: true })
              cy.findByLabelText('Optional').should('be.checked')
              cy.findByLabelText('Required').should('not.be.checked')
            })
        })
      })

      describe('Opens input levels table correctly on different states', () => {
        it('should open the Citation input levels on view mode', () => {
          cy.findAllByRole('button', {
            name: VIEW_FIELDS_LABEL
          })
            .first()
            .should('exist')
            .click()

          cy.findByRole('table').should('exist').should('be.visible')

          cy.findByRole('table').within(() => {
            cy.findByText('Title').should('be.visible')
            cy.findByLabelText('Subtitle').should('be.visible').should('be.disabled')
          })

          // Close the table
          cy.findAllByLabelText('Hide input levels table').first().click()

          cy.findByRole('table').should('not.exist')
        })

        it('should open the Citation input levels on edit mode', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          cy.findByRole('button', {
            name: VIEW_AND_EDIT_FIELDS_LABEL
          })
            .should('exist')
            .click()

          cy.findByRole('table').should('exist').should('be.visible')

          cy.findByRole('table').within(() => {
            cy.findByText('Title').should('be.visible')
            cy.findByLabelText('Subtitle').should('be.visible').should('not.be.disabled')
          })

          // Close the table
          cy.findAllByLabelText('Hide input levels table').first().click()

          cy.findByRole('table').should('not.exist')
        })

        it('should enable fields when opening an input levels table on view mode and checking the block name checkbox', () => {
          cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

          cy.findAllByRole('button', {
            name: VIEW_FIELDS_LABEL
          })
            .first()
            .should('exist')
            .click()

          cy.findByRole('table').should('exist').should('be.visible')

          cy.findByRole('table').within(() => {
            cy.findByLabelText('Geographic Unit').should('exist').should('be.disabled')
          })

          // Now check the Geospatial block name checkbox
          cy.findByLabelText('Geospatial Metadata').check({ force: true })

          cy.findByRole('table').should('exist').should('be.visible')

          cy.findByRole('table').within(() => {
            cy.findByLabelText('Geographic Unit').should('exist').should('not.be.disabled')
          })
        })
      })

      it('when unchecking a block name checkbox, should reset the input levels as they were by default', () => {
        cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

        // Check geospatial block name checkbox
        cy.findByLabelText('Geospatial Metadata').check({ force: true })

        // Open geospatial input levels
        cy.findAllByRole('button', {
          name: VIEW_AND_EDIT_FIELDS_LABEL
        })
          .last()
          .should('exist')
          .click()

        // Set coverage city as required
        cy.findByLabelText('Geographic Coverage').uncheck({ force: true })

        cy.findByLabelText('Geographic Coverage').should('not.be.checked')

        // Uncheck geospatial block name checkbox
        cy.findByLabelText('Geospatial Metadata').uncheck({ force: true })

        cy.findByLabelText('Geographic Coverage').should('be.checked')
      })
    })

    describe('BrowseSearchFacetsSection functionality', () => {
      beforeEach(() => {
        cy.mountAuthenticated(
          <EditCreateCollectionForm
            mode="create"
            user={testUser}
            parentCollection={rootCollection}
            collectionRepository={collectionRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
          />
        )

        cy.get('[data-testid="use-facets-from-parent-checkbox"]').as('useFacetsFromParentCheckbox')
        cy.get('[data-testid="transfer-list-container"]').as('transferListContainer')
        cy.findByTestId('left-list-group').as('leftList')
        cy.findByTestId('actions-column').as('actionsColumn')
        cy.findByTestId('right-list-group').as('rightList')
      })

      it('should populate the right list with the default facets', () => {
        cy.get('@rightList').children().should('have.length', 4)

        cy.get('@rightList').within(() => {
          cy.findByLabelText('Author Name').should('exist')
          cy.findByLabelText('Subject').should('exist')
          cy.findByLabelText('Keyword Term').should('exist')
          cy.findByLabelText('Deposit Date').should('exist')
        })
      })

      it('should reset the newly selected facets when checking the checkbox', () => {
        cy.get('@useFacetsFromParentCheckbox').should('be.checked')
        cy.get('@useFacetsFromParentCheckbox').uncheck({ force: true })
        cy.get('@useFacetsFromParentCheckbox').should('not.be.checked')

        cy.get('@rightList').should('exist')
        cy.get('@rightList').children().should('have.length', 4)
        cy.get('@rightList').within(() => {
          cy.findByLabelText('Author Name').should('exist')
          cy.findByLabelText('Subject').should('exist')
          cy.findByLabelText('Keyword Term').should('exist')
          cy.findByLabelText('Deposit Date').should('exist')
        })

        cy.get('@transferListContainer').within(() => {
          cy.findByLabelText('Topic Classification Term').check({ force: true })

          cy.findByLabelText('Topic Classification Term').should('be.checked')
        })

        cy.get('@actionsColumn').within(() => {
          cy.findByLabelText('move selected to right').click()
        })

        cy.get('@leftList').within(() => {
          cy.findByLabelText('Topic Classification Term').should('not.exist')
        })

        cy.get('@rightList').children().should('have.length', 5)

        cy.get('@rightList').within(() => {
          cy.findByLabelText('Author Name').should('exist')
          cy.findByLabelText('Subject').should('exist')
          cy.findByLabelText('Keyword Term').should('exist')
          cy.findByLabelText('Deposit Date').should('exist')
          cy.findByLabelText('Topic Classification Term').should('exist')
        })

        cy.get('@useFacetsFromParentCheckbox').check({ force: true })

        cy.get('@rightList').children().should('have.length', 4)

        cy.get('@rightList').within(() => {
          cy.findByLabelText('Author Name').should('exist')
          cy.findByLabelText('Subject').should('exist')
          cy.findByLabelText('Keyword Term').should('exist')
          cy.findByLabelText('Deposit Date').should('exist')
          cy.findByLabelText('Topic Classification Term').should('not.exist')
        })

        cy.get('@leftList').within(() => {
          cy.findByLabelText('Topic Classification Term').should('exist')
        })
      })

      it('should populate the select to filter facets by blocks correctly', () => {
        cy.get('@useFacetsFromParentCheckbox').uncheck({ force: true })

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByLabelText('Toggle options menu').click()

          cy.findAllByText('All Metadata Fields').should('have.length', 2)

          cy.findByText('Citation Metadata').should('have.length', 1)
          cy.findByText('Geospatial Metadata').should('have.length', 1)
          cy.findByText('Astronomy and Astrophysics Metadata').should('have.length', 1)
          cy.findByText('Life Sciences Metadata').should('have.length', 1)
          cy.findByText('Journal Metadata').should('have.length', 1)
          cy.findByText('Social Science and Humanities Metadata').should('have.length', 1)
        })
      })

      it('should filter the facets by blocks correctly', () => {
        cy.get('@useFacetsFromParentCheckbox').uncheck({ force: true })

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByLabelText('Toggle options menu').click()

          cy.findByText('Journal Metadata').click()
        })

        cy.get('@leftList').children().should('have.length', 4)

        cy.get('@leftList').within(() => {
          cy.findByLabelText('Journal Volume').should('exist')
          cy.findByLabelText('Journal Issue').should('exist')
          cy.findByLabelText('Journal Publication Date').should('exist')
          cy.findByLabelText('Type of Article').should('exist')
        })

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByLabelText('Toggle options menu').click()

          cy.findByText('Social Science and Humanities Metadata').click()
        })

        cy.get('@leftList').children().should('have.length', 5)

        cy.get('@leftList').within(() => {
          cy.findByLabelText('Unit of Analysis').should('exist')
          cy.findByLabelText('Universe').should('exist')
          cy.findByLabelText('Time Method').should('exist')
          cy.findByLabelText('Frequency').should('exist')
          cy.findByLabelText('Response Rate').should('exist')
        })

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByLabelText('Toggle options menu').click()

          cy.findByText('All Metadata Fields').click()
        })

        cy.get('@leftList')
          .children()
          .should('have.length', allFacetableMetadataFields.length - collectionFacets.length)
      })

      it('should reset the select to filter by facets when checking the checkbox', () => {
        cy.get('@useFacetsFromParentCheckbox').uncheck({ force: true })

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByLabelText('Toggle options menu').click()

          cy.findByText('Journal Metadata').click()
        })

        cy.get('@leftList').children().should('have.length', 4)

        cy.get('@leftList').within(() => {
          cy.findByLabelText('Journal Volume').should('exist')
          cy.findByLabelText('Journal Issue').should('exist')
          cy.findByLabelText('Journal Publication Date').should('exist')
          cy.findByLabelText('Type of Article').should('exist')
        })

        cy.get('@useFacetsFromParentCheckbox').check({ force: true })

        cy.get('@leftList')
          .children()
          .should('have.length', allFacetableMetadataFields.length - collectionFacets.length)

        cy.findByTestId('select-facets-by-block').within(() => {
          cy.findByText('All Metadata Fields').should('exist')
        })
      })

      it('should show error message when there is no selected facet in the right list', () => {
        cy.get('@useFacetsFromParentCheckbox').uncheck({ force: true })
        // Move all facets to the left list
        cy.get('@actionsColumn').within(() => {
          cy.findByLabelText('move all left').click()
        })

        cy.findByText('At least one facet must be selected.').should('exist')

        // Now move one facet to the right list and the error message should disappear
        cy.get('@leftList').within(() => {
          cy.findByLabelText('Journal Volume').click()
        })

        cy.get('@actionsColumn').within(() => {
          cy.findByLabelText('move selected to right').click()
        })

        cy.findByText('At least one facet must be selected.').should('not.exist')
      })
    })
  })

  describe('on edit mode', () => {
    it('should render the form', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={collectionBeingEdited}
          parentCollection={{ id: PARENT_COLLECTION_ID, name: PARENT_COLLECTION_NAME }}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      cy.findByTestId('collection-form').should('exist')
    })

    it('submits a valid form and succeed', () => {
      cy.customMount(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={collectionBeingEdited}
          parentCollection={{ id: PARENT_COLLECTION_ID, name: PARENT_COLLECTION_NAME }}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      // Change affiliation in order to be able to save
      cy.findByLabelText(/^Affiliation/i)
        .clear()
        .type('New Affiliation')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('Error').should('not.exist')
      cy.findByText('Success!').should('exist')
    })

    it('submits a valid form and fails', () => {
      collectionRepository.edit = cy.stub().rejects(new Error('Error editing collection'))

      cy.customMount(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={collectionBeingEdited}
          parentCollection={{ id: PARENT_COLLECTION_ID, name: PARENT_COLLECTION_NAME }}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Change affiliation in order to be able to save
      cy.findByLabelText(/^Affiliation/i)
        .clear()
        .type('New Affiliation')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('Error').should('exist')
      cy.findByText(/Error editing collection/).should('exist')
      cy.findByText('Success!').should('not.exist')
    })

    it('should not show the Host Collection field when editing the root collection', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Host Collection/i).should('not.exist')
    })

    it('should not show Use metadata fields from [Parent] and Use browse/search facets from [Parent] when editing the root collection', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByTestId('use-fields-from-parent-checkbox').should('not.exist')
      cy.findByTestId('use-facets-from-parent-checkbox').should('not.exist')
    })

    it('should prefill the top fields with the collection data', () => {
      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={collectionBeingEdited}
          parentCollection={{ id: PARENT_COLLECTION_ID, name: PARENT_COLLECTION_NAME }}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByLabelText(/^Collection Name/i).should('have.value', collectionBeingEdited.name)
      cy.findByLabelText(/^Affiliation/i).should('have.value', collectionBeingEdited.affiliation)
      cy.findByLabelText(/^Identifier/i).should('have.value', collectionBeingEdited.id)
      cy.findByLabelText(/^Category/i).should('have.value', collectionBeingEdited.type)
      cy.findAllByLabelText(/^Description/i)
        .first()
        .should('have.value', collectionBeingEdited.description)

      cy.findByLabelText(/^Email/i).should('have.value', collectionBeingEdited.contacts[0].email)
    })

    it('when editing the root collection, should not send metadataBlockNames and inputLevels as undefined if any of them have changed', () => {
      const collectionRepository = {} as CollectionRepository
      collectionRepository.edit = cy.stub().as('editCollection').resolves()
      collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Check a new metadata block
      cy.findByLabelText('Geospatial Metadata').check({ force: true })

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.get('@editCollection').should((spy) => {
        const editCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionDTO = editCollectionSpy.getCall(0).args[1] as CollectionDTO

        const inputLevels = collectionDTO.inputLevels
        const metadataBlockNames = collectionDTO.metadataBlockNames

        expect(inputLevels).not.to.be.undefined
        expect(metadataBlockNames).not.to.be.undefined
      })
    })

    it('when editing the root collection, should send metadataBlockNames and inputLevels as undefined if they didnt changed', () => {
      const collectionRepository = {} as CollectionRepository
      collectionRepository.edit = cy.stub().as('editCollection').resolves()
      collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Change affiliation in order to be able to save
      cy.findByLabelText(/^Affiliation/i)
        .clear()
        .type('New Affiliation')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.get('@editCollection').should((spy) => {
        const editCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionDTO = editCollectionSpy.getCall(0).args[1] as CollectionDTO

        const inputLevels = collectionDTO.inputLevels
        const metadataBlockNames = collectionDTO.metadataBlockNames

        expect(inputLevels).to.be.undefined
        expect(metadataBlockNames).to.be.undefined
      })
    })

    it('when editing root collection, should not send facetIds as undefined if they have changed', () => {
      const collectionRepository = {} as CollectionRepository
      collectionRepository.edit = cy.stub().as('editCollection').resolves()
      collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByTestId('left-list-group').as('leftList')
      cy.findByTestId('actions-column').as('actionsColumn')
      cy.findByTestId('right-list-group').as('rightList')

      // Change the default selected facets
      cy.get('@leftList').within(() => {
        cy.findByText('Topic Classification Term').click()
      })

      cy.get('@actionsColumn').within(() => {
        cy.findByLabelText('move selected to right').click()
      })

      cy.get('@rightList').within(() => {
        cy.findByLabelText('Topic Classification Term').should('exist')
      })

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.get('@editCollection').should((spy) => {
        const editCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionDTO = editCollectionSpy.getCall(0).args[1] as CollectionDTO

        const facetIds = collectionDTO.facetIds

        expect(facetIds).to.not.be.undefined
      })
    })

    it('when editing root collection, should send facetIds as undefined if they didnt changed', () => {
      const collectionRepository = {} as CollectionRepository
      collectionRepository.edit = cy.stub().as('editCollection').resolves()
      collectionRepository.getFacets = cy.stub().resolves(CollectionFacetMother.createFacets())

      cy.mountAuthenticated(
        <EditCreateCollectionForm
          mode="edit"
          user={testUser}
          collection={rootCollection}
          parentCollection={undefined}
          collectionRepository={collectionRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Change affiliation in order to be able to save
      cy.findByLabelText(/^Affiliation/i)
        .clear()
        .type('New Affiliation')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.get('@editCollection').should((spy) => {
        const editCollectionSpy = spy as unknown as Cypress.Agent<sinon.SinonSpy>
        const collectionDTO = editCollectionSpy.getCall(0).args[1] as CollectionDTO

        const facetIds = collectionDTO.facetIds

        expect(facetIds).to.be.undefined
      })
    })
  })
})

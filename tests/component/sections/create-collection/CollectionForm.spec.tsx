// import {
//   CollectionForm,
//   CollectionFormData,
//   CollectionFormFacet,
//   FormattedCollectionInputLevels,
//   FormattedCollectionInputLevelsWithoutParentBlockName,
//   INPUT_LEVELS_GROUPER,
//   METADATA_BLOCKS_NAMES_GROUPER,
//   USE_FACETS_FROM_PARENT,
//   USE_FIELDS_FROM_PARENT
// } from '../../../../src/sections/create-collection/collection-form/CollectionForm'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { UserMother } from '../../users/domain/models/UserMother'
// import { collectionNameToAlias } from '../../../../src/sections/create-collection/collection-form/top-fields-section/IdentifierField'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
// import { CollectionFormHelper } from '../../../../src/sections/create-collection/collection-form/CollectionFormHelper'
import { MetadataBlockName } from '../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionFacetMother } from '../../collection/domain/models/CollectionFacetMother'
import { CollectionFormHelper } from '@/sections/shared/form/EditCreateCollectionForm/CollectionFormHelper'
import {
  CollectionFormData,
  CollectionFormFacet,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName
} from '@/sections/shared/form/EditCreateCollectionForm/types'
import {
  INPUT_LEVELS_GROUPER,
  METADATA_BLOCKS_NAMES_GROUPER,
  USE_FACETS_FROM_PARENT,
  USE_FIELDS_FROM_PARENT
} from '@/sections/shared/form/EditCreateCollectionForm/EditCreateCollectionForm'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const PARENT_COLLECTION_ID = 'root'

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME })

const VIEW_AND_EDIT_FIELDS_LABEL = '[+] View fields + set as hidden, required, or optional'
const VIEW_FIELDS_LABEL = '[+] View fields'

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

const defaultCollectionName = `${testUser.displayName} Collection`

const baseInputLevels: FormattedCollectionInputLevels =
  CollectionFormHelper.defineBaseInputLevels(allMetadataBlocksMock)

const formattedCollectionInputLevels: FormattedCollectionInputLevelsWithoutParentBlockName =
  CollectionFormHelper.formatCollectiontInputLevels(collection?.inputLevels)

const mergedInputLevels = CollectionFormHelper.mergeBaseAndDefaultInputLevels(
  baseInputLevels,
  formattedCollectionInputLevels
)

const defaultBlocksNames = {
  [MetadataBlockName.CITATION]: true,
  [MetadataBlockName.GEOSPATIAL]: false,
  [MetadataBlockName.SOCIAL_SCIENCE]: false,
  [MetadataBlockName.ASTROPHYSICS]: false,
  [MetadataBlockName.BIOMEDICAL]: false,
  [MetadataBlockName.JOURNAL]: false,
  [MetadataBlockName.COMPUTATIONAL_WORKFLOW]: false,
  [MetadataBlockName.CODE_META]: false
}

const defaultCollectionFacetsMock: CollectionFormFacet[] = CollectionFacetMother.createFacets().map(
  (facet) => ({
    id: facet.name,
    value: facet.name,
    label: facet.displayName
  })
)

const allFacetableMetadataFields = MetadataBlockInfoMother.getAllFacetableMetadataFields()

const formDefaultValues: CollectionFormData = {
  hostCollection: collection.name,
  name: defaultCollectionName,
  alias: '',
  type: '',
  contacts: [{ value: testUser.email }],
  affiliation: testUser.affiliation ?? '',
  storage: 'S3',
  description: '',
  [USE_FIELDS_FROM_PARENT]: true,
  [METADATA_BLOCKS_NAMES_GROUPER]: defaultBlocksNames,
  [INPUT_LEVELS_GROUPER]: mergedInputLevels,
  [USE_FACETS_FROM_PARENT]: true,
  facetIds: defaultCollectionFacetsMock
}

// TODO:ME Test the EditCreateCollectionForm instead

describe('CollectionForm', () => {
  beforeEach(() => {
    collectionRepository.create = cy.stub().resolves(1)
    collectionRepository.getById = cy.stub().resolves(collection)
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
  })

  it('should render the form', () => {
    cy.mountAuthenticated(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByTestId('collection-form').should('exist')
  })
  it('prefills the Host Collection field with current owner collection', () => {
    cy.mountAuthenticated(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByLabelText(/^Host Collection/i).should('have.value', COLLECTION_NAME)
  })

  it('pre-fills specific form fields with user data', () => {
    cy.mountAuthenticated(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByLabelText(/^Collection Name/i).should('have.value', defaultCollectionName)

    cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)

    cy.findByLabelText(/^Email/i).should('have.value', testUser.email)
  })

  it('submit button should be disabled when form has not been touched', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByRole('button', { name: 'Create Collection' }).should('be.disabled')
  })

  it('submit button should not be disabled when form has been touched', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByLabelText(/^Collection Name/i)
      .clear()
      .type('New Collection Name')

    cy.findByRole('button', { name: 'Create Collection' }).should('not.be.disabled')
  })

  it('shows error message when form is submitted with empty required fields', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
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
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
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
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByLabelText(/^Identifier/i).type('invalid identifier')

    cy.findByRole('button', { name: 'Create Collection' }).click()

    cy.findByText(/Identifier is not valid./).should('exist')
  })

  it('should not submit the form when pressing enter key if submit button is not focused', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    // Select a Category option so submit button is not disabled
    cy.findByLabelText(/^Category/i).select(1)

    // Focus on the Identifier field that is empty and is required and press enter key
    cy.findByLabelText(/^Identifier/i)
      .focus()
      .type('{enter}')

    // Validation error shouldn't be shown as form wasn't submitted by pressing enter key on Identifier field
    cy.findByText('Identifier is required').should('not.exist')
  })
  it('should submit the form when pressing enter key if submit button is indeed focused', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    // Select a Category option so submit button is not disabled
    cy.findByLabelText(/^Category/i).select(1)

    // To wait until button becomes enabled
    cy.wait(100)

    cy.findByRole('button', { name: 'Create Collection' }).focus().type('{enter}')

    // Validation error should be shown as form was submitted by pressing enter key on Identifier field
    cy.findByText('Identifier is required').should('exist')
  })

  it('submits a valid form and succeed', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
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
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
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
      <CollectionForm
        collectionRepository={collectionRepository}
        parentCollectionId={PARENT_COLLECTION_ID}
        defaultValues={formDefaultValues}
        allMetadataBlocksInfo={allMetadataBlocksMock}
        defaultCollectionFacets={defaultCollectionFacetsMock}
        allFacetableMetadataFields={allFacetableMetadataFields}
      />
    )

    cy.findByText('Cancel').click()
  })

  describe('IdentifierField suggestion functionality', () => {
    it('should show to apply an identifier suggestion', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={formDefaultValues}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )

      const aliasSuggestion = collectionNameToAlias(defaultCollectionName)

      cy.findByText(/Psst... try this/).should('exist')
      cy.findByText(/Psst... try this/).should('include.text', aliasSuggestion)

      cy.findByRole('button', { name: 'Apply suggestion' }).should('exist')
    })

    it('should apply suggestion when clicking the button and hide suggestion', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={formDefaultValues}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )

      const aliasSuggestion = collectionNameToAlias(defaultCollectionName)

      cy.findByRole('button', { name: 'Apply suggestion' }).click()

      cy.findByLabelText(/^Identifier/i).should('have.value', aliasSuggestion)

      cy.findByText(/Psst... try this/).should('not.exist')
    })

    it('should not show suggestion when identifier is already the suggestion', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={{
            ...formDefaultValues,
            alias: collectionNameToAlias(defaultCollectionName)
          }}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )

      cy.findByText(/Psst... try this/).should('not.exist')
    })

    it('should not show suggestion if Collection Name is empty', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={{ ...formDefaultValues, name: '' }}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )

      cy.findByText(/Psst... try this/).should('not.exist')
    })
  })

  describe('ContactsField functionality', () => {
    it('should add a new contact field when clicking the add button', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={formDefaultValues}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )

      cy.findByLabelText('Add Email').click()

      cy.findAllByLabelText('Add Email').should('exist').should('have.length', 2)
      cy.findByLabelText('Remove Email').should('exist')
    })

    it('should remove a contact field when clicking the remove button', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={{
            ...formDefaultValues,
            contacts: [{ value: testUser.email }, { value: 'fake@fake.com' }]
          }}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
        />
      )
      cy.findAllByLabelText('Add Email').should('exist').should('have.length', 2)
      cy.findByLabelText('Remove Email').should('exist')

      cy.findByLabelText('Remove Email').click()

      cy.findByLabelText('Add Email').should('exist')
      cy.findByLabelText('Remove Email').should('not.exist')
    })
  })

  describe('MetadataFieldsSection functionality', () => {
    beforeEach(() => {
      cy.mountAuthenticated(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={formDefaultValues}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
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
        // cy.get('@useFieldsFromParentCheckbox').uncheck({ force: true })

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
  })

  describe('BrowseSearchFacetsSection functionality', () => {
    beforeEach(() => {
      cy.mountAuthenticated(
        <CollectionForm
          collectionRepository={collectionRepository}
          parentCollectionId={PARENT_COLLECTION_ID}
          defaultValues={formDefaultValues}
          allMetadataBlocksInfo={allMetadataBlocksMock}
          defaultCollectionFacets={defaultCollectionFacetsMock}
          allFacetableMetadataFields={allFacetableMetadataFields}
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
        .should(
          'have.length',
          allFacetableMetadataFields.length - defaultCollectionFacetsMock.length
        )
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
        .should(
          'have.length',
          allFacetableMetadataFields.length - defaultCollectionFacetsMock.length
        )

      cy.findByTestId('select-facets-by-block').within(() => {
        cy.findByText('All Metadata Fields').should('exist')
      })
    })
  })
})

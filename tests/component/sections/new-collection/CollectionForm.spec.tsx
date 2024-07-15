import {
  CollectionForm,
  CollectionFormData
} from '../../../../src/sections/new-collection/collection-form'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { UserMother } from '../../users/domain/models/UserMother'
import { collectionNameToAlias } from '../../../../src/sections/new-collection/collection-form/top-fields-section/IdentifierField'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME })

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository

const defaultCollectionName = `${testUser.displayName} Collection`

const formDefaultValues: CollectionFormData = {
  hostCollection: collection.name,
  name: defaultCollectionName,
  alias: '',
  type: '',
  contacts: [{ value: testUser.email }],
  affiliation: testUser.affiliation ?? '',
  storage: 'Local (Default)',
  description: ''
}

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
        defaultValues={formDefaultValues}
      />
    )

    cy.findByTestId('collection-form').should('exist')
  })
  it('prefills the Host Collection field with current owner collection', () => {
    cy.mountAuthenticated(
      <CollectionForm
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
      />
    )

    cy.findByLabelText(/^Host Collection/i).should('have.value', COLLECTION_NAME)
  })

  it('pre-fills specific form fields with user data', () => {
    cy.mountAuthenticated(
      <CollectionForm
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
      />
    )

    cy.findByRole('button', { name: 'Create Collection' }).should('be.disabled')
  })

  it('submit button should not be disabled when form has been touched', () => {
    cy.customMount(
      <CollectionForm
        collectionRepository={collectionRepository}
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
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
        defaultValues={formDefaultValues}
      />
    )

    cy.findByText(/Cancel/i).click()
  })

  describe('IdentifierField suggestion functionality', () => {
    it('should show to apply an identifier suggestion', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          defaultValues={formDefaultValues}
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
          defaultValues={formDefaultValues}
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
          defaultValues={{
            ...formDefaultValues,
            alias: collectionNameToAlias(defaultCollectionName)
          }}
        />
      )

      cy.findByText(/Psst... try this/).should('not.exist')
    })

    it('should not show suggestion if Collection Name is empty', () => {
      cy.customMount(
        <CollectionForm
          collectionRepository={collectionRepository}
          defaultValues={{ ...formDefaultValues, name: '' }}
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
          defaultValues={formDefaultValues}
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
          defaultValues={{
            ...formDefaultValues,
            contacts: [{ value: testUser.email }, { value: 'fake@fake.com' }]
          }}
        />
      )
      cy.findAllByLabelText('Add Email').should('exist').should('have.length', 2)
      cy.findByLabelText('Remove Email').should('exist')

      cy.findByLabelText('Remove Email').click()

      cy.findByLabelText('Add Email').should('exist')
      cy.findByLabelText('Remove Email').should('not.exist')
    })
  })
})

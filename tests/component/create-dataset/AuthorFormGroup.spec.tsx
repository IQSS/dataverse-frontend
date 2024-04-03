// AuthorFormGroup.spec.js
import { AuthorFormGroup } from '../../../src/sections/create-dataset/AuthorFormGroup'
import { SubmissionStatus } from '../../../src/sections/create-dataset/useCreateDatasetForm'
describe('AuthorFormGroup', () => {
  const initialAuthorFields = [{ authorName: '' }]

  it('renders and allows adding and removing author fields', () => {
    // Mock updateFormData function
    const updateFormDataMock = cy.stub()

    // Mount the component with necessary props
    cy.customMount(
      <AuthorFormGroup
        submissionStatus={SubmissionStatus.NotSubmitted}
        initialAuthorFields={initialAuthorFields}
        updateFormData={updateFormDataMock}
      />
    )
    cy.contains('Author Name').should('exist')
    const firstAuthorInput = 'input[name="metadataBlocks.0.fields.author.0.authorName"]'
    // Check if the initial author field is rendered
    cy.get(firstAuthorInput).should('exist')

    // Simulate typing in the first author field
    cy.get(firstAuthorInput).type('John Doe')

    // Simulate clicking the add button to add a new author field
    //  cy.get('[data-testid="add-author-button"]').click()

    // Assert that a new author field is added
    //  cy.get('[data-testid="author-field-1"]').should('exist')

    // Simulate clicking the remove button on the first author field
    //  cy.get('[data-testid="remove-author-button-0"]').click()

    // Assert that the first author field is removed
    // cy.get('[data-testid="author-field-0"]').should('not.exist')
  })

  // More tests here...
})

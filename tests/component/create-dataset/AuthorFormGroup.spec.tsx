import { AuthorFormGroup } from '../../../src/sections/create-dataset/AuthorFormGroup'
import { SubmissionStatus } from '../../../src/sections/create-dataset/useCreateDatasetForm'
describe('AuthorFormGroup', () => {
  const initialAuthorFields = [{ authorName: '' }]

  it('renders and allows adding and removing author fields', () => {
    const updateFormDataMock = cy.stub()

    cy.customMount(
      <AuthorFormGroup
        submissionStatus={SubmissionStatus.NotSubmitted}
        initialAuthorFields={initialAuthorFields}
        updateFormData={updateFormDataMock}
      />
    )
    cy.findByLabelText(/Name/i).should('exist')
    // Simulate typing in the first author field
    cy.findByLabelText(/Name/i).type('Test author name')

    // Simulate clicking the add button to add a new author field
    cy.contains('button', 'Add').should('exist')
    cy.contains('button', 'Add').click()

    // Assert that a new author field is added
    const secondAuthorInput = 'input[name="metadataBlocks.0.fields.author.1.authorName"]'
    // Check if the initial author field is rendered
    cy.get(secondAuthorInput).should('exist')

    // Simulate clicking the remove button on the first author field
    cy.contains('button', 'Delete').should('exist')
    cy.contains('button', 'Delete').click()

    // Assert that the new author field is removed
    cy.get(secondAuthorInput).should('not.exist')
  })
})

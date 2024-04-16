import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { CreateDatasetForm } from '../../../../src/sections/create-dataset/CreateDatasetForm'

const datasetRepository: DatasetRepository = {} as DatasetRepository
describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
  })

  it('renders the Create Dataset page and its contents', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByLabelText(/Title/i).should('exist').should('have.attr', 'required', 'required')
    cy.findByText('Title').children('div').trigger('mouseover')
    cy.findByText('The main title of the Dataset').should('exist')

    cy.findByLabelText(/Name/i).should('exist').should('have.attr', 'required', 'required')
    cy.findByText('Author Name').children('div').trigger('mouseover')
    cy.findByText(
      "The name of the author, such as the person's name or the name of an organization"
    ).should('exist')

    cy.findByLabelText(/Point of Contact E-mail/i)
      .should('exist')
      .should('have.attr', 'required', 'required')
    cy.findByText('Point of Contact E-mail').children('div').trigger('mouseover', { force: true })
    cy.findByText("The point of contact's e-mail address").should('exist')

    cy.findByLabelText(/Description Text/i)
      .should('exist')
      .should('have.attr', 'required', 'required')
    cy.findByText('Description Text').children('div').trigger('mouseover')
    cy.findByText('A summary describing the purpose, nature and scope of the Dataset').should(
      'exist'
    )

    cy.findByText('Subject').should('exist')
    cy.findByText('Subject').children('div').trigger('mouseover')
    cy.findByText('The area of study relevant to the Dataset').should('exist')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('shows an error message when the title is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Title is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('shows an error message when the author name is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Author name is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('shows an error message when the point of contact email is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Point of Contact E-mail is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('shows an error message when the point of contact email is not a valid email', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByLabelText(/Point of Contact E-mail/i)
      .type('email')
      .and('have.value', 'email')

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Point of Contact E-mail is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('shows an error message when the description text is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Description Text is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('shows an error message when the subject is not provided', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Subject is required.').should('exist')

    cy.findByText('Validation Error').should('exist')
  })

  it('can submit a valid form', () => {
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByLabelText(/Title/i).type('Test Dataset Title').and('have.value', 'Test Dataset Title')

    cy.findByLabelText(/Name/i).type('Test author name').and('have.value', 'Test author name')

    cy.findByLabelText(/Point of Contact E-mail/i)
      .type('email@test.com')
      .and('have.value', 'email@test.com')

    cy.findByLabelText(/Description Text/i)
      .type('Test description text')
      .and('have.value', 'Test description text')

    cy.findByLabelText(/Arts and Humanities/i)
      .check()
      .should('be.checked')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form submitted successfully!')
  })

  it('shows an error message when the submission fails', () => {
    datasetRepository.create = cy.stub().rejects()
    cy.customMount(<CreateDatasetForm repository={datasetRepository} />)

    cy.findByLabelText(/Title/i).type('Test Dataset Title')
    cy.findByLabelText(/Name/i).type('Test author name')
    cy.findByLabelText(/Point of Contact E-mail/i).type('email@test.com')
    cy.findByLabelText(/Description Text/i).type('Test description text')
    cy.findByLabelText(/Arts and Humanities/i).check()

    cy.findByText(/Save Dataset/i).click()
    cy.contains('Validation Error').should('exist')
  })
})

import { CreateDatasetForm } from '../../../src/sections/create-dataset/CreateDatasetForm'
import { DatasetRepository } from '../../../src/dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../metadata-block-info/domain/models/MetadataBlockInfoMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    metadataBlockInfoRepository.getByColecctionId = cy.stub().resolves(collectionMetadataBlocksInfo)
  })

  it('renders the Create Dataset page and its metadata blocks sections', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByTestId('metadatablocks-accordion').should('exist')
    cy.findByTestId('metadatablocks-accordion').children().should('have.length', 2)

    cy.get('[data-testid="metadatablocks-accordion"] > :nth-child(1)').within((_$accordionItem) => {
      cy.findByText(/Citation Metadata/i).should('exist')
    })

    cy.get('[data-testid="metadatablocks-accordion"] > :nth-child(2)').within((_$accordionItem) => {
      cy.findByText(/Geospatial Metadata/i).should('exist')
    })
  })

  it('renders the Citation Meatadata Form Fields correctly', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    // Check the first accordion item content
    cy.get('[data-testid="metadatablocks-accordion"] > :nth-child(1)').within((_$accordionItem) => {
      cy.findByText(/Citation Metadata/i).should('exist')

      // Title field - required
      cy.findByText('Title').should('exist')
      cy.findByLabelText(/Title/).should('exist').should('have.attr', 'required', 'required')
      cy.findByText(/Title/).children('div').trigger('mouseover')
      cy.document().its('body').findByText('The main title of the Dataset').should('exist')

      // Subtitle field - not required
      cy.findByText('Subtitle').should('exist')
      cy.findByLabelText(/Subtitle/)
        .should('exist')
        .should('not.have.attr', 'required')
      cy.findByText(/Subtitle/)
        .children('div')
        .trigger('mouseover')
      cy.document()
        .its('body')
        .findByText(
          'A secondary title that amplifies or states certain limitations on the main title'
        )
        .should('exist')

      // Author field - compound
      cy.findByText('Author').should('exist')

      // Check properties inside the Author compound
      cy.findByText('Author')
        .closest('.row')
        .within(() => {
          // Author Name property
          cy.findByLabelText(/Name/).should('exist')
          // Author identifier - Vocabulary
          cy.findByLabelText(/Identifier Type/).should('exist')
          cy.findByLabelText(/Identifier Type/).should('have.prop', 'tagName', 'SELECT')
          cy.findByLabelText(/Identifier Type/)
            .children('option')
            .should('have.length', 9)
        })

      // Notes field - TEXTBOX
      cy.findByText('Notes').should('exist')
      cy.findByLabelText(/Notes/).should('exist')
      cy.findByLabelText(/Notes/).should('have.prop', 'tagName', 'TEXTAREA')

      // Producer URL field - URL
      cy.findByText('Producer URL').should('exist')
      cy.findByLabelText(/Producer URL/).should('exist')
      cy.findByTestId('url-field').should('exist')

      // E-mail field - EMAIL
      cy.findByText('E-mail').should('exist')
      cy.findByLabelText(/E-mail/).should('exist')
      cy.findByTestId('email-field').should('exist')

      // Description Date field - DATE
      cy.findByText('Description Date').should('exist')
      cy.findByLabelText(/Description Date/).should('exist')
      cy.findByTestId('date-field').should('exist')

      // Float Something field - FLOAT
      cy.findByText('Float Something').should('exist')
      cy.findByLabelText(/Float Something/).should('exist')
      cy.findByTestId('float-field').should('exist')

      // Integer Something field - INT
      cy.findByText('Integer Something').should('exist')
      cy.findByLabelText(/Integer Something/).should('exist')
      cy.findByTestId('int-field').should('exist')

      // Multiple Vocabulary field - VOCABULARY and MULTIPLE
      cy.findByText('Multiple Vocabulary').should('exist')
      cy.findAllByTestId('vocabulary-multiple').should('exist')
      cy.findByTestId('vocabulary-multiple').should('exist')
    })

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('renders skeleton while loading', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('metadata-blocks-skeleton').should('exist')
  })

  describe('When getting collection metadata blocks info fails', () => {
    it('renders error message', () => {
      metadataBlockInfoRepository.getByColecctionId = cy.stub().rejects(new Error('some error'))

      cy.customMount(
        <CreateDatasetForm
          repository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByText('Error').should('exist')
    })

    it('disables save button', () => {
      metadataBlockInfoRepository.getByColecctionId = cy.stub().rejects(new Error('some error'))

      cy.customMount(
        <CreateDatasetForm
          repository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      cy.findByText(/Save Dataset/i).should('be.disabled')
    })
  })

  // it.skip('shows an error message when the title is not provided', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Title is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('shows an error message when the author name is not provided', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Author name is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('shows an error message when the point of contact email is not provided', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Point of Contact E-mail is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('shows an error message when the point of contact email is not a valid email', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByLabelText(/Point of Contact E-mail/i)
  //     .type('email')
  //     .and('have.value', 'email')

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Point of Contact E-mail is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('shows an error message when the description text is not provided', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Description Text is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('shows an error message when the subject is not provided', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByText(/Save Dataset/i).click()

  //   cy.findByText('Subject is required.').should('exist')

  //   cy.findByText('Error: Submission failed.').should('exist')
  // })

  // it.skip('can submit a valid form', () => {
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByLabelText(/Title/i).type('Test Dataset Title').and('have.value', 'Test Dataset Title')

  //   cy.findByLabelText(/Author Name/i)
  //     .type('Test author name')
  //     .and('have.value', 'Test author name')

  //   cy.findByLabelText(/Point of Contact E-mail/i)
  //     .type('email@test.com')
  //     .and('have.value', 'email@test.com')

  //   cy.findByLabelText(/Description Text/i)
  //     .type('Test description text')
  //     .and('have.value', 'Test description text')

  //   cy.findByLabelText(/Arts and Humanities/i)
  //     .check()
  //     .should('be.checked')

  //   cy.findByText(/Save Dataset/i).click()
  //   cy.findByText('Form submitted successfully!')
  // })

  // it.skip('shows an error message when the submission fails', () => {
  //   datasetRepository.create = cy.stub().rejects()
  //   cy.customMount(
  //     <CreateDatasetForm
  //       repository={datasetRepository}
  //       metadataBlockInfoRepository={metadataBlockInfoRepository}
  //     />
  //   )

  //   cy.findByLabelText(/Title/i).type('Test Dataset Title')
  //   cy.findByLabelText(/Author Name/i).type('Test author name')
  //   cy.findByLabelText(/Point of Contact E-mail/i).type('email@test.com')
  //   cy.findByLabelText(/Description Text/i).type('Test description text')
  //   cy.findByLabelText(/Arts and Humanities/i).check()

  //   cy.findByText(/Save Dataset/i).click()
  //   cy.findByText('Error: Submission failed.').should('exist')
  // })
})

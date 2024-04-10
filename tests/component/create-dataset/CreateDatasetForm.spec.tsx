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
      cy.findByText(/Astronomy and Astrophysics Metadata/i).should('exist')
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
      cy.findByLabelText(/^Title/i).should('exist')
      cy.findByText('Title').children('div').trigger('mouseover')
      cy.document().its('body').findByText('The main title of the Dataset').should('exist')

      // Subtitle field - not required
      cy.findByText('Subtitle').should('exist')
      cy.findByLabelText(/^Subtitle/i)
        .should('exist')
        .should('not.have.attr', 'required')
      cy.findByText('Subtitle').children('div').trigger('mouseover')
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

      // Alternative URL field - URL
      cy.findByText('Alternative URL').should('exist')
      cy.findByLabelText(/Alternative URL/).should('exist')
      cy.findAllByTestId('url-field').should('exist')

      // E-mail field - EMAIL
      cy.findByText('E-mail').should('exist')
      cy.findByLabelText(/E-mail/).should('exist')
      cy.findByTestId('email-field').should('exist')

      // Description.Date field - DATE
      cy.findByText('Date').should('exist')
      cy.findByLabelText(/Date/).should('exist')
      cy.findByTestId('date-field').should('exist')
    })

    // Subject field - VOCABULARY and MULTIPLE
    cy.findByText('Subject').should('exist')
    cy.findAllByTestId('vocabulary-multiple').should('exist')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('renders the Astronomy and Astrophysics Metadata Form Fields correctly', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.get('[data-testid="metadatablocks-accordion"] > :nth-child(2)').within((_$accordionItem) => {
      cy.findByText(/Astronomy and Astrophysics Metadata/i).should('exist')

      // Depth Coverage field - FLOAT
      cy.findByText('Depth Coverage').should('exist')
      cy.findByLabelText(/Depth Coverage/).should('exist')
      cy.findAllByTestId('float-field').should('exist')

      // Integer Something field - INT
      cy.findByText('Object Count').should('exist')
      cy.findByLabelText(/Object Count/).should('exist')
      cy.findByTestId('int-field').should('exist')
    })
  })

  it('should display required errors when submitting the form with required fields empty', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Title is required').should('exist')
    cy.findByLabelText(/^Title/i).should('have.focus')

    cy.findByText('Author Name is required').should('exist')
    cy.findByText('Point of Contact E-mail is required').should('exist')
    cy.findByText('Description Text is required').should('exist')
    cy.findByText('Subject is required').should('exist')
  })

  it('should not display required errors when submitting the form with those fields filled', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByLabelText(/^Title/i).type('Test Dataset Title')
    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test author name')
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@test.com')
      })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Test description text')
      })
    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Arts and Humanities/i).check()
      })

    cy.findByText(/Save Dataset/i).click()

    cy.findByText('Author Name is required').should('not.exist')
    cy.findByText('Point of Contact E-mail is required').should('not.exist')
    cy.findByText('Description Text is required').should('not.exist')
    cy.findByText('Subject is required').should('not.be.visible')
  })

  it('should show correct errors when filling inputs with invalid formats', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByLabelText(/Alternative URL/).type('html://test.com')
    cy.findByText('Alternative URL is not a valid URL').should('exist')

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/Date/).type('1990-23-23')
        cy.findByText(/^Description Date is not a valid date./).should('exist')
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test')
        cy.findByText('Point of Contact E-mail is not a valid email').should('exist')
      })

    // We need to open the Astronomy and Astrophysics Metadata accordion to fill the fields first, in this metadatablock we have ints and floats fields
    cy.get(':nth-child(2) > .accordion-header > .accordion-button').click()
    cy.wait(250) // Maybe not needed?

    cy.findByLabelText(/Depth Coverage/).type('30L')
    cy.findByText('Depth Coverage is not a valid float').should('exist')

    // Object Count
    cy.findByLabelText(/Object Count/).type('30.5')
    cy.findByText('Object Count is not a valid integer').should('exist')
  })

  it('should not show errors when filling inputs with valid formats', () => {
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.customMount(
      <CreateDatasetForm
        repository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByLabelText(/Alternative URL/).type('https://test.com')
    cy.findByText('Alternative URL is not a valid URL').should('not.exist')

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/Date/).type('1990-01-23')
        cy.findByText(/^Description Date is not a valid date./).should('not.exist')
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@test.com')
        cy.findByText('Point of Contact E-mail is not a valid email').should('not.exist')
      })

    // We need to open the Astronomy and Astrophysics Metadata accordion to fill the fields first, in this metadatablock we have ints and floats fields
    cy.get(':nth-child(2) > .accordion-header > .accordion-button').click()
    cy.wait(250) // Maybe not needed?

    cy.findByLabelText(/Depth Coverage/).type('3.14159265')
    cy.findByText('Depth Coverage is not a valid float').should('not.exist')

    // Object Count
    cy.findByLabelText(/Object Count/).type('30')
    cy.findByText('Object Count is not a valid integer').should('not.exist')
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
  //   cy.findByText(/Save Dataset/i).click()
  //   cy.findByText('Error: Submission failed.').should('exist')
  // })
})

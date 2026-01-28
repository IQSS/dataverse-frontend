import { createTemplate } from '@iqss/dataverse-client-javascript'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { TypeMetadataFieldOptions } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const metadataBlocksInfo = MetadataBlockInfoMother.getAllBlocks()

describe('TemplateMetadataForm', () => {
  beforeEach(() => {
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(metadataBlocksInfo)
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([])
  })

  const mountTemplateMetadataForm = () =>
    cy.customMount(
      <TemplateMetadataForm
        collectionId="root"
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    )

  const fillRequiredTemplateFields = () => {
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

    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText('Subject')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Toggle options menu').click()
          cy.findByText('Agricultural Sciences').should('exist')
          cy.findByLabelText('Agricultural Sciences').click()
        })
    })
  }

  it('renders the correct form fields from Citation Metadata Block', () => {
    mountTemplateMetadataForm()

    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText(/Citation Metadata/i).should('exist')

      cy.findByText('Title').should('exist')
      cy.findByLabelText(/^Title/i)
        .should('exist')
        .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

      cy.findByText('Author')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Name/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)
        })

      cy.findByText('Point of Contact')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/^E-mail/i).should('exist')
        })
    })
  })

  it('renders all metadata block sections', () => {
    mountTemplateMetadataForm()

    cy.findByText('Citation Metadata').should('exist')
    cy.findByText('Geospatial Metadata').should('exist')
    cy.findByText('Social Science and Humanities Metadata').should('exist')
    cy.findByText('Life Sciences Metadata').should('exist')
    cy.findByText('Journal Metadata').should('exist')
  })

  it('renders Save + Add Terms and Cancel', () => {
    mountTemplateMetadataForm()

    cy.findByRole('button', { name: 'Save + Add Terms' }).should('exist')
    cy.findByRole('button', { name: 'Cancel' }).should('exist')
  })

  it('should render the template name input field', () => {
    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).should('exist')
  })

  it('should display an error when submitting with template name empty', () => {
    mountTemplateMetadataForm()

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText('Please add in a name for the dataset template.').should('exist')
  })

  it('should not enforce required validation when creating a template', () => {
    const executeStub = cy.stub(createTemplate, 'execute').resolves()

    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).type('Test Template')
    cy.findByRole('button', { name: 'Save + Add Terms' }).click()

    cy.findByText('Title is required').should('not.exist')
    cy.findByText('Author Name is required').should('not.exist')
    cy.findByText('Point of Contact E-mail is required').should('not.exist')
    cy.findByText('Description Text is required').should('not.exist')
    cy.findByText('Subject is required').should('not.exist')

    executeStub.restore()
  })

  it('should show correct errors when filling inputs with invalid formats', () => {
    mountTemplateMetadataForm()

    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText('Keyword')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Term URI', { exact: true }).type('html://test.com')
          cy.findByText('Keyword Term URI html://test.com is not a valid URL.').should('exist')
        })

      cy.findByText('Description')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Date/).type('1990-23-23')
          cy.findByText(/^Description Date is not a valid date./).should('exist')
        })

      cy.findByText('Point of Contact')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/^E-mail/i).type('test')
          cy.findByText('Point of Contact E-mail test is not a valid email.').should('exist')
        })
    })
  })

  it('should save custom instructions for template fields', () => {
    const executeStub = cy.stub(createTemplate, 'execute').resolves()

    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).type('Test Template')
    fillRequiredTemplateFields()

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').type('Use the official dataset title')
    cy.findByTestId('custom-instructions-save-title').click()

    cy.findByTestId('custom-instructions-toggle-author').click()
    cy.findByTestId('custom-instructions-input-author').type('List all contributing authors')
    cy.findByTestId('custom-instructions-save-author').click()

    cy.findByTestId('custom-instructions-toggle-authorName').should('not.exist')

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.wrap(executeStub).should('have.been.calledOnce')
  })

  it('should discard custom instructions when canceling edit', () => {
    mountTemplateMetadataForm()

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').type('Draft instructions')
    cy.findByTestId('custom-instructions-cancel-title').click()

    cy.findByTestId('custom-instructions-toggle-title')
      .should('exist')
      .and('contain.text', '(None - click to add)')

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').should('have.value', '')
  })

  it('shows an error message when metadata blocks fail to load', () => {
    metadataBlockInfoRepository.getByCollectionId = cy
      .stub()
      .rejects(new Error('Failed to load metadata blocks'))

    mountTemplateMetadataForm()

    cy.findByText(/Failed to load metadata blocks/i).should('exist')
  })
})

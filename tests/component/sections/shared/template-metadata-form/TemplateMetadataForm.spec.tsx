import { useLocation } from 'react-router-dom'
import { TemplateMetadataForm } from '@/sections/shared/form/TemplateMetadataForm/TemplateMetadataForm'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { TypeMetadataFieldOptions } from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const metadataBlocksInfo = MetadataBlockInfoMother.getAllBlocks()

describe('TemplateMetadataForm', () => {
  const LocationDisplay = () => {
    const location = useLocation()
    return <div data-testid="location-display">{location.pathname}</div>
  }

  beforeEach(() => {
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(metadataBlocksInfo)
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([])
  })

  const mountTemplateMetadataForm = () =>
    cy.customMount(
      <>
        <TemplateMetadataForm
          mode="create"
          collectionId="root"
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          templateRepository={templateRepository}
        />
        <LocationDisplay />
      </>
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
    templateRepository.createTemplate = cy.stub().resolves()

    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).type('Test Template')
    cy.findByRole('button', { name: 'Save + Add Terms' }).click()

    cy.findByText('Title is required').should('not.exist')
    cy.findByText('Author Name is required').should('not.exist')
    cy.findByText('Point of Contact E-mail is required').should('not.exist')
    cy.findByText('Description Text is required').should('not.exist')
    cy.findByText('Subject is required').should('not.exist')
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
    const createStub = cy.stub().resolves()
    templateRepository.createTemplate = createStub

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
    cy.wrap(createStub).should('have.been.calledOnce')
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

  it('removes cleared custom instructions from the submit payload', () => {
    const createStub = cy.stub().resolves()
    templateRepository.createTemplate = createStub

    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).type('Test Template')

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').type('Use the official title')
    cy.findByTestId('custom-instructions-save-title').click()

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').clear()
    cy.findByTestId('custom-instructions-save-title').click()

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()

    cy.wrap(createStub).should('have.been.calledOnce')
    cy.wrap(createStub).then((stub) => {
      const payload = (stub as unknown as sinon.SinonStub).getCall(0).args[0] as {
        instructions?: unknown[]
      }
      expect(payload.instructions).to.equal(undefined)
    })
  })

  it('removes only the cleared instruction when multiple exist', () => {
    const createStub = cy.stub().resolves()
    templateRepository.createTemplate = createStub

    mountTemplateMetadataForm()

    cy.findByLabelText(/Template Name/).type('Test Template')

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').type('Use the official title')
    cy.findByTestId('custom-instructions-save-title').click()

    cy.findByTestId('custom-instructions-toggle-author').click()
    cy.findByTestId('custom-instructions-input-author').type('List all authors')
    cy.findByTestId('custom-instructions-save-author').click()

    cy.findByTestId('custom-instructions-toggle-title').click()
    cy.findByTestId('custom-instructions-input-title').clear()
    cy.findByTestId('custom-instructions-save-title').click()

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()

    cy.wrap(createStub).should('have.been.calledOnce')
    cy.wrap(createStub).then((stub) => {
      const payload = (stub as unknown as sinon.SinonStub).getCall(0).args[0] as {
        instructions?: { instructionField: string }[]
      }
      expect(payload.instructions).to.have.length(1)
      expect(payload.instructions?.[0]).to.have.property('instructionField', 'author')
    })
  })

  it('clears the validation error when a non-empty template name is entered', () => {
    mountTemplateMetadataForm()

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText('Please add in a name for the dataset template.').should('exist')

    cy.findByLabelText(/Template Name/).type('Valid Template Name')
    cy.findByText('Please add in a name for the dataset template.').should('not.exist')
  })
})

import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { TypeMetadataFieldOptions } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DatasetMetadataForm } from '../../../../../src/sections/shared/form/DatasetMetadataForm'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const dataset = DatasetMother.createRealistic()
const metadataBlocksInfoOnCreateMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

const metadataBlocksInfoOnEditMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()

describe('DatasetMetadataForm', () => {
  beforeEach(() => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    metadataBlockInfoRepository.getByColecctionId = cy.stub().resolves(metadataBlocksInfoOnEditMode)
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(metadataBlocksInfoOnCreateMode)
  })

  it('renders the form in create mode', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('metadata-form').should('exist')
  })

  it('renders the form in edit mode', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="edit"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        datasetPersistentID={dataset.persistentId}
        datasetMetadaBlocksCurrentValues={dataset.metadataBlocks}
      />
    )

    cy.findByTestId('metadata-form').should('exist')
  })

  it('renders the correct metadata block form sections', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findByText(/Citation Metadata/i).should('exist')
    cy.findByText(/Geospatial Metadata/i).should('exist')
    cy.findByText(/Social Sciences and Humanities Metadata/i).should('not.exist')
    cy.findByText(/Astronomy and Astrophysics Metadata/i).should('not.exist')
    cy.findByText(/Life Sciences Metadata/i).should('not.exist')
    cy.findByText(/Journal Metadata/i).should('not.exist')
  })

  it.only('renders the Citation Metadata Form Fields correctly on create mode', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    // Check the first accordion item content
    cy.get('.accordion > :nth-child(1)').within((_$accordionItem) => {
      cy.findByText(/Citation Metadata/i).should('exist')

      // Title field - required
      cy.findByText('Title').should('exist')

      cy.findByLabelText(/^Title/i)
        .should('exist')
        .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)
      //   cy.findByText('Title').children('div').trigger('mouseover')
      //   cy.document().its('body').findByText('The main title of the Dataset').should('exist')

      //   cy.findByText('Subtitle').children('div').trigger('mouseover')
      //   cy.document()
      //     .its('body')
      //     .findByText(
      //       'A secondary title that amplifies or states certain limitations on the main title'
      //     )
      //     .should('exist')

      // TODO:ME Assert that as it is a multiple field, it should have a button to add more fields visible
      // Composed field
      cy.findByText('Author')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Name/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(/Affiliation/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Identifier Type', { exact: true })
            .should('exist')
            .should('have.prop', 'tagName', 'SELECT')
            .children('option')
            .should('have.length', 9)

          cy.findByLabelText('Identifier', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(`Add Author`).should('exist')
          cy.findByLabelText(`Delete Author`).should('not.exist')
        })

      // Composed field
      cy.findByText('Point of Contact')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Name/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(/Affiliation/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(/E-mail/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Email)

          cy.findByLabelText(`Add Point of Contact`).should('exist')
          cy.findByLabelText(`Delete Point of Contact`).should('not.exist')
        })

      // Composed field
      cy.findByText('Description')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Text/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

          cy.findByLabelText(/Date/)
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

          cy.findByLabelText(`Add Description`).should('exist')
          cy.findByLabelText(`Delete Description`).should('not.exist')
        })

      // TODO:ME Would be nice to assert that the select multiple is rendered correctly
      cy.findByText('Subject').should('exist')
      cy.findByLabelText(/Subject/).should('exist')

      // Composed field
      cy.findByText('Keyword')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Term', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Term URI', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

          cy.findByLabelText('Controlled Vocabulary Name', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Controlled Vocabulary URL', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

          cy.findByLabelText(`Add Keyword`).should('exist')
          cy.findByLabelText(`Delete Keyword`).should('not.exist')
        })

      // Composed field
      cy.findByText('Related Publication')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Citation', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

          cy.findByLabelText('Identifier Type', { exact: true })
            .should('exist')
            .should('have.prop', 'tagName', 'SELECT')
            .children('option')
            .should('have.length', 20)

          cy.findByLabelText('Identifier', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('URL', { exact: true })
            .should('exist')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

          cy.findByLabelText(`Add Related Publication`).should('exist')
          cy.findByLabelText(`Delete Related Publication`).should('not.exist')
        })

      cy.findByText('Notes').should('exist')
      cy.findByLabelText(/Notes/)
        .should('exist')
        .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)
      cy.findByLabelText(/Notes/).should('have.prop', 'tagName', 'TEXTAREA')
    })

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  // TODO:ME Here assert all fields correctly for edit mode

  it('shows the skeleton while loading', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByTestId('metadata-form-loading-skeleton').should('exist')
  })

  it('renders error message when getting collection metadata blocks info fails', () => {
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .rejects(new Error('some error'))

    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText('Error').should('exist')
  })
})

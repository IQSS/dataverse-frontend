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

  it('renders the Citation and Geospatial Metadata Form Fields correctly on create mode', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    // 1st Accordion with Citation Metadata
    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText(/Citation Metadata/i).should('exist')

      // Title field - required
      cy.findByText('Title').should('exist')
      // .within(() => {
      //   cy.get('[aria-label="Required input symbol"]').should('exist')
      // })

      cy.findByLabelText(/^Title/i)
        .should('exist')
        .should('have.attr', 'aria-required', 'true')
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

      // Composed field
      cy.findByText('Author')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Name/)
            .should('exist')
            .should('have.attr', 'aria-required', 'true')
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
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(/Affiliation/)
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(/E-mail/)
            .should('exist')
            .should('have.attr', 'aria-required', 'true')
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
            .should('have.attr', 'aria-required', 'true')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

          cy.findByLabelText(/Date/)
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

          cy.findByLabelText(`Add Description`).should('exist')
          cy.findByLabelText(`Delete Description`).should('not.exist')
        })

      cy.findByText('Subject')
        .should('exist')
        .within(() => {
          cy.get('[aria-label="Required input symbol"]').should('exist')
        })

      cy.findByLabelText(/Subject/).should('exist')
      cy.findByLabelText(/Subject/).click()
      cy.findByText('Subject1').should('exist')
      cy.findByText('Subject2').should('exist')
      cy.findByText('Subject3').should('exist')
      cy.findByText('Subject4').should('exist')

      // Composed field
      cy.findByText('Keyword')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Term', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Term URI', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

          cy.findByLabelText('Controlled Vocabulary Name', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Controlled Vocabulary URL', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
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
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

          cy.findByLabelText('Identifier Type', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.prop', 'tagName', 'SELECT')
            .children('option')
            .should('have.length', 20)

          cy.findByLabelText('Identifier', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('URL', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

          cy.findByLabelText(`Add Related Publication`).should('exist')
          cy.findByLabelText(`Delete Related Publication`).should('not.exist')
        })

      cy.findByText('Notes').should('exist')
      cy.findByLabelText(/Notes/)
        .should('exist')
        .should('have.attr', 'aria-required', 'false')
        .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)
      cy.findByLabelText(/Notes/).should('have.prop', 'tagName', 'TEXTAREA')
    })

    // 2nd Accordion with Geospatial Metadata
    cy.get('.accordion > :nth-child(2)').within(() => {
      // Open accordion and wait for it to open
      cy.get('.accordion-button').click()
      cy.wait(300)

      cy.findByText(/Geospatial Metadata/i).should('exist')

      cy.findByLabelText('Geographic Unit')
        .should('exist')
        .should('have.attr', 'aria-required', 'false')
        .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

      // Composed field
      cy.findByText('Geographic Coverage')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Country \/ Nation/)
            .should('exist')
            .should('have.attr', 'aria-required', 'true')
            .should('have.prop', 'tagName', 'SELECT')
            .children('option')
            .should('have.length', 250)

          cy.findByLabelText(/State \/ Province/)
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('City')
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText('Other')
            .should('exist')
            .should('have.attr', 'aria-required', 'false')
            .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

          cy.findByLabelText(`Add Geographic Coverage`).should('not.exist')
        })
    })

    cy.findByRole('button', { name: 'Save Dataset' }).should('exist')

    cy.findByRole('button', { name: 'Cancel' }).should('exist')
  })

  it.only('renders the Citation and Geospatial Metadata Form Fields correctly on edit mode', () => {
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

    // 1st Accordion with Citation Metadata
    cy.get('.accordion > :nth-child(1)').within(() => {})

    cy.findAllByRole('button', { name: 'Save Changes' }).should('exist').should('have.length', 2)

    cy.findAllByRole('button', { name: 'Cancel' }).should('exist').should('have.length', 2)
  })

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

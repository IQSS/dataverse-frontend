import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { TypeMetadataFieldOptions } from '../../../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { DatasetMetadataForm } from '../../../../../src/sections/shared/form/DatasetMetadataForm'
import { UserRepository } from '../../../../../src/users/domain/repositories/UserRepository'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UserMother } from '../../../users/domain/models/UserMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const userRepository: UserRepository = {} as UserRepository

const dataset = DatasetMother.createRealistic()
const datasetWithAstroBlock = DatasetMother.createRealistic({
  metadataBlocks: [
    ...dataset.metadataBlocks,
    {
      name: MetadataBlockName.ASTROPHYSICS,
      fields: {
        'coverage.ObjectDensity': '23.35',
        'coverage.ObjectCount': '50'
      }
    }
  ]
})

const metadataBlocksInfoOnCreateMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

const metadataBlocksInfoOnCreateModeWithAstroBlock =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue({
    id: 4,
    name: 'astrophysics',
    displayName: 'Astronomy and Astrophysics Metadata',
    displayOnCreate: false,
    metadataFields: {
      'coverage.ObjectDensity': {
        name: 'coverage.ObjectDensity',
        displayName: 'Object Density',
        title: 'Object Density',
        type: 'FLOAT',
        watermark: 'Enter a floating-point number.',
        description:
          'The (typical) density of objects, catalog entries, telescope pointings, etc., on the sky, in number per square degree.',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 17,
        typeClass: 'primitive',
        displayOnCreate: false
      },
      'coverage.ObjectCount': {
        name: 'coverage.ObjectCount',
        displayName: 'Object Count',
        title: 'Object Count',
        type: 'INT',
        watermark: 'Enter an integer.',
        description: 'The total number of objects, catalog entries, etc., in the data object.',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOrder: 18,
        typeClass: 'primitive',
        displayOnCreate: false
      },
      someDate: {
        name: 'someDate',
        displayName: 'Some Date in either of the formats',
        title: 'Some Date',
        type: 'DATE',
        typeClass: 'primitive',
        watermark: 'YYYY or YYYY-MM or YYYY-MM-DD',
        description: 'Some description',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 3
      }
    }
  })

const metadataBlocksInfoOnCreateModeWithComposedNotMultipleField =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue({
    id: 4,
    name: 'astrophysics',
    displayName: 'Astronomy and Astrophysics Metadata',
    displayOnCreate: false,
    metadataFields: {
      producer: {
        name: 'producer',
        displayName: 'Producer',
        title: 'Producer',
        type: 'NONE',
        watermark: '',
        description:
          'The entity, such a person or organization, managing the finances or other administrative processes involved in the creation of the Dataset',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOrder: 36,
        typeClass: 'compound',
        displayOnCreate: false,
        childMetadataFields: {
          producerName: {
            name: 'producerName',
            displayName: 'Producer Name',
            title: 'Name',
            type: 'TEXT',
            watermark: '1) FamilyName, GivenName or 2) Organization',
            description:
              "The name of the entity, e.g. the person's name or the name of an organization",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '#VALUE',
            isRequired: true,
            displayOrder: 37,
            typeClass: 'primitive',
            displayOnCreate: false
          },
          producerAffiliation: {
            name: 'producerAffiliation',
            displayName: 'Producer Affiliation',
            title: 'Affiliation',
            type: 'TEXT',
            watermark: 'Organization XYZ',
            description:
              "The name of the entity affiliated with the producer, e.g. an organization's name",
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '(#VALUE)',
            isRequired: false,
            displayOrder: 38,
            typeClass: 'primitive',
            displayOnCreate: false
          }
        }
      }
    }
  })

const metadataBlocksInfoOnEditMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()
const wrongCollectionMetadataBlocksInfo =
  MetadataBlockInfoMother.wrongCollectionMetadataBlocksInfo()
const testUser = UserMother.create()

const fillRequiredFieldsOnCreate = () => {
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
      cy.findByLabelText('Toggle options menu').click()

      cy.findByText('Subject1').should('exist')
      cy.findByLabelText('Subject1').click()
    })

  cy.findByText('Geographic Coverage')
    .should('exist')
    .closest('.row')
    .within(() => {
      cy.findByLabelText(/Country \/ Nation/)
        .should('exist')
        .select('Argentina', { force: true })
    })
}

describe('DatasetMetadataForm', () => {
  beforeEach(() => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    datasetRepository.updateMetadata = cy.stub().resolves(undefined)
    metadataBlockInfoRepository.getByColecctionId = cy.stub().resolves(metadataBlocksInfoOnEditMode)
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(metadataBlocksInfoOnCreateMode)

    userRepository.getAuthenticated = cy.stub().resolves(testUser)
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

  describe('renders the Citation and Geospatial Metadata Form Fields correctly on create mode', () => {
    beforeEach(() => {
      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
    })
    it('renders the correct form fields from Citation Metadata Block', () => {
      // 1st Accordion with Citation Metadata
      cy.get('.accordion > :nth-child(1)').within(() => {
        cy.findByText(/Citation Metadata/i).should('exist')

        cy.findByText('Title').should('exist')
        cy.findByLabelText(/^Title/i)
          .should('exist')
          .should('have.attr', 'aria-required', 'true')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

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
    })

    it('renders the correct form fields from Geospatial Metadata Block', () => {
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
    })
    it('renders Save Dataset and Cancel buttons once', () => {
      cy.findByRole('button', { name: 'Save Dataset' }).should('exist').should('have.length', 1)

      cy.findByRole('button', { name: 'Cancel' }).should('exist').should('have.length', 1)
    })
  })

  describe('renders the Citation and Geospatial Metadata Form Fields correctly on edit mode', () => {
    beforeEach(() => {
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
    })

    it('renders the correct form fields from Citation Metadata Block', () => {
      // 1st Accordion with Citation Metadata
      cy.get('.accordion > :nth-child(1)').within(() => {
        cy.findByText(/Citation Metadata/i).should('exist')

        cy.findByText('Title').should('exist')
        cy.findByLabelText(/^Title/i)
          .should('exist')
          .should('have.attr', 'aria-required', 'true')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

        cy.findByText('Subtitle').should('exist')
        cy.findByLabelText(/^Subtitle/i)
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

        // Primitive multiple
        cy.findByText('Alternative Title')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Alternative Title/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Alternative Title`).should('exist')
          })

        cy.findByText('Alternative URL').should('exist')
        cy.findByLabelText(/^Alternative URL/i)
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

        // Composed field
        cy.findByText('Other Identifier')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/Agency/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Identifier', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Other Identifier`).should('exist')
            cy.findByLabelText(`Delete Other Identifier`).should('not.exist')
          })

        // Composed field
        cy.findByText('Author')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findAllByLabelText(/Name/)
              .should('exist')
              .should('have.length', 2)
              .should('have.attr', 'aria-required', 'true')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText(/Name/).each(
              (_$input, _$index, $inputList: HTMLInputElement[]) => {
                const inputValues = Array.from($inputList).map((input) => input.value)
                const expectedInputValues = ['Admin, Dataverse', 'Owner, Dataverse']
                expect(inputValues).to.deep.equal(expectedInputValues)
              }
            )

            cy.findAllByLabelText(/Affiliation/)
              .should('exist')
              .should('have.length', 2)
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText(/Affiliation/).each(
              (_$input, _$index, $inputList: HTMLInputElement[]) => {
                const inputValues = Array.from($inputList).map((input) => input.value)
                const expectedInputValues = ['Dataverse.org', 'Dataverse.org']
                expect(inputValues).to.deep.equal(expectedInputValues)
              }
            )

            cy.findAllByLabelText('Identifier Type', { exact: true })
              .should('exist')
              .should('have.length', 2)
              .should('have.attr', 'aria-required', 'false')
              .should('have.prop', 'tagName', 'SELECT')
              .children('option')
              .should('have.length', 18) // 9 options each select

            cy.findAllByLabelText('Identifier Type', { exact: true }).each(
              (_$input, _$index, $inputList: HTMLSelectElement[]) => {
                const inputValues = Array.from($inputList).map((input) => input.value)
                const expectedInputValues = ['ORCID', 'ORCID']
                expect(inputValues).to.deep.equal(expectedInputValues)
              }
            )

            cy.findAllByLabelText('Identifier', { exact: true })
              .should('exist')
              .should('have.length', 2)
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText('Identifier', { exact: true }).each(
              (_$input, _$index, $inputList: HTMLInputElement[]) => {
                const inputValues = Array.from($inputList).map((input) => input.value)
                const expectedInputValues = ['0000-0002-1825-1097', '0000-0032-1825-0098']
                expect(inputValues).to.deep.equal(expectedInputValues)
              }
            )

            // As we have to groups of Author fields, we should have 2 Add Author buttons and 1 Delete Author button
            cy.findAllByLabelText(`Add Author`).should('have.length', 2)
            cy.findByLabelText(`Delete Author`).should('exist')
          })

        // Composed field
        cy.findByText('Point of Contact')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/Name/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', 'Admin, Dataverse')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(/Affiliation/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(/E-mail/)
              .should('exist')
              .should('have.attr', 'aria-required', 'true')
              .should('have.value', 'admin@dataverse.org')
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
              .should(
                'have.value',
                'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
              )
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

            cy.findByLabelText(/Date/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

            cy.findByLabelText(`Add Description`).should('exist')
            cy.findByLabelText(`Delete Description`).should('not.exist')
          })

        // Subject - Select multiple field
        cy.findByText('Subject', { exact: true })
          .should('exist')
          .within(() => {
            cy.get('[aria-label="Required input symbol"]').should('exist')
          })

        cy.get('[id="citation.subject"]').as('subjectFieldInputButton')
        cy.get('@subjectFieldInputButton').should('exist')
        cy.get('@subjectFieldInputButton').click()
        cy.findAllByRole('checkbox', { name: 'Subject1' })
          .should('be.checked')
          .should('have.value', 'Subject1')
        cy.findAllByRole('checkbox', { name: 'Subject2' })
          .should('be.checked')
          .should('have.value', 'Subject2')
        cy.findAllByRole('checkbox', { name: 'Subject3' })
          .should('not.be.checked')
          .should('have.value', 'Subject3')
        cy.findAllByRole('checkbox', { name: 'Subject4' })
          .should('not.be.checked')
          .should('have.value', 'Subject4')

        // End Subject - Select multiple field

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
        cy.findByText('Topic Classification')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Term', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Controlled Vocabulary Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Controlled Vocabulary URL', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

            cy.findByLabelText(`Add Topic Classification`).should('exist')
            cy.findByLabelText(`Delete Topic Classification`).should('not.exist')
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

        // Language - Select multiple field
        cy.findByText('Language', { exact: true })
          .should('exist')
          .within(() => {
            cy.get('[aria-label="Required input symbol"]').should('not.exist')
          })

        // Assert that all options are unchecked
        cy.get('[id="citation.language"]').as('languageFieldInputButton')
        cy.get('@languageFieldInputButton').should('exist')
        cy.get('@languageFieldInputButton').click()
        cy.findAllByRole('checkbox').should('not.be.checked')
        cy.findAllByRole('checkbox').should('have.length', 187)
        // End Language - Select multiple field

        // Composed field
        cy.findByText('Producer')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Affiliation', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Abbreviated Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('URL', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

            cy.findByLabelText('Logo URL', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

            cy.findAllByLabelText(`Add Producer`).should('exist')
            cy.findByLabelText(`Delete Producer`).should('not.exist')
          })

        cy.findByText('Production Date').should('exist')
        cy.findByLabelText('Production Date')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.value', '')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

        // Primitive multiple
        cy.findByText('Production Location')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Production Location/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Production Location`).should('exist')
          })

        // Composed field
        cy.findByText('Contributor')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Type', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.prop', 'tagName', 'SELECT')
              .children('option')
              .should('have.length', 18)

            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText(`Add Contributor`).should('exist')
            cy.findByLabelText(`Delete Contributor`).should('not.exist')
          })

        // Composed field
        cy.findByText('Funding Information')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Agency', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Identifier', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText(`Add Funding Information`).should('exist')
            cy.findByLabelText(`Delete Funding Information`).should('not.exist')
          })

        // Composed field
        cy.findByText('Distributor')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Affiliation', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Abbreviated Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('URL', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

            cy.findByLabelText('Logo URL', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.URL)

            cy.findAllByLabelText(`Add Distributor`).should('exist')
            cy.findByLabelText(`Delete Distributor`).should('not.exist')
          })

        cy.findByText('Distribution Date').should('exist')
        cy.findByLabelText('Distribution Date')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.value', '')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

        cy.findByText('Depositor').should('exist')
        cy.findByLabelText('Depositor')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.value', '')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

        cy.findByText('Deposit Date').should('exist')
        cy.findByLabelText('Deposit Date')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.value', '')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

        // Composed field
        cy.findByText('Time Period')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Start Date', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

            cy.findByLabelText('End Date', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

            cy.findAllByLabelText(`Add Time Period`).should('exist')
            cy.findByLabelText(`Delete Time Period`).should('not.exist')
          })

        // Composed field
        cy.findByText('Date of Collection')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Start Date', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

            cy.findByLabelText('End Date', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Date)

            cy.findAllByLabelText(`Add Date of Collection`).should('exist')
            cy.findByLabelText(`Delete Date of Collection`).should('not.exist')
          })

        // Primitive multiple
        cy.findByText('Data Type')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Data Type/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Data Type`).should('exist')
          })

        // Composed field
        cy.findByText('Series')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Information', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

            cy.findAllByLabelText(`Add Series`).should('exist')
            cy.findByLabelText(`Delete Series`).should('not.exist')
          })

        // Composed field
        cy.findByText('Software')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Version', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findAllByLabelText(`Add Software`).should('exist')
            cy.findByLabelText(`Delete Software`).should('not.exist')
          })

        // Primitive multiple
        cy.findByText('Related Material')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Related Material/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

            cy.findByLabelText(`Add Related Material`).should('exist')
          })

        // Primitive multiple
        cy.findByText('Related Dataset')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Related Dataset/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

            cy.findByLabelText(`Add Related Dataset`).should('exist')
          })

        cy.findByText('Other Reference')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Other Reference/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Other Reference`).should('exist')
          })

        cy.findByText('Data Source')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/^Data Source/i)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

            cy.findByLabelText(`Add Data Source`).should('exist')
          })

        cy.findByText('Origin of Historical Sources').should('exist')
        cy.findByLabelText('Origin of Historical Sources')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

        cy.findByText('Characteristic of Sources').should('exist')
        cy.findByLabelText('Characteristic of Sources')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)

        cy.findByText('Documentation and Access to Sources').should('exist')
        cy.findByLabelText('Documentation and Access to Sources')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Textbox)
      })
    })

    it('renders the correct form fields from Geospatial Metadata Block', () => {
      // 2nd Accordion with Geospatial Metadata
      cy.get('.accordion > :nth-child(2)').within(() => {
        // Open accordion and wait for it to open
        cy.get('.accordion-button').click()
        cy.wait(300)

        // Geographic Unit primitive text
        cy.findByText('Geographic Unit').should('exist')
        cy.findByLabelText('Geographic Unit')
          .should('exist')
          .should('have.attr', 'aria-required', 'false')
          .should('have.value', 'km')
          .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

        // Composed field
        cy.findByText('Geographic Coverage')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText(/Country \/ Nation/)
              .should('exist')
              .should('have.attr', 'aria-required', 'true')
              .should('have.value', 'United States')
              .should('have.prop', 'tagName', 'SELECT')
              .children('option')
              .should('have.length', 250)

            cy.findByLabelText(/State \/ Province/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('City')
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', 'Cambridge')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Other')
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Geographic Coverage`).should('not.exist')
          })

        cy.findByText('Geographic Bounding Box')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByLabelText('Westernmost (Left) Longitude', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Easternmost (Right) Longitude', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Northernmost (Top) Latitude', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText('Southernmost (Bottom) Latitude', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
              .should('have.value', '')
              .should('have.data', 'fieldtype', TypeMetadataFieldOptions.Text)

            cy.findByLabelText(`Add Geographic Bounding Box`).should('exist')
            cy.findByLabelText(`Delete Geographic Bounding Box`).should('not.exist')
          })
      })
    })

    it('renders Save Changes and Cancel buttons twice, on top and bottom', () => {
      cy.findAllByRole('button', { name: 'Save Changes' }).should('exist').should('have.length', 2)

      cy.findAllByRole('button', { name: 'Cancel' }).should('exist').should('have.length', 2)
    })
  })

  describe('should display required errors when submitting the form with required fields empty', () => {
    it('on create mode', () => {
      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      // Fill one non required field to undisable the Save button, is disabled if fields are not dirty
      cy.findByLabelText(/^Notes/i).type('Some note')

      cy.findByText(/Save Dataset/i).click()

      cy.findByText('Title is required').should('exist')
      cy.findByLabelText(/^Title/i).should('have.focus')

      cy.findByText('Author Name is required').should('exist')
      cy.findByText('Point of Contact E-mail is required').should('exist')
      cy.findByText('Description Text is required').should('exist')
      cy.findByText('Subject is required').should('exist')
      cy.findByText('Geographic Coverage Country / Nation is required').should('exist')
    })

    it('on edit mode', () => {
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
      // Clear title field to undisable the Save button and unfill a required field that is already filled as it is in edit mode
      cy.findByLabelText(/^Title/i).clear()

      cy.findAllByText(/Save Changes/i)
        .first()
        .click()

      cy.findByText('Title is required').should('exist')
      cy.findByLabelText(/^Title/i).should('have.focus')

      cy.findByText('Author Name is required').should('not.exist')
      cy.findByText('Point of Contact E-mail is required').should('not.exist')
      cy.findByText('Description Text is required').should('not.exist')
      cy.findByText('Subject is required').should('not.exist')
      cy.findByText('Geographic Coverage Country / Nation is required').should('not.exist')
    })
  })
  describe('should not display required errors when submitting the form with required fields filled', () => {
    it('on create mode', () => {
      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      fillRequiredFieldsOnCreate()
      cy.findByText(/Save Dataset/i).click()
      cy.findByText('Title is required').should('not.exist')
      cy.findByText('Author Name is required').should('not.exist')
      cy.findByText('Point of Contact E-mail is required').should('not.exist')
      cy.findByText('Description Text is required').should('not.exist')
      cy.findByText('Subject is required').should('not.exist')
      cy.findByText('Geographic Coverage Country / Nation is required').should('not.exist')

      cy.findByText('Error').should('not.exist')
      cy.findByText('Success!').should('exist')
    })

    it('on edit mode', () => {
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
      cy.findByLabelText(/^Title/i)
        .clear()
        .type('New Title')
      cy.findAllByText(/Save Changes/i)
        .first()
        .click()

      cy.findByText('Title is required').should('not.exist')
      cy.findByText('Author Name is required').should('not.exist')
      cy.findByText('Point of Contact E-mail is required').should('not.exist')
      cy.findByText('Description Text is required').should('not.exist')
      cy.findByText('Subject is required').should('not.exist')
      cy.findByText('Geographic Coverage Country / Nation is required').should('not.exist')

      cy.findByText('Error').should('not.exist')
      cy.findByText('Success!').should('exist')
    })
  })

  it('should show correct errors when filling inputs with invalid formats', () => {
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetWithAstroBlock)
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(metadataBlocksInfoOnCreateModeWithAstroBlock)

    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText('Keyword')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Term URI', { exact: true }).type('html://test.com')

          cy.findByText('Keyword Term URI is not a valid URL').should('exist')
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
          cy.findByText('Point of Contact E-mail is not a valid email').should('exist')
        })
    })

    // 3rd should be the Astronomy and Astrophysics Metadata block
    cy.get('.accordion > :nth-child(3)').within(() => {
      // Open accordion and wait for it to open
      cy.get('.accordion-button').click()
      cy.wait(300)

      cy.findByText('Object Density').should('exist')
      cy.findByLabelText(/Object Density/)
        .should('exist')
        .type('30L')
      cy.findByText('Object Density is not a valid float').should('exist')

      cy.findByText('Object Count').should('exist')
      cy.findByLabelText(/Object Count/)
        .should('exist')
        .type('30.5')
      cy.findByText('Object Count is not a valid integer').should('exist')
    })
  })

  it('should not show errors when filling inputs with valid formats', () => {
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetWithAstroBlock)
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(metadataBlocksInfoOnCreateModeWithAstroBlock)

    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText('Keyword')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Term URI', { exact: true }).type('http://test.com')

          cy.findByText('Keyword Term URI is not a valid URL').should('not.exist')
        })

      cy.findByText('Description')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/Date/).type('1990-01-23')
          cy.findByText(/^Description Date is not a valid date./).should('not.exist')
        })

      cy.findByText('Point of Contact')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/^E-mail/i).type('email@valid.com')
          cy.findByText('Point of Contact E-mail is not a valid email').should('not.exist')
        })
    })

    // 3rd should be the Astronomy and Astrophysics Metadata block
    cy.get('.accordion > :nth-child(3)').within(() => {
      // Open accordion and wait for it to open
      cy.get('.accordion-button').click()
      cy.wait(300)

      cy.findByText('Object Density').should('exist')
      cy.findByLabelText(/Object Density/)
        .should('exist')
        .type('30.5')
      cy.findByText('Object Density is not a valid float').should('not.exist')

      cy.findByText('Object Count').should('exist')
      cy.findByLabelText(/Object Count/)
        .should('exist')
        .type('30')
      cy.findByText('Object Count is not a valid integer').should('not.exist')

      cy.findByText('Some Date').should('exist')
      cy.findByLabelText(/Some Date/)
        .should('exist')
        .type('1990-01-23')
      cy.findByText('Some Date is not a valid date').should('not.exist')
    })
  })

  it('pre-fills the form with user data', () => {
    cy.mountAuthenticated(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )
    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).should('have.value', testUser.displayName)
      })
    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)
      })
    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).should('have.value', testUser.displayName)
      })
    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Affiliation/i).should('have.value', testUser.affiliation)
      })
    cy.findByLabelText(/^E-mail/i).should('have.value', testUser.email)
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

  it('cancel button is clickable', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText(/Cancel/i).click()
  })

  it('open closed accordion that has fields with errors on it and scrolls to the focused field', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    // Fill one non required field to undisable the Save button, is disabled if fields are not dirty
    cy.findByLabelText('Notes').type('Some note')

    // We are closing the accordion as it is open by default
    cy.get(':nth-child(1) > .accordion-header > .accordion-button').click()

    cy.wait(300)

    cy.findByText('Save Dataset').click()

    cy.findByText('Title is required').should('exist')
    cy.findByLabelText(/^Title/i)
      .should('have.focus')
      .should('be.visible')
  })

  describe('When dataset creation fails', () => {
    it('should show create error message from the client-javascript client when the dataset creation fails', () => {
      datasetRepository.create = cy
        .stub()
        .rejects(new Error('Error from the api javascript client'))
      metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
        .stub()
        .resolves(wrongCollectionMetadataBlocksInfo)

      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      // Fill one non required field to undisable the Save button, is disabled if fields are not dirty
      cy.findByLabelText('Title').type('Some note')

      cy.findByText(/Save Dataset/i).click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(/Error from the api javascript client/).should('exist')
    })

    it('should only show field error part of the error message from the api when the dataset creation fails', () => {
      datasetRepository.create = cy
        .stub()
        .rejects(
          new Error(
            'Validation Failed: Point of Contact E-mail test@test.c is not a valid email address. (Invalid value:edu.harvard.iq.dataverse.DatasetFieldValueValue[ id=null ]).java.util.stream.ReferencePipeline$3@561b5200'
          )
        )

      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )
      // Fields are being send correctly, we are just forcing a create error to check if the error message is being displayed correctly
      fillRequiredFieldsOnCreate()

      cy.findByText(/Save Dataset/i).click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(/Point of Contact E-mail test@test.c is not a valid email address./).should(
        'exist'
      )
    })

    it('should show locale error message when the dataset creation fails with an unknown error message', () => {
      datasetRepository.create = cy.stub().rejects('Some not expected error')

      cy.customMount(
        <DatasetMetadataForm
          mode="create"
          collectionId="root"
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      )

      fillRequiredFieldsOnCreate()

      cy.findByText(/Save Dataset/i).click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(
        /Required fields were missed or there was a validation error. Please scroll down to see details./
      ).should('exist')
    })
  })

  describe('When dataset metadata update fails', () => {
    it('should show edit error message from the client-javascript client when the dataset edition fails', () => {
      datasetRepository.updateMetadata = cy
        .stub()
        .rejects(new Error('Error from the api javascript client'))
      metadataBlockInfoRepository.getByColecctionId = cy
        .stub()
        .resolves(wrongCollectionMetadataBlocksInfo)

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

      // Fill one non required field to undisable the Save button, is disabled if fields are not dirty
      cy.findByLabelText('Title').type('Some note')

      cy.findAllByText(/Save Changes/i)
        .first()
        .click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(/Error from the api javascript client/).should('exist')
    })

    it('should only show field error part of the error message from the api when the dataset edition fails', () => {
      datasetRepository.updateMetadata = cy
        .stub()
        .rejects(
          new Error(
            'Validation Failed: Point of Contact E-mail test@test.c is not a valid email address. (Invalid value:edu.harvard.iq.dataverse.DatasetFieldValueValue[ id=null ]).java.util.stream.ReferencePipeline$3@561b5200'
          )
        )

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

      cy.findByLabelText(/^Title/i)
        .clear()
        .type('New Title')

      cy.findAllByText(/Save Changes/i)
        .first()
        .click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(/Point of Contact E-mail test@test.c is not a valid email address./).should(
        'exist'
      )
    })

    it('should show locale error message when the dataset edition fails with an unknown error message', () => {
      datasetRepository.updateMetadata = cy.stub().rejects('Some not expected error')

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

      cy.findByLabelText(/^Title/i)
        .clear()
        .type('New Title')

      cy.findAllByText(/Save Changes/i)
        .first()
        .click()

      cy.findByText('Validation Error').should('exist')
      cy.findByText(
        /Required fields were missed or there was a validation error. Please scroll down to see details./
      ).should('exist')
    })
  })

  it('adds a new field and removes a field to a composed  multiple field', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test foo name')

        cy.findByLabelText(`Add Author`).click()

        cy.findAllByLabelText(/^Name/i).should('have.length', 2)

        cy.findByLabelText(`Delete Author`).should('exist')

        cy.findByLabelText(`Delete Author`).click()

        cy.findByLabelText(`Delete Author`).should('not.exist')

        cy.findAllByLabelText(/^Name/i).should('have.length', 1)
      })
  })

  it('adds a new field and removes a field to a primitive multiple field', () => {
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

    cy.findByLabelText(/^Alternative Title/i).type('Alternative Title 1')

    cy.findByLabelText(`Add Alternative Title`).click()

    cy.findByLabelText(`Delete Alternative Title`).should('exist')

    cy.findByLabelText(`Delete Alternative Title`).click()

    cy.findByLabelText(`Delete Alternative Title`).should('not.exist')
  })

  it('should not submit the form when pressing enter key if submit button is not focused', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    // We simulate using focusing on an input and pressing enter key
    cy.findByLabelText(/^Title/i)
      .focus()
      .type('{enter}')

    // Validation error shouldn't be shown as form wasn't submitted
    cy.findByText('Title is required').should('not.exist')
  })
  it('should submit the form when pressing enter key if submit button is indeed focused', () => {
    cy.customMount(
      <DatasetMetadataForm
        mode="create"
        collectionId="root"
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    // Type something so submit button is not disabled
    cy.findByLabelText(/^Title/i).type('Some title')

    cy.findByText(/Save Dataset/i)
      .focus()
      .type('{enter}')

    // Validation error shouldn be shown as form was submitted
    cy.findByText('Author Name is required').should('exist')
  })

  describe('should make field required if some of the siblings are filled and viceversa and show helper message', () => {
    it('for a composed field multiple', () => {
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

      cy.findByText('Producer')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByText(
            'One or more of these fields may become required if you add to one or more of these optional fields.'
          ).should('exist')

          cy.findByLabelText('Name', { exact: true })
            .should('exist')
            .should('have.attr', 'aria-required', 'false')

          cy.findByLabelText('Affiliation', { exact: true })
            .should('exist')
            .type('something to trigger sibling Name field to become required')

          cy.findByLabelText(/^Name/).should('exist').should('have.attr', 'aria-required', 'true')

          cy.findByLabelText('Affiliation', { exact: true }).clear()

          cy.findByLabelText(/^Name/).should('exist').should('have.attr', 'aria-required', 'false')
        })
    })
    it('for a composed field NOT multiple', () => {
      metadataBlockInfoRepository.getByColecctionId = cy
        .stub()
        .resolves(metadataBlocksInfoOnCreateModeWithComposedNotMultipleField)

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

      cy.get('.accordion > :nth-child(3)').within(() => {
        // Open accordion and wait for it to open
        cy.get('.accordion-button').click()
        cy.wait(300)
        cy.findByText('Producer')
          .should('exist')
          .closest('.row')
          .within(() => {
            cy.findByText(
              'One or more of these fields may become required if you add to one or more of these optional fields.'
            ).should('exist')

            cy.findByLabelText('Name', { exact: true })
              .should('exist')
              .should('have.attr', 'aria-required', 'false')

            cy.findByLabelText('Affiliation', { exact: true })
              .should('exist')
              .type('something to trigger sibling Name field to become required')

            cy.findByLabelText(/^Name/).should('exist').should('have.attr', 'aria-required', 'true')

            cy.findByLabelText('Affiliation', { exact: true }).clear()

            cy.findByLabelText(/^Name/)
              .should('exist')
              .should('have.attr', 'aria-required', 'false')
          })
      })
    })
  })
})

import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
import { DatasetMetadata } from '../../../../../src/sections/dataset/dataset-metadata/DatasetMetadata'
import {
  ANONYMIZED_FIELD_VALUE,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'
import { AnonymizedContext } from '../../../../../src/sections/dataset/anonymized/AnonymizedContext'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const mockDataset = DatasetMother.create({
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        title: 'Some Title',
        subject: ['subject-one', 'subject-two'],
        author: [
          {
            authorName: 'Foo',
            authorAffiliation: 'Bar'
          },
          {
            authorName: 'Another Foo',
            authorAffiliation: 'Another Bar'
          }
        ],
        datasetContact: [
          {
            datasetContactName: 'John Doe',
            datasetContactEmail: 'john@doe.com',
            datasetContactAffiliation: 'Doe Inc.'
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: 'Description of the dataset'
          }
        ],
        producer: [
          {
            producerName: 'Foo',
            producerAffiliation: 'XYZ',
            producerURL: 'http://foo.com',
            producerLogoURL:
              'https://beta.dataverse.org/resources/images/dataverse_project_logo.svg'
          }
        ]
      }
    },
    {
      name: MetadataBlockName.GEOSPATIAL,
      fields: {
        geographicCoverage: [
          {
            country: 'Country Name',
            city: 'City Name'
          }
        ]
      }
    }
  ]
})
const mockMetadataBlocks = mockDataset.metadataBlocks
const mockCitationMetadataBlockInfo = MetadataBlockInfoMother.create({
  name: MetadataBlockName.CITATION,
  displayName: 'Citation Metadata',
  fields: {
    title: {
      displayFormat: '',
      type: 'TEXT',
      title: 'Title',
      description: 'The main title of the Dataset'
    },
    subject: {
      displayFormat: ';',
      type: 'TEXT',
      title: 'Subject',
      description: 'The area of study relevant to the Dataset'
    },
    author: {
      displayFormat: '',
      type: 'NONE',
      title: 'Author',
      description: 'The entity, e.g. a person or organization, that created the Dataset'
    },
    authorName: {
      displayFormat: '#VALUE',
      type: 'TEXT',
      title: 'Name',
      description:
        "The name of the author, such as the person's name or the name of an organization"
    },
    authorAffiliation: {
      displayFormat: '(#VALUE)',
      type: 'TEXT',
      title: 'Affiliation',
      description: "The name of the entity affiliated with the author, e.g. an organization's name"
    },
    datasetContact: {
      displayFormat: '',
      type: 'NONE',
      title: 'Point of Contact',
      description:
        'The entity, e.g. a person or organization, that users of the Dataset can contact with questions'
    },
    datasetContactName: {
      displayFormat: '#VALUE',
      type: 'TEXT',
      title: 'Name',
      description:
        "The name of the point of contact, e.g. the person's name or the name of an organization"
    },
    datasetContactAffiliation: {
      displayFormat: '(#VALUE)',
      type: 'TEXT',
      title: 'Affiliation',
      description:
        "The name of the entity affiliated with the point of contact, e.g. an organization's name"
    },
    dsDescription: {
      displayFormat: '',
      type: 'NONE',
      title: 'Description',
      description: 'A summary describing the purpose, nature, and scope of the Dataset'
    },
    producer: {
      displayFormat: '',
      type: 'NONE',
      title: 'Producer',
      description:
        'The entity, such a person or organization, managing the finances or other administrative processes involved in the creation of the Dataset'
    },
    producerAffiliation: {
      displayFormat: '(#VALUE)',
      type: 'TEXT',
      title: 'Affiliation',
      description:
        "The name of the entity affiliated with the producer, e.g. an organization's name"
    },
    producerLogoURL: {
      displayFormat: '![#NAME](#VALUE)',
      type: 'URL',
      title: 'Logo URL',
      description: "The URL of the producer's logo"
    },
    producerName: {
      displayFormat: '#VALUE',
      type: 'TEXT',
      title: 'Name',
      description: "The name of the entity, e.g. the person's name or the name of an organization"
    },
    producerURL: {
      displayFormat: '[#VALUE](#VALUE)',
      type: 'URL',
      title: 'URL',
      description: "The URL of the producer's website"
    }
  }
})

const mockGeospatialMetadataBlockInfo = MetadataBlockInfoMother.create({
  name: MetadataBlockName.GEOSPATIAL,
  displayName: 'Geospatial Metadata',
  fields: {
    geographicCoverage: {
      displayFormat: '',
      type: 'TEXT',
      title: 'Geographic Coverage',
      description: 'Geographic coverage of the dataset'
    },
    country: {
      displayFormat: '#VALUE,',
      type: 'TEXT',
      title: 'Country',
      description: 'Country of the geographic coverage'
    },
    city: {
      displayFormat: '#VALUE,',
      type: 'TEXT',
      title: 'City',
      description: 'City of the geographic coverage'
    }
  }
})

const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

describe('DatasetMetadata', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    metadataBlockInfoRepository.getByName = cy.stub().callsFake((name: string) => {
      if (name === MetadataBlockName.CITATION) {
        return Promise.resolve(mockCitationMetadataBlockInfo)
      }
      if (name === MetadataBlockName.GEOSPATIAL) {
        return Promise.resolve(mockGeospatialMetadataBlockInfo)
      }
      return Promise.resolve(undefined)
    })
  })

  it('renders the metadata blocks sections titles correctly', () => {
    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockMetadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByRole('button', { name: 'Citation Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Geospatial Metadata' }).should('exist')
  })

  it('renders the metadata blocks fields correctly', () => {
    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockMetadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText(/Citation Metadata/i).should('exist')

      cy.findByText('Persistent Identifier').should('exist')
      cy.findByText('Title').should('exist')
      cy.findByText('Subject').should('exist')
      cy.findByText('Author').should('exist')
      cy.findByText('Point of Contact').should('exist')
      cy.findByText('Description').should('exist')
      cy.findByText('Producer').should('exist')
    })

    cy.get('.accordion > :nth-child(2)').within(() => {
      // Open accordion and wait for it to open
      cy.get('.accordion-button').click()
      cy.wait(300)
      cy.findByText(/Geospatial Metadata/i).should('exist')
      cy.findByText('Geographic Coverage').should('exist')
    })
  })

  it('renders the metadata blocks fields values correctly', () => {
    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockMetadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.get('.accordion > :nth-child(1)').within(() => {
      cy.findByText(/Citation Metadata/i).should('exist')

      cy.findByText('Persistent Identifier')
        .parent()
        .siblings('div')
        .should('contain', mockDataset.persistentId)

      cy.findByText('Title').parent().siblings('div').should('contain', 'Some Title')

      cy.findByText('Subject')
        .parent()
        .siblings('div')
        .should('contain', 'subject-one; subject-two')

      cy.findByText('Author').parent().siblings('div').should('contain', 'Foo (Bar)')
      cy.findByText('Author')
        .parent()
        .siblings('div')
        .should('contain', 'Another Foo (Another Bar)')

      cy.findByText('Point of Contact')
        .parent()
        .siblings('div')
        .should('contain', 'John Doe  (Doe Inc.)')

      cy.findByText('Description')
        .parent()
        .siblings('div')
        .should('contain', 'Description of the dataset')

      cy.findByText('Producer')
        .parent()
        .siblings('div')
        .within(() => {
          cy.findByText('Foo (XYZ)').should('exist')
          cy.findByRole('link', { name: 'http://foo.com' }).should('exist')
          cy.findByRole('img', { name: 'Logo URL' })
            .should('exist')
            .should(
              'have.attr',
              'src',
              'https://beta.dataverse.org/resources/images/dataverse_project_logo.svg'
            )
        })
    })

    cy.get('.accordion > :nth-child(2)').within(() => {
      // Open accordion and wait for it to open
      cy.get('.accordion-button').click()
      cy.wait(300)
      cy.findByText(/Geospatial Metadata/i).should('exist')
      cy.findByText('Geographic Coverage')
        .parent()
        .siblings('div')
        .should('contain', 'Country Name, City Name')
    })
  })

  it('renders the metadata blocks in anonymized view', () => {
    const setAnonymizedView = () => {}
    const mockDataset = DatasetMother.createAnonymized()
    const mockAnonymizedMetadataBlocks = mockDataset.metadataBlocks

    const metadataBlockInfoMock = MetadataBlockInfoMother.create()
    const metadataBlockInfoRepository: MetadataBlockInfoRepository =
      {} as MetadataBlockInfoRepository
    metadataBlockInfoRepository.getByName = cy.stub().resolves(metadataBlockInfoMock)

    cy.customMount(
      <AnonymizedContext.Provider value={{ anonymizedView: true, setAnonymizedView }}>
        <DatasetMetadata
          persistentId={mockDataset.persistentId}
          metadataBlocks={mockAnonymizedMetadataBlocks}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      </AnonymizedContext.Provider>
    )

    cy.findAllByText(ANONYMIZED_FIELD_VALUE).should('exist')
  })

  it('shows a tip for dataset contact field', () => {
    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockMetadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByText('Use email button above to contact.').should('exist')
  })

  it('renders an empty span if there is an error getting the metadata block display info', () => {
    metadataBlockInfoRepository.getByName = cy
      .stub()
      .rejects(new Error('Error getting metadata block display info'))

    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockMetadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findAllByTestId('ds-metadata-block-display-format-error').should('exist')
    cy.contains('Error getting metadata block display info').should('not.exist')
  })

  it('does not render a metadata block if fields property is empty', () => {
    const mockDataset = DatasetMother.create({
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: 'Some Title',
            subject: ['subject-one', 'subject-two'],
            author: [
              {
                authorName: 'Foo',
                authorAffiliation: 'Bar'
              },
              {
                authorName: 'Another Foo',
                authorAffiliation: 'Another Bar'
              }
            ],
            datasetContact: [
              {
                datasetContactName: 'John Doe',
                datasetContactEmail: 'john@doe.com',
                datasetContactAffiliation: 'Doe Inc.'
              }
            ],
            dsDescription: [
              {
                dsDescriptionValue: 'Description of the dataset'
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {}
        }
      ]
    })
    cy.customMount(
      <DatasetMetadata
        persistentId={mockDataset.persistentId}
        metadataBlocks={mockDataset.metadataBlocks}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />
    )

    cy.findByRole('button', { name: 'Citation Metadata' }).should('exist')
    cy.findByRole('button', { name: 'Geospatial Metadata' }).should('not.exist')
  })
})

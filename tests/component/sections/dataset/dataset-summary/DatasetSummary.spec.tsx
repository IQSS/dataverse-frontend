import { DatasetSummary } from '../../../../../src/sections/dataset/dataset-summary/DatasetSummary'
import {
  DatasetMetadataBlock,
  DatasetLicense,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'
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
  ],
  summaryFields: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        dsDescription: 'Description of the dataset',
        subject: ['subject-one', 'subject-two']
      }
    }
  ]
})

describe('DatasetSummary', () => {
  const licenseMock: DatasetLicense | undefined = mockDataset.license
  const summaryFieldsMock: DatasetMetadataBlock[] = mockDataset.summaryFields
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
        description:
          "The name of the entity affiliated with the author, e.g. an organization's name"
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

  it('renders the DatasetSummary fields', () => {
    metadataBlockInfoRepository.getByName = cy.stub().callsFake((name: string) => {
      if (name === MetadataBlockName.CITATION) {
        return Promise.resolve(mockCitationMetadataBlockInfo)
      }
      if (name === MetadataBlockName.GEOSPATIAL) {
        return Promise.resolve(mockGeospatialMetadataBlockInfo)
      }
      return Promise.resolve(undefined)
    })

    cy.mount(
      <DatasetSummary
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        summaryFields={summaryFieldsMock}
        license={licenseMock}
        onCustomTermsClick={() => {}}
      />
    )

    cy.get('img').should('exist')
    licenseMock && cy.findByText(licenseMock.name).should('exist')
  })

  it('renders an empty span if there is an error getting the metadata block display info', () => {
    metadataBlockInfoRepository.getByName = cy
      .stub()
      .rejects(new Error('Error getting metadata block display info'))

    cy.customMount(
      <DatasetSummary
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        summaryFields={summaryFieldsMock}
        license={licenseMock}
        onCustomTermsClick={() => {}}
      />
    )

    cy.findAllByTestId('summary-block-display-format-error').should('exist')
  })
})

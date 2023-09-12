import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { JSDatasetMapper } from '../../../../../src/dataset/infrastructure/mappers/JSDatasetMapper'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import {
  CitationMetadataBlock,
  DatasetMetadataBlock
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import { DatasetStatus, DatasetVersion } from '../../../../../src/dataset/domain/models/Dataset'

chai.use(chaiAsPromised)
const expect = chai.expect

const jsDataset = {
  id: 505,
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  versionId: 101,
  versionInfo: {
    state: DatasetVersionState.DRAFT,
    majorNumber: 0,
    minorNumber: 0,
    createTime: new Date('2023-09-07T13:40:04.000Z'),
    lastUpdateTime: new Date('2023-09-07T13:40:04.000Z'),
    releaseTime: undefined
  },
  metadataBlocks: [
    {
      name: 'citation',
      fields: {
        title: "Darwin's Finches",
        author: [{ authorName: 'Finch, Fiona', authorAffiliation: 'Birds Inc.' }],
        datasetContact: [
          { datasetContactName: 'Finch, Fiona', datasetContactEmail: 'finch@mailinator.com' }
        ],
        dsDescription: [
          {
            dsDescriptionValue:
              "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
          }
        ],
        subject: ['Medicine, Health and Life Sciences']
      }
    } as CitationMetadataBlock
  ] as [CitationMetadataBlock, ...DatasetMetadataBlock[]],
  license: {
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  }
}
const citation =
  'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
const datasetSummaryFields = ['dsDescription', 'subject', 'keyword', 'publication', 'notesText']
const expectedDataset = {
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  version: new DatasetVersion(0, 0, DatasetStatus.DRAFT),
  citation:
    'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION',
  labels: [
    { semanticMeaning: 'dataset', value: 'Draft' },
    { semanticMeaning: 'warning', value: 'Unpublished' }
  ],
  summaryFields: [
    {
      name: 'citation',
      fields: {
        dsDescription: [
          {
            dsDescriptionValue:
              "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
          }
        ],
        subject: ['Medicine, Health and Life Sciences']
      }
    }
  ],
  license: {
    name: 'CC0 1.0',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
  },
  metadataBlocks: [
    {
      name: 'citation',
      fields: {
        title: "Darwin's Finches",
        author: [{ authorName: 'Finch, Fiona', authorAffiliation: 'Birds Inc.' }],
        datasetContact: [
          { datasetContactName: 'Finch, Fiona', datasetContactEmail: 'finch@mailinator.com' }
        ],
        dsDescription: [
          {
            dsDescriptionValue:
              "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
          }
        ],
        subject: ['Medicine, Health and Life Sciences']
      }
    }
  ]
}

describe('JS Dataset Mapper', () => {
  it('maps jsDataset model to the domain Dataset model', () => {
    expect(expectedDataset).to.deep.equal(
      JSDatasetMapper.toDataset(jsDataset, citation, datasetSummaryFields)
    )
  })

  it('maps jsDataset model to the domain Dataset model when alternativePersistentId is provided', () => {
    const jsDatasetWithAlternativePersistentId = {
      ...jsDataset,
      alternativePersistentId: 'doi:10.5072/FK2/B4B2MY'
    }
    const expectedDatasetWithAlternativePersistentId = {
      ...expectedDataset,
      metadataBlocks: [
        {
          name: 'citation',
          fields: {
            title: "Darwin's Finches",
            author: [{ authorName: 'Finch, Fiona', authorAffiliation: 'Birds Inc.' }],
            datasetContact: [
              { datasetContactName: 'Finch, Fiona', datasetContactEmail: 'finch@mailinator.com' }
            ],
            dsDescription: [
              {
                dsDescriptionValue:
                  "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
              }
            ],
            subject: ['Medicine, Health and Life Sciences'],
            alternativePersistentId: 'doi:10.5072/FK2/B4B2MY'
          }
        }
      ]
    }

    expect(expectedDatasetWithAlternativePersistentId).to.deep.equal(
      JSDatasetMapper.toDataset(
        jsDatasetWithAlternativePersistentId,
        citation,
        datasetSummaryFields
      )
    )
  })

  it('maps jsDataset model to the domain Dataset model when citationDate is provided', () => {
    const jsDatasetWithCitationDate = {
      ...jsDataset,
      citationDate: '2023-02-12'
    }
    const expectedDatasetWithCitationDate = {
      ...expectedDataset,
      metadataBlocks: [
        {
          name: 'citation',
          fields: {
            title: "Darwin's Finches",
            author: [{ authorName: 'Finch, Fiona', authorAffiliation: 'Birds Inc.' }],
            datasetContact: [
              { datasetContactName: 'Finch, Fiona', datasetContactEmail: 'finch@mailinator.com' }
            ],
            dsDescription: [
              {
                dsDescriptionValue:
                  "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
              }
            ],
            subject: ['Medicine, Health and Life Sciences'],
            citationDate: '2023-02-12'
          }
        }
      ]
    }

    expect(expectedDatasetWithCitationDate).to.deep.equal(
      JSDatasetMapper.toDataset(jsDatasetWithCitationDate, citation, datasetSummaryFields)
    )
  })

  it('maps jsDataset model to the domain Dataset model when publicationDate is provided', () => {
    const jsDatasetWithPublicationDate = {
      ...jsDataset,
      publicationDate: '2023-02-12'
    }
    const expectedDatasetWithPublicationDate = {
      ...expectedDataset,
      metadataBlocks: [
        {
          name: 'citation',
          fields: {
            title: "Darwin's Finches",
            author: [{ authorName: 'Finch, Fiona', authorAffiliation: 'Birds Inc.' }],
            datasetContact: [
              { datasetContactName: 'Finch, Fiona', datasetContactEmail: 'finch@mailinator.com' }
            ],
            dsDescription: [
              {
                dsDescriptionValue:
                  "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
              }
            ],
            subject: ['Medicine, Health and Life Sciences'],
            publicationDate: '2023-02-12'
          }
        }
      ]
    }
    expect(expectedDatasetWithPublicationDate).to.deep.equal(
      JSDatasetMapper.toDataset(jsDatasetWithPublicationDate, citation, datasetSummaryFields)
    )
  })
})

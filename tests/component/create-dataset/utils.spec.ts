import { DatasetDTO } from '../../../src/dataset/domain/useCases/DTOs/DatasetDTO'
import { MetadataBlockInfo } from '../../../src/metadata-block-info/domain/models/MetadataBlockInfo'
import { FormCollectedValues } from '../../../src/sections/create-dataset/useCreateDatasetForm'
import {
  formatFormValuesToCreateDatasetDTO,
  replaceDotNamesKeysWithSlash,
  replaceSlashKeysWithDot
} from '../../../src/sections/create-dataset/utils'

const sampleObjectWithSlashKeys: FormCollectedValues = {
  blockOne: {
    'key/one': 'value1',
    'key/two': {
      'key/childOne': 'value3',
      'key/childTwo': 'value4'
    },
    key5: {
      key6: 'value6'
    }
  },
  blockTwo: {
    'key/three': 'value7',
    'key/four': 'value8'
  }
}

const replacedSampleObjectWithSlashKeys: FormCollectedValues = {
  blockOne: {
    'key.one': 'value1',
    'key.two': {
      'key.childOne': 'value3',
      'key.childTwo': 'value4'
    },
    key5: {
      key6: 'value6'
    }
  },
  blockTwo: {
    'key.three': 'value7',
    'key.four': 'value8'
  }
}

const sampleArrayOfMetadataBlocksInfo: MetadataBlockInfo[] = [
  {
    id: 1,
    name: 'citation',
    displayName: 'Citation Metadata',
    displayOnCreate: true,
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'Title',
        title: 'Title',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'The main title of the Dataset',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0
      }
    }
  },
  {
    id: 4,
    name: 'astrophysics',
    displayName: 'Astronomy and Astrophysics Metadata',
    displayOnCreate: true,
    metadataFields: {
      'coverage.Temporal': {
        name: 'coverage.Temporal',
        displayName: 'Dataset Date Range',
        title: 'Dataset Date Range',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: ' Time period covered by the data.',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        childMetadataFields: {
          'coverage.Temporal.StartTime': {
            name: 'coverage.Temporal.StartTime',
            displayName: 'Dataset Date Range Start',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'Dataset Start Date',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13
          },
          'coverage.Temporal.StopTime': {
            name: 'coverage.Temporal.StopTime',
            displayName: 'Dataset Date Range End',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'Dataset End Date',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14
          }
        }
      },
      'resolution.Spatial': {
        name: 'resolution.Spatial',
        displayName: 'Spatial Resolution',
        title: 'Spatial Resolution',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description:
          'The spatial (angular) resolution that is typical of the observations, in decimal degrees.',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 4
      }
    }
  }
]

const sampleArrayOfMetadataBlocksInfoWithSlashNames: MetadataBlockInfo[] = [
  {
    id: 1,
    name: 'citation',
    displayName: 'Citation Metadata',
    displayOnCreate: true,
    metadataFields: {
      title: {
        name: 'title',
        displayName: 'Title',
        title: 'Title',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description: 'The main title of the Dataset',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: true,
        displayOnCreate: true,
        displayOrder: 0
      }
    }
  },
  {
    id: 4,
    name: 'astrophysics',
    displayName: 'Astronomy and Astrophysics Metadata',
    displayOnCreate: true,
    metadataFields: {
      'coverage.Temporal': {
        name: 'coverage/Temporal',
        displayName: 'Dataset Date Range',
        title: 'Dataset Date Range',
        type: 'NONE',
        typeClass: 'compound',
        watermark: '',
        description: ' Time period covered by the data.',
        multiple: true,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 12,
        childMetadataFields: {
          'coverage.Temporal.StartTime': {
            name: 'coverage/Temporal/StartTime',
            displayName: 'Dataset Date Range Start',
            title: 'Start',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'Dataset Start Date',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 13
          },
          'coverage.Temporal.StopTime': {
            name: 'coverage/Temporal/StopTime',
            displayName: 'Dataset Date Range End',
            title: 'End',
            type: 'DATE',
            typeClass: 'primitive',
            watermark: 'YYYY-MM-DD',
            description: 'Dataset End Date',
            multiple: false,
            isControlledVocabulary: false,
            displayFormat: '',
            isRequired: false,
            displayOnCreate: true,
            displayOrder: 14
          }
        }
      },
      'resolution.Spatial': {
        name: 'resolution/Spatial',
        displayName: 'Spatial Resolution',
        title: 'Spatial Resolution',
        type: 'TEXT',
        typeClass: 'primitive',
        watermark: '',
        description:
          'The spatial (angular) resolution that is typical of the observations, in decimal degrees.',
        multiple: false,
        isControlledVocabulary: false,
        displayFormat: '',
        isRequired: false,
        displayOnCreate: true,
        displayOrder: 4
      }
    }
  }
]

const formValues: FormCollectedValues = {
  citation: {
    title: 'Dataset Title',
    subtitle: '',
    author: {
      authorName: 'Author Name',
      authorAffiliation: 'Author Affiliation'
    },
    subject: ['Subject 1', 'Subject 2'],
    anEmptyVocabulary: []
  },
  astrophysics: {
    'coverage.Temporal': {
      'coverage.Temporal.StartTime': '2022-01-01',
      'coverage.Temporal.StopTime': '2022-12-31'
    },
    'resolution.Spatial': '100'
  }
}

const expectedDatasetDTO: DatasetDTO = {
  metadataBlocks: [
    {
      name: 'citation',
      fields: {
        title: 'Dataset Title',
        author: [
          {
            authorName: 'Author Name',
            authorAffiliation: 'Author Affiliation'
          }
        ],
        subject: ['Subject 1', 'Subject 2']
      }
    },
    {
      name: 'astrophysics',
      fields: {
        'coverage.Temporal': [
          {
            'coverage.Temporal.StartTime': '2022-01-01',
            'coverage.Temporal.StopTime': '2022-12-31'
          }
        ],
        'resolution.Spatial': '100'
      }
    }
  ]
}

describe('Test create dataset utils', () => {
  it('should replace dot keys with slash', () => {
    const replacedToSlashObject = replaceDotNamesKeysWithSlash(sampleArrayOfMetadataBlocksInfo)

    expect(replacedToSlashObject).to.deep.equal(sampleArrayOfMetadataBlocksInfoWithSlashNames)
  })

  it('should replace slash keys with dot', () => {
    const replacedToKeysObject = replaceSlashKeysWithDot(sampleObjectWithSlashKeys)

    expect(replacedToKeysObject).to.deep.equal(replacedSampleObjectWithSlashKeys)
  })

  it('should format form values to create dataset DTO', () => {
    const datasetDTO = formatFormValuesToCreateDatasetDTO(formValues)

    expect(datasetDTO).to.deep.equal(expectedDatasetDTO)
  })
})

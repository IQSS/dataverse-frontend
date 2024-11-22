import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { JSDatasetMapper } from '../../../../../src/dataset/infrastructure/mappers/JSDatasetMapper'
import {
  DatasetLockType,
  DatasetVersionState,
  DatasetLock as JSDatasetLock,
  DvObjectType as JSDvObjectType
} from '@iqss/dataverse-client-javascript'
import {
  CitationMetadataBlock,
  DatasetMetadataBlock
} from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import { DatasetLockReason } from '../../../../../src/dataset/domain/models/Dataset'
import {
  FileDownloadMode,
  FileDownloadSize,
  FileSizeUnit
} from '../../../../../src/files/domain/models/FileMetadata'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../../../src/shared/hierarchy/domain/models/UpwardHierarchyNode'

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
  },
  thumbnail: undefined,
  isPartOf: {
    type: JSDvObjectType.DATAVERSE,
    identifier: 'root',
    displayName: 'Root',
    isReleased: true
  }
}
const citation =
  'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
const datasetSummaryFields = ['dsDescription', 'subject', 'keyword', 'publication', 'notesText']
const jsDatasetPermissions = {
  canEditDataset: true,
  canPublishDataset: true,
  canManageDatasetPermissions: true,
  canDeleteDatasetDraft: true,
  canViewUnpublishedDataset: true
}
const jsDatasetLocks: JSDatasetLock[] = [
  {
    lockType: DatasetLockType.IN_REVIEW,
    userId: 'dataverseAdmin',
    datasetPersistentId: 'doi:10.5072/FK2/B4B2MJ'
  }
]
const jsDatasetVersionDiff = {
  oldVersion: {
    versionNumber: '1.0',
    lastUpdatedDate: '2023-05-15T08:21:03Z'
  },
  newVersion: {
    versionNumber: '2.0',
    lastUpdatedDate: '2023-06-15T08:21:03Z'
  },
  metadataChanges: [
    {
      blockName: 'citation',
      changed: [
        {
          fieldName: 'title',
          oldValue: 'Old Title',
          newValue: 'New Title'
        }
      ]
    }
  ],
  filesAdded: [
    {
      fileName: 'file2.txt',
      MD5: 'd41d8cd98f00b204e9800998ecf8427e',
      type: 'text/plain',
      fileId: 2,
      filePath: '/path/to/file2.txt',
      description: 'New file',
      isRestricted: false,
      tags: ['tag2'],
      categories: ['category2']
    }
  ],
  filesRemoved: [
    {
      fileName: 'file1.txt',
      MD5: 'd41d8cd98f00b204e9800998ecf8427e',
      type: 'text/plain',
      fileId: 1,
      filePath: '/path/to/file1.txt',
      description: 'Test file',
      isRestricted: false,
      tags: ['tag1'],
      categories: ['category1']
    }
  ],
  fileChanges: [
    {
      fileName: 'file1.txt',
      md5: 'd41d8cd98f00b204e9800998ecf8427e',
      fileId: 1,
      changed: [
        {
          fieldName: 'description',
          oldValue: 'Old description',
          newValue: 'New description'
        }
      ]
    }
  ],
  filesReplaced: [
    {
      oldFile: {
        fileName: 'file1.txt',
        MD5: 'd41d8cd98f00b204e9800998ecf8427e',
        type: 'text/plain',
        fileId: 1,
        filePath: '/path/to/file1.txt',
        description: 'Test file',
        isRestricted: false,
        tags: ['tag1'],
        categories: ['category1']
      },
      newFile: {
        fileName: 'file2.txt',
        MD5: 'd41d8cd98f00b204e9800998ecf8427e',
        type: 'text/plain',
        fileId: 2,
        filePath: '/path/to/file2.txt',
        description: 'New file',
        isRestricted: false,
        tags: ['tag2'],
        categories: ['category2']
      }
    }
  ],
  termsOfAccess: [
    {
      fieldName: 'termsOfAccess',
      oldValue: 'Old terms',
      newValue: 'New terms'
    }
  ]
}
const jsDatasetFilesTotalOriginalDownloadSize = 5
const jsDatasetFilesTotalArchivalDownloadSize = 7
const expectedDataset = {
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  version: {
    id: 101,
    title: "Darwin's Finches",
    labels: [
      { semanticMeaning: 'dataset', value: 'Draft' },
      { semanticMeaning: 'warning', value: 'Unpublished' }
    ],
    publishingStatus: 'draft',
    isLatest: true,
    isInReview: false,
    latestVersionPublishingStatus: 'draft',
    number: {
      minorNumber: 0,
      majorNumber: 0
    },
    someDatasetVersionHasBeenReleased: false,
    citation:
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
  },
  requestedVersion: undefined,
  publicationDate: undefined,
  alerts: [{ variant: 'warning', messageKey: 'draftVersion', dynamicFields: undefined }],
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
  ],
  permissions: {
    canDownloadFiles: true,
    canUpdateDataset: true,
    canPublishDataset: true,
    canManageDatasetPermissions: true,
    canManageFilesPermissions: true,
    canDeleteDataset: true
  },
  locks: [
    {
      userPersistentId: 'dataverseAdmin',
      reason: DatasetLockReason.IN_REVIEW
    }
  ],
  hasValidTermsOfAccess: true,
  hasOneTabularFileAtLeast: true,
  isValid: true,
  thumbnail: undefined,
  privateUrl: undefined,
  fileDownloadSizes: [
    new FileDownloadSize(5, FileSizeUnit.BYTES, FileDownloadMode.ORIGINAL),
    new FileDownloadSize(7, FileSizeUnit.BYTES, FileDownloadMode.ARCHIVAL)
  ],
  downloadUrls: {
    original: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ&format=original`,
    archival: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ`
  },
  hierarchy: new UpwardHierarchyNode(
    "Darwin's Finches",
    DvObjectType.DATASET,
    '505',
    'doi:10.5072/FK2/B4B2MJ',
    '0.0',
    undefined,
    new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined, undefined, true)
  ),
  nextMajorVersion: undefined,
  nextMinorVersion: undefined,
  requiresMajorVersionUpdate: false
}
const expectedDatasetWithPublicationDate = {
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  version: {
    id: 101,
    title: "Darwin's Finches",
    labels: [{ semanticMeaning: 'dataset', value: 'Draft' }],
    publishingStatus: 'draft',
    isLatest: true,
    isInReview: false,
    latestVersionPublishingStatus: 'draft',
    number: {
      minorNumber: 0,
      majorNumber: 0
    },
    someDatasetVersionHasBeenReleased: true,
    citation:
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
  },
  requestedVersion: undefined,
  publicationDate: undefined,
  alerts: [{ variant: 'warning', messageKey: 'draftVersion', dynamicFields: undefined }],
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
        subject: ['Medicine, Health and Life Sciences'],
        publicationDate: '2023-02-12'
      }
    }
  ],
  permissions: {
    canDownloadFiles: true,
    canUpdateDataset: true,
    canPublishDataset: true,
    canManageDatasetPermissions: true,
    canManageFilesPermissions: true,
    canDeleteDataset: true
  },
  locks: [
    {
      userPersistentId: 'dataverseAdmin',
      reason: DatasetLockReason.IN_REVIEW
    }
  ],
  hasValidTermsOfAccess: true,
  hasOneTabularFileAtLeast: true,
  isValid: true,
  thumbnail: undefined,
  privateUrl: undefined,
  fileDownloadSizes: [
    new FileDownloadSize(5, FileSizeUnit.BYTES, FileDownloadMode.ORIGINAL),
    new FileDownloadSize(7, FileSizeUnit.BYTES, FileDownloadMode.ARCHIVAL)
  ],
  downloadUrls: {
    original: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ&format=original`,
    archival: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ`
  },
  hierarchy: new UpwardHierarchyNode(
    "Darwin's Finches",
    DvObjectType.DATASET,
    '505',
    'doi:10.5072/FK2/B4B2MJ',
    '0.0',
    undefined,
    new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined, undefined, true)
  ),
  nextMajorVersion: undefined,
  nextMinorVersion: undefined,
  requiresMajorVersionUpdate: false
}
const expectedDatasetWithNextVersionNumbers = {
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  version: {
    id: 101,
    title: "Darwin's Finches",
    labels: [{ semanticMeaning: 'dataset', value: 'Draft' }],
    publishingStatus: 'draft',
    isLatest: true,
    isInReview: false,
    latestVersionPublishingStatus: 'draft',
    number: {
      minorNumber: 0,
      majorNumber: 0
    },
    someDatasetVersionHasBeenReleased: true,
    citation:
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
  },
  requestedVersion: undefined,
  publicationDate: undefined,
  alerts: [{ variant: 'warning', messageKey: 'draftVersion', dynamicFields: undefined }],
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
        subject: ['Medicine, Health and Life Sciences'],
        publicationDate: '2023-02-12'
      }
    }
  ],
  permissions: {
    canDownloadFiles: true,
    canUpdateDataset: true,
    canPublishDataset: true,
    canManageDatasetPermissions: true,
    canManageFilesPermissions: true,
    canDeleteDataset: true
  },
  locks: [
    {
      userPersistentId: 'dataverseAdmin',
      reason: DatasetLockReason.IN_REVIEW
    }
  ],
  hasValidTermsOfAccess: true,
  hasOneTabularFileAtLeast: true,
  isValid: true,
  thumbnail: undefined,
  privateUrl: undefined,
  fileDownloadSizes: [
    new FileDownloadSize(5, FileSizeUnit.BYTES, FileDownloadMode.ORIGINAL),
    new FileDownloadSize(7, FileSizeUnit.BYTES, FileDownloadMode.ARCHIVAL)
  ],
  downloadUrls: {
    original: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ&format=original`,
    archival: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ`
  },
  hierarchy: new UpwardHierarchyNode(
    "Darwin's Finches",
    DvObjectType.DATASET,
    '505',
    'doi:10.5072/FK2/B4B2MJ',
    '0.0',
    undefined,
    new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined, undefined, true)
  ),
  nextMajorVersion: '2.0',
  nextMinorVersion: '1.3',
  requiresMajorVersionUpdate: false
}

const expectedDatasetAlternateVersion = {
  persistentId: 'doi:10.5072/FK2/B4B2MJ',
  version: {
    id: 101,
    title: "Darwin's Finches",
    labels: [
      { semanticMeaning: 'dataset', value: 'Draft' },
      { semanticMeaning: 'warning', value: 'Unpublished' }
    ],
    publishingStatus: 'draft',
    isLatest: true,
    isInReview: false,
    latestVersionPublishingStatus: 'draft',
    number: {
      minorNumber: 0,
      majorNumber: 0
    },
    someDatasetVersionHasBeenReleased: false,
    citation:
      'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/B4B2MJ" target="_blank">https://doi.org/10.5072/FK2/B4B2MJ</a>, Root, DRAFT VERSION'
  },
  requestedVersion: '4.0',
  publicationDate: undefined,
  hasValidTermsOfAccess: true,
  hasOneTabularFileAtLeast: true,
  isValid: true,
  privateUrl: undefined,
  fileDownloadSizes: [
    new FileDownloadSize(5, FileSizeUnit.BYTES, FileDownloadMode.ORIGINAL),
    new FileDownloadSize(7, FileSizeUnit.BYTES, FileDownloadMode.ARCHIVAL)
  ],
  alerts: [
    {
      variant: 'warning',
      messageKey: 'draftVersion',
      dynamicFields: undefined
    },
    {
      messageKey: 'requestedVersionNotFoundShowDraft',
      variant: 'warning',
      dynamicFields: { requestedVersion: '4.0' }
    }
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
  locks: [
    {
      userPersistentId: 'dataverseAdmin',
      reason: DatasetLockReason.IN_REVIEW
    }
  ],
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
  ],
  permissions: {
    canDeleteDataset: true,
    canDownloadFiles: true,
    canManageDatasetPermissions: true,
    canManageFilesPermissions: true,
    canPublishDataset: true,
    canUpdateDataset: true
  },
  thumbnail: undefined,
  downloadUrls: {
    original: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ&format=original`,
    archival: `/api/access/dataset/:persistentId/versions/0.0?persistentId=doi:10.5072/FK2/B4B2MJ`
  },
  hierarchy: new UpwardHierarchyNode(
    "Darwin's Finches",
    DvObjectType.DATASET,
    '505',
    'doi:10.5072/FK2/B4B2MJ',
    '0.0',
    undefined,
    new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root', undefined, undefined, true)
  ),
  nextMajorVersion: undefined,
  nextMinorVersion: undefined,
  requiresMajorVersionUpdate: false
}
describe('JS Dataset Mapper', () => {
  it('maps jsDataset model to the domain Dataset model', () => {
    const mapped = JSDatasetMapper.toDataset(
      jsDataset,
      citation,
      datasetSummaryFields,
      jsDatasetPermissions,
      jsDatasetLocks,
      jsDatasetFilesTotalOriginalDownloadSize,
      jsDatasetFilesTotalArchivalDownloadSize
    )
    expect(expectedDataset).to.deep.equal(mapped)
  })
  it('maps jsDataset model to the domain Dataset model for alternate version', () => {
    const mappedWithAlternate = JSDatasetMapper.toDataset(
      jsDataset,
      citation,
      datasetSummaryFields,
      jsDatasetPermissions,
      jsDatasetLocks,
      jsDatasetFilesTotalOriginalDownloadSize,
      jsDatasetFilesTotalArchivalDownloadSize,
      '4.0'
    )

    expect(expectedDatasetAlternateVersion).to.deep.equal(mappedWithAlternate)
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
        datasetSummaryFields,
        jsDatasetPermissions,
        jsDatasetLocks,
        jsDatasetFilesTotalOriginalDownloadSize,
        jsDatasetFilesTotalArchivalDownloadSize
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
      JSDatasetMapper.toDataset(
        jsDatasetWithCitationDate,
        citation,
        datasetSummaryFields,
        jsDatasetPermissions,
        jsDatasetLocks,
        jsDatasetFilesTotalOriginalDownloadSize,
        jsDatasetFilesTotalArchivalDownloadSize
      )
    )
  })

  it('maps jsDataset model to the domain Dataset model when publicationDate is provided', () => {
    const jsDatasetWithPublicationDate = {
      ...jsDataset,
      publicationDate: '2023-02-12'
    }

    const actual = JSDatasetMapper.toDataset(
      jsDatasetWithPublicationDate,
      citation,
      datasetSummaryFields,
      jsDatasetPermissions,
      jsDatasetLocks,
      jsDatasetFilesTotalOriginalDownloadSize,
      jsDatasetFilesTotalArchivalDownloadSize
    )

    expect(expectedDatasetWithPublicationDate).to.deep.equal(actual)
  })
  it('maps jsDataset model to the domain Dataset model when latest published version numbers are provided', () => {
    const jsDatasetWithPublicationDate = {
      ...jsDataset,
      publicationDate: '2023-02-12'
    }

    const latestPublishedVersionMajorNumber = 1
    const latestPublishedVersionMinorNumber = 2
    const actual = JSDatasetMapper.toDataset(
      jsDatasetWithPublicationDate,
      citation,
      datasetSummaryFields,
      jsDatasetPermissions,
      jsDatasetLocks,
      jsDatasetFilesTotalOriginalDownloadSize,
      jsDatasetFilesTotalArchivalDownloadSize,
      undefined,
      undefined,
      latestPublishedVersionMajorNumber,
      latestPublishedVersionMinorNumber
    )
    expect(expectedDatasetWithNextVersionNumbers).to.deep.equal(actual)
  })
  it('maps jsDataset model to the domain Dataset model when datasetVersionDiff is provided', () => {
    const latestPublishedVersionMajorNumber = 1
    const latestPublishedVersionMinorNumber = 2
    const jsDatasetWithPublicationDate = {
      ...jsDataset,
      publicationDate: '2023-02-12'
    }
    const actual = JSDatasetMapper.toDataset(
      jsDatasetWithPublicationDate,
      citation,
      datasetSummaryFields,
      jsDatasetPermissions,
      jsDatasetLocks,
      jsDatasetFilesTotalOriginalDownloadSize,
      jsDatasetFilesTotalArchivalDownloadSize,
      undefined,
      undefined,
      latestPublishedVersionMajorNumber,
      latestPublishedVersionMinorNumber,
      jsDatasetVersionDiff
    )
    const expectedDatasetWithRequiredVersionUpdate = {
      ...expectedDatasetWithNextVersionNumbers,
      requiresMajorVersionUpdate: true
    }
    expect(expectedDatasetWithRequiredVersionUpdate).to.deep.equal(actual)
  })
  it('maps jsDatasetVersionDiff model to the domain DatasetVersionDiff model', () => {
    const expectedDatasetVersionDiff = {
      oldVersion: {
        versionNumber: '1.0',
        lastUpdatedDate: '2023-05-15T08:21:03Z'
      },
      newVersion: {
        versionNumber: '2.0',
        lastUpdatedDate: '2023-06-15T08:21:03Z'
      },
      metadataChanges: [
        {
          blockName: 'citation',
          changed: [
            {
              fieldName: 'title',
              oldValue: 'Old Title',
              newValue: 'New Title'
            }
          ]
        }
      ],
      filesAdded: [
        {
          fileName: 'file2.txt',
          MD5: 'd41d8cd98f00b204e9800998ecf8427e',
          type: 'text/plain',
          fileId: 2,
          filePath: '/path/to/file2.txt',
          description: 'New file',
          isRestricted: false,
          tags: ['tag2'],
          categories: ['category2']
        }
      ],
      filesRemoved: [
        {
          fileName: 'file1.txt',
          MD5: 'd41d8cd98f00b204e9800998ecf8427e',
          type: 'text/plain',
          fileId: 1,
          filePath: '/path/to/file1.txt',
          description: 'Test file',
          isRestricted: false,
          tags: ['tag1'],
          categories: ['category1']
        }
      ]
    }

    const actual = JSDatasetMapper.toDatasetVersionDiff(jsDatasetVersionDiff)
    expect(expectedDatasetVersionDiff).to.deep.equal(actual)
  })
})

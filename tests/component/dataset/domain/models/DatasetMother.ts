import { faker } from '@faker-js/faker'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetLabel,
  DatasetDownloadUrls,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetLock,
  DatasetLockReason,
  DatasetMetadataBlocks,
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion,
  DatasetVersionNumber,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'
import {
  FileDownloadMode,
  FileDownloadSize,
  FileSizeUnit
} from '../../../../../src/files/domain/models/FileMetadata'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import {
  COUNTRY_FIELD_VOCAB_VALUES,
  SUBJECT_FIELD_VOCAB_VALUES
} from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

export class DatasetVersionMother {
  static create(props?: Partial<DatasetVersion>): DatasetVersion {
    return new DatasetVersion.Builder(
      props?.id ?? faker.datatype.number(),
      props?.title ?? faker.lorem.sentence(),
      props?.number ?? new DatasetVersionNumber(1, 0),
      props?.publishingStatus ?? DatasetPublishingStatus.RELEASED,
      props?.citation ??
        'Admin, Dataverse, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
      props?.isLatest ?? false,
      props?.isInReview ?? false,
      props?.latestVersionPublishingStatus ?? DatasetPublishingStatus.RELEASED,
      props?.someDatasetVersionHasBeenReleased ?? faker.datatype.boolean()
    )
  }

  static createDeaccessioned(props?: Partial<DatasetVersion>): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.DEACCESSIONED,
      isLatest: false,
      citation:
        'Admin, Dataverse, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1 DEACCESSIONED VERSION',
      someDatasetVersionHasBeenReleased: true,
      ...props
    })
  }

  static createDraft(props?: Partial<DatasetVersion>): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.DRAFT,
      isLatest: false,
      number: new DatasetVersionNumber(undefined, undefined),
      citation:
        'Admin, Dataverse, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DRAFT VERSION',
      ...props
    })
  }

  static createDraftAsLatestVersion(props?: Partial<DatasetVersion>): DatasetVersion {
    return this.createDraft({
      latestVersionPublishingStatus: DatasetPublishingStatus.DRAFT,
      isLatest: true,
      ...props
    })
  }

  static createDraftAsLatestVersionWithSomeVersionHasBeenReleased(): DatasetVersion {
    return this.createDraftAsLatestVersion({
      someDatasetVersionHasBeenReleased: true
    })
  }

  static createDraftAsLatestVersionInReview(): DatasetVersion {
    return this.createDraftAsLatestVersion({
      isInReview: true
    })
  }

  static createDraftWithLatestVersionIsReleased(): DatasetVersion {
    return this.createDraft({
      latestVersionPublishingStatus: DatasetPublishingStatus.RELEASED,
      someDatasetVersionHasBeenReleased: true
    })
  }

  static createNotReleased(): DatasetVersion {
    return this.createDraft({
      someDatasetVersionHasBeenReleased: false,
      latestVersionPublishingStatus: DatasetPublishingStatus.DRAFT
    })
  }

  static createReleased(props?: Partial<DatasetVersion>): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.RELEASED,
      someDatasetVersionHasBeenReleased: true,
      isLatest: false,
      ...props
    })
  }

  static createReleasedWithLatestVersionIsADraft(): DatasetVersion {
    return this.createReleased({
      latestVersionPublishingStatus: DatasetPublishingStatus.DRAFT
    })
  }

  static createRealistic(props?: Partial<DatasetVersion>): DatasetVersion {
    return this.create({
      id: 1,
      title: 'Dataset Title',
      publishingStatus: DatasetPublishingStatus.RELEASED,
      isLatest: true,
      isInReview: false,
      latestVersionPublishingStatus: DatasetPublishingStatus.RELEASED,
      citation:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
      number: new DatasetVersionNumber(1, 0),
      someDatasetVersionHasBeenReleased: true,
      ...props
    })
  }

  static createAnonymized(): DatasetVersion {
    return this.createRealistic({
      citation: `Author name(s) withheld, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1`
    })
  }
}

export class DatasetPermissionsMother {
  static create(props?: Partial<DatasetPermissions>): DatasetPermissions {
    return {
      canDownloadFiles: faker.datatype.boolean(),
      canUpdateDataset: faker.datatype.boolean(),
      canPublishDataset: faker.datatype.boolean(),
      canManageDatasetPermissions: faker.datatype.boolean(),
      canManageFilesPermissions: faker.datatype.boolean(),
      canDeleteDataset: faker.datatype.boolean(),
      ...props
    }
  }

  static createWithFilesDownloadAllowed(): DatasetPermissions {
    return this.create({ canDownloadFiles: true })
  }

  static createWithFilesDownloadNotAllowed(): DatasetPermissions {
    return this.create({ canDownloadFiles: false })
  }

  static createWithUpdateDatasetAllowed(): DatasetPermissions {
    return this.create({ canUpdateDataset: true })
  }

  static createWithUpdateDatasetNotAllowed(): DatasetPermissions {
    return this.create({ canUpdateDataset: false })
  }

  static createWithAllAllowed(): DatasetPermissions {
    return this.create({
      canDownloadFiles: true,
      canUpdateDataset: true,
      canPublishDataset: true,
      canManageDatasetPermissions: true,
      canManageFilesPermissions: true,
      canDeleteDataset: true
    })
  }

  static createWithPublishingDatasetAllowed(): DatasetPermissions {
    return this.create({ canPublishDataset: true })
  }

  static createWithPublishingDatasetNotAllowed(): DatasetPermissions {
    return this.create({ canPublishDataset: false })
  }

  static createWithNoDatasetPermissions(): DatasetPermissions {
    return this.create({
      canDownloadFiles: true,
      canUpdateDataset: false,
      canPublishDataset: false
    })
  }

  static createWithManageDatasetPermissionsAllowed(): DatasetPermissions {
    return this.create({ canManageDatasetPermissions: true })
  }

  static createWithManageFilesPermissionsAllowed(): DatasetPermissions {
    return this.create({ canManageFilesPermissions: true })
  }

  static createWithManagePermissionsNotAllowed(): DatasetPermissions {
    return this.create({ canManageDatasetPermissions: false, canManageFilesPermissions: false })
  }

  static createWithDeleteDatasetAllowed(): DatasetPermissions {
    return this.create({ canDeleteDataset: true })
  }

  static createWithDeleteDatasetNotAllowed(): DatasetPermissions {
    return this.create({ canDeleteDataset: false })
  }

  static createWithNoneAllowed(): DatasetPermissions {
    return this.create({
      canDownloadFiles: false,
      canUpdateDataset: false,
      canPublishDataset: false,
      canManageDatasetPermissions: false,
      canManageFilesPermissions: false,
      canDeleteDataset: false
    })
  }
}

export class DatasetLockMother {
  static create(props?: Partial<DatasetLock>): DatasetLock {
    return {
      userPersistentId: faker.internet.userName(),
      reason: faker.helpers.arrayElement(Object.values(DatasetLockReason)),
      ...props
    }
  }

  static createLockedInWorkflow(): DatasetLock {
    return this.create({ reason: DatasetLockReason.WORKFLOW })
  }

  static createLockedInReview(): DatasetLock {
    return this.create({ reason: DatasetLockReason.IN_REVIEW })
  }

  static createLockedInEditInProgress(): DatasetLock {
    return this.create({ reason: DatasetLockReason.EDIT_IN_PROGRESS })
  }

  static createLockedFromFileDownload(): DatasetLock {
    return this.create({ reason: DatasetLockReason.INGEST })
  }
}

export class DatasetLabelsMother {
  static create(): DatasetLabel[] {
    return [{ value: 'Version 1.0', semanticMeaning: DatasetLabelSemanticMeaning.FILE }]
  }

  static createDraft(): DatasetLabel[] {
    return [
      {
        value: DatasetLabelValue.UNPUBLISHED,
        semanticMeaning: DatasetLabelSemanticMeaning.WARNING
      },
      { value: DatasetLabelValue.DRAFT, semanticMeaning: DatasetLabelSemanticMeaning.DATASET }
    ]
  }

  static createDeaccessioned(): DatasetLabel[] {
    return [
      {
        value: DatasetLabelValue.DEACCESSIONED,
        semanticMeaning: DatasetLabelSemanticMeaning.DANGER
      }
    ]
  }
}

export class DatasetCitationMother {
  static create(): string {
    return 'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, V1'
  }

  static createDraft(): string {
    return 'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, DRAFT VERSION'
  }

  static createDeaccessioned(): string {
    return 'Finch, Fiona, 2023, "Darwin\'s Finches", <a href="https://doi.org/10.5072/FK2/0YFWKL" target="_blank">https://doi.org/10.5072/FK2/0YFWKL</a>, Root, V1, DEACCESSIONED VERSION'
  }
}

export class DatasetFileDownloadSizeMother {
  static create(props?: Partial<FileDownloadSize>): FileDownloadSize {
    return new FileDownloadSize(
      props?.value ?? faker.datatype.number(),
      props?.unit ?? faker.helpers.arrayElement(Object.values(FileSizeUnit)),
      props?.mode ?? faker.helpers.arrayElement(Object.values(FileDownloadMode))
    )
  }

  static createArchival(props?: Partial<FileDownloadSize>): FileDownloadSize {
    return this.create({ mode: FileDownloadMode.ARCHIVAL, ...props })
  }

  static createOriginal(props?: Partial<FileDownloadSize>): FileDownloadSize {
    return this.create({ mode: FileDownloadMode.ORIGINAL, ...props })
  }
}

export class DatasetDownloadUrlsMother {
  static create(props?: Partial<DatasetDownloadUrls>): DatasetDownloadUrls {
    return {
      original: this.createDownloadUrl(),
      archival: this.createDownloadUrl(),
      ...props
    }
  }

  static createDownloadUrl(): string {
    const blob = new Blob(['Name,Age,Location\nJohn,25,New York\nJane,30,San Francisco'], {
      type: 'text/csv'
    })
    return URL.createObjectURL(blob)
  }
}

export class DatasetMother {
  static createEmpty(): undefined {
    return undefined
  }

  static createMany(count: number): Dataset[] {
    return Array.from({ length: count }, () => this.create())
  }

  static create(props?: Partial<Dataset>): Dataset {
    const dataset = {
      persistentId: faker.datatype.uuid(),
      version: DatasetVersionMother.create(),
      license: {
        name: 'CC0 1.0',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      labels: DatasetLabelsMother.create(),
      summaryFields: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            dsDescription: faker.lorem.sentence(),
            keyword: faker.lorem.sentence(),
            subject: faker.lorem.sentence(),
            publication: faker.lorem.sentence(),
            notesText: faker.lorem.sentence()
          }
        }
      ],
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            subject: [faker.lorem.word(), faker.lorem.word()],
            author: [
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.word()
              },
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.word()
              }
            ],
            datasetContact: [
              {
                datasetContactName: faker.lorem.sentence(),
                datasetContactEmail: faker.internet.email()
              }
            ],
            dsDescription: [
              {
                dsDescriptionValue: faker.lorem.sentence()
              }
            ],
            producer: [
              {
                producerName: faker.lorem.sentence(),
                producerURL: faker.internet.url(),
                producerLogoURL: faker.image.imageUrl()
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: {
              geographicCoverageCountry: faker.lorem.sentence(),
              geographicCoverageCity: faker.lorem.sentence()
            }
          }
        }
      ] as DatasetMetadataBlocks,
      permissions: DatasetPermissionsMother.create(),
      locks: [],
      hasValidTermsOfAccess: faker.datatype.boolean(),
      hasOneTabularFileAtLeast: faker.datatype.boolean(),
      isValid: faker.datatype.boolean(),
      downloadUrls: DatasetDownloadUrlsMother.create(),
      thumbnail: undefined,
      privateUrl: undefined,
      fileDownloadSizes: [],
      requestedVersion: undefined,
      hierarchy: UpwardHierarchyNodeMother.createDataset(),
      termsOfUse: {
        fileAccessRequest: true,
        termsOfAccess: 'Terms of access',
        dataAccessPlace: 'Data access place',
        originalArchive: 'Original archive',
        availabilityStatus: 'Availability status',
        contactForAccess: 'Contact for access',
        sizeOfCollection: 'Size of collection',
        studyCompletion: 'Study completion'
      },
      ...props
    }

    return new Dataset.Builder(
      dataset.persistentId,
      dataset.version,
      dataset.summaryFields,
      dataset.license,
      dataset.termsOfUse,
      dataset.metadataBlocks,
      dataset.permissions,
      dataset.locks,
      dataset.hasValidTermsOfAccess,
      dataset.hasOneTabularFileAtLeast,
      dataset.isValid,
      dataset.downloadUrls,
      dataset.fileDownloadSizes,
      dataset.hierarchy,
      dataset.thumbnail,
      dataset.privateUrl,
      dataset.requestedVersion
    ).build()
  }

  static createAnonymized(): Dataset {
    return this.create({
      version: DatasetVersionMother.createAnonymized(),
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            subject: [faker.lorem.word(), faker.lorem.word()],
            author: ANONYMIZED_FIELD_VALUE,
            datasetContact: [
              {
                datasetContactName: faker.lorem.sentence(),
                datasetContactEmail: faker.internet.email()
              }
            ],
            dsDescription: ANONYMIZED_FIELD_VALUE
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: ANONYMIZED_FIELD_VALUE
          }
        }
      ]
    })
  }

  static createRealistic(props?: Partial<Dataset>): Dataset {
    return this.create({
      persistentId: 'doi:10.5072/FK2/ABC123',
      version: DatasetVersionMother.createRealistic(),
      license: {
        name: 'CC0 1.0',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      summaryFields: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            dsDescription: [
              {
                dsDescriptionValue:
                  'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
              }
            ],
            keyword: 'Malaria, Tuberculosis, Drug Resistant',
            subject: 'Medicine, Health and Life Sciences, Social Sciences',
            publication: 'CNN Journal [CNN.com](https://cnn.com)',
            notesText: 'Here is an image ![Alt text](https://picsum.photos/id/10/40/40)'
          }
        }
      ],
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            alternativePersistentId: 'doi:10.5072/FK2/ABC123',
            publicationDate: '2021-01-01',
            citationDate: '2023-01-01',
            title: 'Dataset Title',
            subject: [SUBJECT_FIELD_VOCAB_VALUES[0], SUBJECT_FIELD_VOCAB_VALUES[1]],
            author: [
              {
                authorName: 'Admin, Dataverse',
                authorAffiliation: 'Dataverse.org',
                authorIdentifierScheme: 'ORCID',
                authorIdentifier: '0000-0002-1825-1097'
              },
              {
                authorName: 'Owner, Dataverse',
                authorAffiliation: 'Dataverse.org',
                authorIdentifierScheme: 'ORCID',
                authorIdentifier: '0000-0032-1825-0098'
              }
            ],
            datasetContact: [
              {
                datasetContactName: 'Admin, Dataverse',
                datasetContactEmail: 'admin@dataverse.org'
              }
            ],
            dsDescription: [
              {
                dsDescriptionValue:
                  'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicUnit: 'km',
            geographicCoverage: {
              country: COUNTRY_FIELD_VOCAB_VALUES[234],
              city: 'Cambridge'
            }
          }
        }
      ] as DatasetMetadataBlocks,
      permissions: {
        canDownloadFiles: true,
        canUpdateDataset: false,
        canPublishDataset: false,
        canManageDatasetPermissions: false,
        canManageFilesPermissions: false,
        canDeleteDataset: false
      },
      locks: [],
      hasValidTermsOfAccess: true,
      hasOneTabularFileAtLeast: true,
      fileDownloadSizes: [
        new FileDownloadSize(21.98, FileSizeUnit.KILOBYTES, FileDownloadMode.ORIGINAL),
        new FileDownloadSize(21.98, FileSizeUnit.KILOBYTES, FileDownloadMode.ARCHIVAL)
      ],
      isValid: true,
      hierarchy: UpwardHierarchyNodeMother.createDataset({ name: 'Dataset Title' }),
      ...props
    })
  }

  static createRealisticAnonymized(): Dataset {
    return this.createRealistic({
      version: DatasetVersionMother.createAnonymized(),
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            alternativePersistentId: 'doi:10.5072/FK2/ABC123',
            publicationDate: ANONYMIZED_FIELD_VALUE,
            citationDate: '2023-01-01',
            title: 'Dataset Title',
            subject: [SUBJECT_FIELD_VOCAB_VALUES[0], SUBJECT_FIELD_VOCAB_VALUES[1]],
            author: ANONYMIZED_FIELD_VALUE,
            datasetContact: ANONYMIZED_FIELD_VALUE,
            dsDescription: [
              {
                dsDescriptionValue:
                  'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicUnit: 'km',
            geographicCoverage: ANONYMIZED_FIELD_VALUE
          }
        }
      ] as DatasetMetadataBlocks
    })
  }
}

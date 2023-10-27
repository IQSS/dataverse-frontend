import { faker } from '@faker-js/faker'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetLock,
  DatasetLockReason,
  DatasetMetadataBlocks,
  DatasetPermissions,
  DatasetPublishingStatus,
  DatasetVersion,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetVersionMother {
  static create(props?: Partial<DatasetVersion>): DatasetVersion {
    return new DatasetVersion(
      props?.id ?? faker.datatype.number(),
      props?.publishingStatus ?? DatasetPublishingStatus.RELEASED,
      props?.isLatest ?? false,
      props?.isInReview ?? false,
      props?.latestVersionStatus ?? DatasetPublishingStatus.RELEASED,
      props?.majorNumber ?? 1,
      props?.minorNumber ?? 0
    )
  }

  static createReleased(): DatasetVersion {
    return this.create({ publishingStatus: DatasetPublishingStatus.RELEASED })
  }

  static createDeaccessioned(): DatasetVersion {
    return this.create({ publishingStatus: DatasetPublishingStatus.DEACCESSIONED })
  }

  static createDraftAsLatestVersion(): DatasetVersion {
    return this.create({ publishingStatus: DatasetPublishingStatus.DRAFT, isLatest: true })
  }

  static createDraft(): DatasetVersion {
    return this.create({ publishingStatus: DatasetPublishingStatus.DRAFT })
  }

  static createDraftAsLatestVersionInReview(): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.DRAFT,
      isLatest: true,
      isInReview: true
    })
  }

  static createReleasedWithLatestVersionIsADraft(): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.RELEASED,
      isLatest: true,
      latestVersionStatus: DatasetPublishingStatus.DRAFT
    })
  }

  static createDraftWithLatestVersionIsADraft(): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.DRAFT,
      isLatest: true,
      latestVersionStatus: DatasetPublishingStatus.DRAFT
    })
  }

  static createWithLatestVersionIsNotADraft(): DatasetVersion {
    return this.create({
      publishingStatus: DatasetPublishingStatus.DRAFT,
      isLatest: true,
      latestVersionStatus: DatasetPublishingStatus.RELEASED
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
      id: faker.datatype.number(),
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
}

export class DatasetMother {
  static createEmpty(): undefined {
    return undefined
  }

  static create(props?: Partial<Dataset>): Dataset {
    const dataset = {
      persistentId: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: DatasetVersionMother.create(),
      citation:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
      license: {
        name: 'CC0 1.0',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      labels: [
        {
          value: DatasetLabelValue.IN_REVIEW,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: DatasetLabelValue.EMBARGOED,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: DatasetLabelValue.UNPUBLISHED,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: `Version ${faker.lorem.word()}`,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        }
      ],
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
      isValid: faker.datatype.boolean(),
      isReleased: faker.datatype.boolean(),
      thumbnail: undefined,
      privateUrl: undefined,
      ...props
    }

    return new Dataset.Builder(
      dataset.persistentId,
      dataset.version,
      dataset.citation,
      dataset.summaryFields,
      dataset.license,
      dataset.metadataBlocks,
      dataset.permissions,
      dataset.locks,
      dataset.hasValidTermsOfAccess,
      dataset.isValid,
      dataset.isReleased,
      dataset.privateUrl,
      dataset.thumbnail
    ).build()
  }

  static createAnonymized(): Dataset {
    return this.create({
      citation:
        'Author name(s) withheld, 2023, "citation", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
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
      citation: `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1`,
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.RELEASED,
        false,
        false,
        DatasetPublishingStatus.RELEASED,
        1,
        0
      ),
      labels: [
        { value: 'Version 1.0', semanticMeaning: DatasetLabelSemanticMeaning.FILE },
        { value: DatasetLabelValue.DRAFT, semanticMeaning: DatasetLabelSemanticMeaning.DATASET }
      ],
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
            subject: ['Subject1', 'Subject2'],
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
                datasetContactEmail: ''
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
              geographicCoverageCountry: 'United States',
              geographicCoverageCity: 'Cambridge'
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
      isReleased: true,
      hasValidTermsOfAccess: true,
      isValid: true,
      ...props
    })
  }

  static createRealisticAnonymized(): Dataset {
    return this.createRealistic({
      citation: `Author name(s) withheld, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1`,
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            alternativePersistentId: 'doi:10.5072/FK2/ABC123',
            publicationDate: ANONYMIZED_FIELD_VALUE,
            citationDate: '2023-01-01',
            title: 'Dataset Title',
            subject: ['Subject1', 'Subject2'],
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

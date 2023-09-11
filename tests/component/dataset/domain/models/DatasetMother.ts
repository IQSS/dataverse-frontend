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
  DatasetStatus,
  DatasetVersion,
  MetadataBlockName
} from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetVersionMother {
  static create(props?: Partial<DatasetVersion>): DatasetVersion {
    return new DatasetVersion(
      props?.majorNumber ?? 1,
      props?.minorNumber ?? 0,
      props?.status ?? DatasetStatus.RELEASED,
      props?.isLatest ?? false,
      props?.isInReview ?? false
    )
  }

  static createReleased(): DatasetVersion {
    return new DatasetVersion(1, 0, DatasetStatus.RELEASED, false, false)
  }

  static createDeaccessioned(): DatasetVersion {
    return new DatasetVersion(1, 0, DatasetStatus.DEACCESSIONED, false, false)
  }

  static createDraftAsLatestVersion(): DatasetVersion {
    return new DatasetVersion(1, 0, DatasetStatus.DRAFT, true, false)
  }

  static createDraft(): DatasetVersion {
    return new DatasetVersion(1, 0, DatasetStatus.DRAFT, false, false)
  }

  static createDraftAsLatestVersionInReview(): DatasetVersion {
    return new DatasetVersion(1, 0, DatasetStatus.DRAFT, true, true)
  }
}

export class DatasetPermissionsMother {
  static create(props?: Partial<DatasetPermissions>): DatasetPermissions {
    return {
      canDownloadFiles: faker.datatype.boolean(),
      canUpdateDataset: faker.datatype.boolean(),
      canPublishDataset: faker.datatype.boolean(),
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
      canPublishDataset: true
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
                authorIdentifier: faker.lorem.sentence()
              },
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.sentence()
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
      dataset.locks
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
}

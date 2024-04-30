import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { TestsUtils } from '../../shared/TestsUtils'
import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLockReason,
  DatasetPublishingStatus,
  DatasetVersion,
  MetadataBlockName
} from '../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'
import {
  FileDownloadMode,
  FileDownloadSize,
  FileSizeUnit
} from '../../../../src/files/domain/models/FileMetadata'
import { DatasetPaginationInfo } from '../../../../src/dataset/domain/models/DatasetPaginationInfo'
import { DatasetDTO } from '../../../../src/dataset/domain/useCases/DTOs/DatasetDTO'

chai.use(chaiAsPromised)
const expect = chai.expect

function getCurrentDateInYYYYMMDDFormat() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

function getPersistentIdUrl(persistentId: string) {
  return `https://doi.org/${persistentId.replace('doi:', '')}`
}

function getCitationString(persistentId: string, version: 'DRAFT VERSION' | 'V1') {
  const year = new Date().getFullYear()
  return `Finch, Fiona, ${year}, "Darwin's Finches", <a href="${getPersistentIdUrl(
    persistentId
  )}" target="_blank">${getPersistentIdUrl(persistentId)}</a>, Root, ${version}`
}

const datasetData = (persistentId: string, versionId: number) => {
  return {
    license: {
      name: 'CC0 1.0',
      uri: 'http://creativecommons.org/publicdomain/zero/1.0',
      iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
    },
    metadataBlocks: [
      {
        fields: {
          author: [
            {
              authorName: 'Finch, Fiona',
              authorAffiliation: 'Birds Inc.'
            }
          ],
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
          title: "Darwin's Finches"
        },
        name: 'citation'
      }
    ],
    persistentId: persistentId,
    summaryFields: [
      {
        fields: {
          dsDescription: [
            {
              dsDescriptionValue:
                "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
            }
          ],
          subject: ['Medicine, Health and Life Sciences']
        },
        name: 'citation'
      }
    ],
    title: "Darwin's Finches",
    version: {
      id: versionId,
      number: {
        majorNumber: undefined,
        minorNumber: undefined
      },
      publishingStatus: 'draft',
      latestVersionPublishingStatus: 'draft',
      isLatest: true,
      isInReview: false,
      citation: getCitationString(persistentId, 'DRAFT VERSION'),
      title: "Darwin's Finches",
      labels: [
        { semanticMeaning: 'dataset', value: 'Draft' },
        { semanticMeaning: 'warning', value: 'Unpublished' }
      ],
      someDatasetVersionHasBeenReleased: false
    },
    permissions: {
      canDownloadFiles: true,
      canUpdateDataset: true,
      canPublishDataset: true,
      canManageDatasetPermissions: true,
      canManageFilesPermissions: true,
      canDeleteDataset: true
    },
    locks: [],
    downloadUrls: {
      original: `/api/access/dataset/:persistentId/versions/:draft?persistentId=${persistentId}&format=original`,
      archival: `/api/access/dataset/:persistentId/versions/:draft?persistentId=${persistentId}`
    },
    fileDownloadSizes: [
      new FileDownloadSize(0, FileSizeUnit.BYTES, FileDownloadMode.ORIGINAL),
      new FileDownloadSize(0, FileSizeUnit.BYTES, FileDownloadMode.ARCHIVAL)
    ]
  }
}

const datasetRepository = new DatasetJSDataverseRepository()
describe('Dataset JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => {
    TestsUtils.login()
    cy.wrap(DatasetHelper.destroyAll())
  })

  it('gets the dataset by persistentId', async () => {
    const datasetResponse = await DatasetHelper.create()

    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.license).to.deep.equal(datasetExpected.license)
      expect(dataset.metadataBlocks).to.deep.equal(datasetExpected.metadataBlocks)
      expect(dataset.summaryFields).to.deep.equal(datasetExpected.summaryFields)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.metadataBlocks[0].fields.publicationDate).not.to.exist
      expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
      expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
      expect(dataset.locks).to.deep.equal(datasetExpected.locks)
      expect(dataset.downloadUrls).to.deep.equal(datasetExpected.downloadUrls)
      expect(dataset.fileDownloadSizes).to.deep.equal(datasetExpected.fileDownloadSizes)
    })
  })

  it('gets a published dataset by persistentId without user authentication', async () => {
    const datasetResponse = await DatasetHelper.create()
    await DatasetHelper.publish(datasetResponse.persistentId)

    await TestsUtils.wait(1500)

    await TestsUtils.logout()

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, '1.0')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const newVersion = new DatasetVersion(
          dataset.version.id,
          "Darwin's Finches",
          {
            majorNumber: 1,
            minorNumber: 0
          },
          DatasetPublishingStatus.RELEASED,
          getCitationString(dataset.persistentId, 'V1'),
          [new DatasetLabel(DatasetLabelSemanticMeaning.FILE, 'Version 1.0')],
          true,
          false,
          DatasetPublishingStatus.RELEASED,
          true
        )
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.version).to.deep.equal(newVersion)
        expect(dataset.metadataBlocks[0].fields.publicationDate).to.deep.equal(
          expectedPublicationDate
        )
        expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
        expect(dataset.permissions).to.deep.equal({
          canDownloadFiles: true,
          canUpdateDataset: false,
          canPublishDataset: false,
          canManageDatasetPermissions: false,
          canManageFilesPermissions: true,
          canDeleteDataset: false
        })
      })
  })

  it('gets the dataset by persistentId and version number', async () => {
    const datasetResponse = await DatasetHelper.create()
    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.waitForNoLocks(datasetResponse.persistentId)
    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, '1.0')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)
        const newVersion = new DatasetVersion(
          dataset.version.id,
          "Darwin's Finches",
          {
            majorNumber: 1,
            minorNumber: 0
          },
          DatasetPublishingStatus.RELEASED,
          getCitationString(dataset.persistentId, 'V1'),
          [new DatasetLabel(DatasetLabelSemanticMeaning.FILE, 'Version 1.0')],
          true,
          false,
          DatasetPublishingStatus.RELEASED,
          true
        )
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.version).to.deep.equal(newVersion)
        expect(dataset.metadataBlocks[0].fields.publicationDate).to.deep.equal(
          expectedPublicationDate
        )
        expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
        expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
      })
  })

  it('gets the dataset by persistentId and version DRAFT keyword', async () => {
    const datasetResponse = await DatasetHelper.create()

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, 'DRAFT')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

        expect(dataset.version.title).to.deep.equal(datasetExpected.title)
        expect(dataset.version).to.deep.equal(datasetExpected.version)
      })
  })

  it('gets the dataset by privateUrlToken', async () => {
    const datasetResponse = await DatasetHelper.create()
    const privateUrlResponse = await DatasetHelper.createPrivateUrl(datasetResponse.id)

    await datasetRepository.getByPrivateUrlToken(privateUrlResponse.token).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.version.title).to.deep.equal(datasetExpected.title)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
    })
  })

  it('gets the dataset after changing the citation date field type', async () => {
    const datasetResponse = await DatasetHelper.create()

    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.waitForNoLocks(datasetResponse.persistentId)

    await DatasetHelper.setCitationDateFieldType(datasetResponse.persistentId, 'dateOfDeposit')

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, '1.0')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.metadataBlocks[0].fields.publicationDate).to.deep.equal(
          expectedPublicationDate
        )
        expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
      })
  })

  it('gets the DatasetPreview', () => {
    return DatasetHelper.createAndPublish().then((datasetResponse) => {
      const paginationInfo = new DatasetPaginationInfo(1, 20)

      return datasetRepository.getAllWithCount('root', paginationInfo).then((datasetsWithCount) => {
        expect(datasetsWithCount.totalCount).to.equal(1)
        expect(datasetsWithCount.datasetPreviews[0].version.title).to.equal("Darwin's Finches")
        expect(datasetsWithCount.datasetPreviews[0].persistentId).to.equal(
          datasetResponse.persistentId
        )
      })
    })
  })

  it.skip('gets the dataset by persistentId when the dataset is deaccessioned', async () => {
    // TODO - Implement once the getDatasetCitation includes deaccessioned datasets
    const datasetResponse = await DatasetHelper.create()

    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.wait(1500)

    await DatasetHelper.deaccession(datasetResponse.id)
    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.version.title).to.deep.equal(datasetExpected.title)
    })
  })
  it('gets the dataset by persistentId when is locked', async () => {
    const datasetResponse = await DatasetHelper.create()
    await DatasetHelper.lock(datasetResponse.id, DatasetLockReason.FINALIZE_PUBLICATION)

    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.version.title).to.deep.equal(datasetExpected.title)
      expect(dataset.locks).to.deep.equal([
        {
          userPersistentId: 'dataverseAdmin',
          reason: DatasetLockReason.FINALIZE_PUBLICATION
        }
      ])
    })
  })

  it('creates a new dataset from DatasetDTO', async () => {
    const datasetDTO: DatasetDTO = {
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: "Darwin's Finches",
            subject: ['Medicine, Health and Life Sciences'],
            author: [
              {
                authorName: 'Finch, Fiona'
              }
            ],
            dsDescription: [
              {
                dsDescriptionValue:
                  "Darwin's finches (also known as the Galápagos finches) are a group of about fifteen species of passerine birds."
              }
            ],
            datasetContact: [
              {
                datasetContactEmail: 'finch@mailinator.com'
              }
            ]
          }
        }
      ]
    }

    await datasetRepository.create(datasetDTO).then((response) => {
      expect(response.persistentId).to.exist
    })
  })
})

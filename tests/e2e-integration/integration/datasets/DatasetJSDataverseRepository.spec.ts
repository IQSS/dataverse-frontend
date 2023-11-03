import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { TestsUtils } from '../../shared/TestsUtils'
import {
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '../../shared/datasets/DatasetHelper'

chai.use(chaiAsPromised)
const expect = chai.expect

function getCurrentDateInYYYYMMDDFormat() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

const datasetData = (persistentId: string, versionId: number) => {
  const persistentIdUrl = `https://doi.org/${persistentId.replace('doi:', '')}`
  return {
    citation: `Finch, Fiona, 2023, "Darwin's Finches", <a href="${persistentIdUrl}" target="_blank">${persistentIdUrl}</a>, Root, DRAFT VERSION`,
    labels: [
      { semanticMeaning: 'dataset', value: 'Draft' },
      { semanticMeaning: 'warning', value: 'Unpublished' }
    ],
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
      majorNumber: undefined,
      minorNumber: undefined,
      publishingStatus: 'draft',
      requestedVersion: undefined,
      latestVersionStatus: 'draft',
      isLatest: true,
      isInReview: false
    },
    permissions: {
      canDownloadFiles: true,
      canUpdateDataset: true,
      canPublishDataset: true,
      canManageDatasetPermissions: true,
      canManageFilesPermissions: true,
      canDeleteDataset: true
    }
  }
}

const datasetRepository = new DatasetJSDataverseRepository()
describe('Dataset JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => TestsUtils.login())

  it('gets the dataset by persistentId', async () => {
    const datasetResponse = await DatasetHelper.create()

    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)

      expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
      expect(dataset.citation).to.deep.equal(datasetExpected.citation)
      expect(dataset.labels).to.deep.equal(datasetExpected.labels)
      expect(dataset.license).to.deep.equal(datasetExpected.license)
      expect(dataset.metadataBlocks).to.deep.equal(datasetExpected.metadataBlocks)
      expect(dataset.summaryFields).to.deep.equal(datasetExpected.summaryFields)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.metadataBlocks[0].fields.publicationDate).not.to.exist
      expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
      expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
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
        const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)
        const newVersion = new DatasetVersion(
          dataset.version.id,
          DatasetPublishingStatus.RELEASED,
          true,
          false,
          DatasetPublishingStatus.RELEASED,
          1,
          0
        )
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
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

    await TestsUtils.wait(1500)

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, '1.0')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const datasetExpected = datasetData(dataset.persistentId, dataset.version.id)
        const newVersion = new DatasetVersion(
          dataset.version.id,
          DatasetPublishingStatus.RELEASED,
          true,
          false,
          DatasetPublishingStatus.RELEASED,
          1,
          0
        )
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
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

        expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
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

      expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.permissions).to.deep.equal(datasetExpected.permissions)
    })
  })

  it('gets the dataset after changing the citation date field type', async () => {
    const datasetResponse = await DatasetHelper.create()

    await DatasetHelper.publish(datasetResponse.persistentId)
    await TestsUtils.wait(1500)

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
})

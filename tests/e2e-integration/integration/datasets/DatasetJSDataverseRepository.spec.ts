import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DatasetJSDataverseRepository } from '../../../../src/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { IntegrationTestsUtils } from '../IntegrationTestsUtils'
import { DatasetHelper } from './DatasetHelper'
import { DatasetStatus, DatasetVersion } from '../../../../src/dataset/domain/models/Dataset'

chai.use(chaiAsPromised)
const expect = chai.expect

function getCurrentDateInYYYYMMDDFormat() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate()
  ).padStart(2, '0')}`
}

const datasetData = (persistentId: string) => {
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
    version: { majorNumber: undefined, minorNumber: undefined, status: 'draft' }
  }
}

const datasetRepository = new DatasetJSDataverseRepository()
describe('Dataset JSDataverse Repository', () => {
  before(() => IntegrationTestsUtils.setup())
  beforeEach(() => IntegrationTestsUtils.login())

  it('gets the dataset by persistentId', async () => {
    const datasetResponse = await DatasetHelper.createDataset()

    await datasetRepository.getByPersistentId(datasetResponse.persistentId).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId)

      expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
      expect(dataset.citation).to.deep.equal(datasetExpected.citation)
      expect(dataset.labels).to.deep.equal(datasetExpected.labels)
      expect(dataset.license).to.deep.equal(datasetExpected.license)
      expect(dataset.metadataBlocks).to.deep.equal(datasetExpected.metadataBlocks)
      expect(dataset.summaryFields).to.deep.equal(datasetExpected.summaryFields)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
      expect(dataset.metadataBlocks[0].fields.publicationDate).not.to.exist
      expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
    })
  })

  it('gets the dataset by persistentId and version number', async () => {
    const datasetResponse = await DatasetHelper.createDataset()
    await DatasetHelper.publishDataset(datasetResponse.persistentId)

    await IntegrationTestsUtils.wait(1500)

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, '1.0')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const datasetExpected = datasetData(dataset.persistentId)
        const newVersion = new DatasetVersion(1, 0, DatasetStatus.RELEASED)
        const expectedPublicationDate = getCurrentDateInYYYYMMDDFormat()
        expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
        expect(dataset.version).to.deep.equal(newVersion)
        expect(dataset.metadataBlocks[0].fields.publicationDate).to.deep.equal(
          expectedPublicationDate
        )
        expect(dataset.metadataBlocks[0].fields.citationDate).not.to.exist
      })
  })

  it('gets the dataset by persistentId and version DRAFT keyword', async () => {
    const datasetResponse = await DatasetHelper.createDataset()

    await datasetRepository
      .getByPersistentId(datasetResponse.persistentId, 'DRAFT')
      .then((dataset) => {
        if (!dataset) {
          throw new Error('Dataset not found')
        }
        const datasetExpected = datasetData(dataset.persistentId)

        expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
        expect(dataset.version).to.deep.equal(datasetExpected.version)
      })
  })

  it('gets the dataset by privateUrlToken', async () => {
    const datasetResponse = await DatasetHelper.createDataset()
    const privateUrlResponse = await DatasetHelper.createPrivateUrl(datasetResponse.id)

    await datasetRepository.getByPrivateUrlToken(privateUrlResponse.token).then((dataset) => {
      if (!dataset) {
        throw new Error('Dataset not found')
      }
      const datasetExpected = datasetData(dataset.persistentId)

      expect(dataset.getTitle()).to.deep.equal(datasetExpected.title)
      expect(dataset.version).to.deep.equal(datasetExpected.version)
    })
  })

  it('gets the dataset after changing the citation date field type', async () => {
    const datasetResponse = await DatasetHelper.createDataset()

    await DatasetHelper.publishDataset(datasetResponse.persistentId)
    await IntegrationTestsUtils.wait(1500)

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

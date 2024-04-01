import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { MetadataBlockInfoJSDataverseRepository } from '../../../../src/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { MetadataBlockInfoCitationExample } from './MetadataBlockInfoCitationExample'
import { TestsUtils } from '../../shared/TestsUtils'

chai.use(chaiAsPromised)
const expect = chai.expect

const metadataBlockInfoExpected = MetadataBlockInfoCitationExample
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
describe('Metadata Block Info JSDataverse Repository', () => {
  before(() => TestsUtils.setup())
  beforeEach(() => TestsUtils.login())

  it('gets the metadataBlockInfo by name', async () => {
    await metadataBlockInfoRepository.getByName('citation').then((metadataBlockInfo) => {
      if (!metadataBlockInfo) {
        throw new Error('Metadata Block Info not found')
      }
      expect(metadataBlockInfo).to.deep.equal(metadataBlockInfoExpected)
    })
  })
})

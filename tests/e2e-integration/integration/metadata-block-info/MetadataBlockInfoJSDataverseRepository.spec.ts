import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { MetadataBlockInfoJSDataverseRepository } from '../../../../src/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { TestsUtils } from '../../shared/TestsUtils'

chai.use(chaiAsPromised)
const expect = chai.expect

const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
describe('Metadata Block Info JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('returns JSON in the  correct format', async () => {
    await metadataBlockInfoRepository.getByName('citation').then((metadataBlockInfo) => {
      if (!metadataBlockInfo) {
        throw new Error('Metadata Block Info not found')
      }
      expect(metadataBlockInfo['name']).to.equal('citation')
      expect(metadataBlockInfo['fields']).to.be.an('object')
      Object.keys(metadataBlockInfo['fields']).forEach((field) => {
        expect(metadataBlockInfo['fields'][field]).to.be.an('object')
        expect(metadataBlockInfo['fields'][field]['displayFormat']).to.be.a('string')
      })
    })
  })
})

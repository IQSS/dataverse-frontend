import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DataverseInfoJSDataverseRepository } from '../../../../../../src/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { IntegrationTestsUtils } from '../../../IntegrationTestsUtils'

chai.use(chaiAsPromised)

const expect = chai.expect

IntegrationTestsUtils.setup()

describe('DataverseInfo JSDataverse Repository', () => {
  it('gets the dataverse version number', async () => {
    const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
    const dataverseVersion = await dataverseInfoRepository.getVersion()

    expect(dataverseVersion).to.exist
  })
})

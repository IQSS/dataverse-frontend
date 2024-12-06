import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { DataverseInfoJSDataverseRepository } from '../../../../../../src/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { TestsUtils } from '../../../../shared/TestsUtils'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('DataverseInfo JSDataverse Repository', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      if (!token) {
        throw new Error('Token not found after Keycloak login')
      }

      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('gets the dataverse version number', async () => {
    const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
    const dataverseVersion = await dataverseInfoRepository.getVersion()

    expect(dataverseVersion).to.exist
  })
})

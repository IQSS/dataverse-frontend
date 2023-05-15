import { DataverseInfoJSDataverseRepository } from '../../../../../src/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { ApiConfig } from 'js-dataverse/dist/core'

chai.use(chaiAsPromised)

const expect = chai.expect

describe('DataverseInfo JSDataverse Repository', () => {
  const VITE_DATAVERSE_BACKEND_URL = (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''
  ApiConfig.init(`${VITE_DATAVERSE_BACKEND_URL}/api/v1`)

  it('gets the dataverse version number', async () => {
    const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
    const dataverseVersion = await dataverseInfoRepository.getVersion()

    expect(dataverseVersion).to.exist
  })
})

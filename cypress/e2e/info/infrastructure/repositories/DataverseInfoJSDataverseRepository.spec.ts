import { DataverseInfoJSDataverseRepository } from '../../../../../src/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { getDataverseVersion } from '../../../../../src/info/domain/useCases/getDataverseVersion'

describe('DataverseInfo JSDataverse Repository', () => {
  it('gets the dataverse version number', async () => {
    const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
    const dataverseVersion = await getDataverseVersion(dataverseInfoRepository)

    expect(dataverseVersion).not.toBeNull()
  })
})

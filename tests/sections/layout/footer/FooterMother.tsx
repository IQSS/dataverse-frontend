import { SinonSandbox } from 'sinon'
import { ReactElement } from 'react'
import { DataverseVersion } from '../../../../src/info/domain/models/DataverseVersion'
import { DataverseInfoRepository } from '../../../../src/info/domain/repositories/DataverseInfoRepository'
import { Footer } from '../../../../src/sections/layout/footer/Footer'
import { DataverseVersionMother } from '../../../info/models/DataverseVersionMother'

export class FooterMother {
  static withDataverseVersion(
    sandbox: SinonSandbox,
    dataverseVersion: DataverseVersion = DataverseVersionMother.create()
  ): ReactElement {
    const dataverseInfoRepository: DataverseInfoRepository = {} as DataverseInfoRepository
    dataverseInfoRepository.getVersion = sandbox.stub().resolves(dataverseVersion)

    return <Footer dataverseInfoRepository={dataverseInfoRepository} />
  }
}

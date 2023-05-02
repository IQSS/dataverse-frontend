import { DataverseVersion } from '../models/DataverseVersion'

export interface DataverseInfoRepository {
  getVersion(): Promise<DataverseVersion>
}

import { TokenInfo } from '../../domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '../../domain/repositories/ApiTokenInfoRepository'
import {
  getCurrentApiToken,
  recreateCurrentApiToken,
  deleteCurrentApiToken
} from '@iqss/dataverse-client-javascript'

interface ApiTokenInfoPayload {
  apiToken: string
  expirationDate: Date
}

export class ApiTokenInfoJSDataverseRepository implements ApiTokenInfoRepository {
  getCurrentApiToken(): Promise<TokenInfo> {
    return getCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate.toISOString().substring(0, 10)
      }
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return recreateCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate.toISOString().substring(0, 10)
      }
    })
  }

  deleteApiToken(): Promise<void> {
    return deleteCurrentApiToken.execute()
  }
}

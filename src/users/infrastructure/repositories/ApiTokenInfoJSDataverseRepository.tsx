import { TokenInfo } from '../../domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '../../domain/repositories/ApiTokenInfoRepository'
import { DateHelper } from '@/shared/helpers/DateHelper'
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
        expirationDate: DateHelper.toISO8601Format(apiTokenInfo.expirationDate)
      }
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return recreateCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: DateHelper.toISO8601Format(apiTokenInfo.expirationDate)
      }
    })
  }

  deleteApiToken(): Promise<void> {
    return deleteCurrentApiToken.execute()
  }
}

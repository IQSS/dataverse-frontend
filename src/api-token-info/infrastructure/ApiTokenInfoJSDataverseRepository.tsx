// import { ReadError } from '@iqss/dataverse-client-javascript'
// import {
//   getCurrentApiToken,
//   recreateCurrentApiToken,
//   deleteCurrentApiToken,
//   ApiTokenInfo
// } from '@iqss/dataverse-client-javascript'

import { TokenInfo } from '../domain/models/TokenInfo'
import { ApiTokenInfoRepository } from '../domain/repositories/ApiTokenInfoRepository'

export class ApiTokenInfoJSDataverseRepository implements ApiTokenInfoRepository {
  getCurrentApiToken(): Promise<TokenInfo> {
    return Promise.resolve({
      apiToken: '142354345435eefrr',
      expirationDate: new Date().toISOString().substring(0, 10)
    })
  }
  recreateApiToken(): Promise<TokenInfo> {
    return Promise.resolve({
      apiToken: 'apiToken',
      expirationDate: new Date().toISOString().substring(0, 10)
    })
  }

  deleteApiToken(): Promise<void> {
    return Promise.resolve()
  }
  // getCurrentApiToken(): Promise<TokenInfo> {
  //   return execute()
  //     .then((apiTokenInfo: TokenInfo) => {
  //       return {
  //         apiToken: apiTokenInfo.apiToken,
  //         expirationDate: apiTokenInfo.expirationDate
  //       }
  //     })
  //     .catch((error: ReadError) => {
  //       throw new Error(error.message)
  //     })
  // }
  // recreateApiToken(): Promise<TokenInfo> {
  //   return recreateCurrentApiToken
  //     .execute()
  //     .then((apiTokenInfo: ApiTokenInfo) => {
  //       return {
  //         apiToken: apiTokenInfo.apiToken,
  //         expirationDate: apiTokenInfo.expirationDate
  //       }
  //     })
  //     .catch((error: ReadError) => {
  //       throw new Error(error.message)
  //     })
  // }
  // deleteApiToken(): Promise<void> {
  //   return deleteCurrentApiToken()}
}

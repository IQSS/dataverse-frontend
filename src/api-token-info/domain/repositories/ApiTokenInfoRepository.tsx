import { TokenInfo } from '../models/TokenInfo'

export interface ApiTokenInfoRepository {
  getCurrentApiToken(): Promise<TokenInfo>
  recreateApiToken(): Promise<TokenInfo>
  deleteApiToken(): Promise<void>
}

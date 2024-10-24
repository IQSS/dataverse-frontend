import { TokenInfo } from '../models/TokenInfo'
import { ApiTokenInfoRepository } from '../repositories/ApiTokenInfoRepository'

export function recreateApiToken(apiTokenRepository: ApiTokenInfoRepository): Promise<TokenInfo> {
  return apiTokenRepository.recreateApiToken()
}

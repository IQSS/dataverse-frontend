import { TokenInfo } from '../models/TokenInfo'
import { ApiTokenInfoRepository } from '../repositories/ApiTokenInfoRepository'

export function getCurrentApiToken(apiTokenRepository: ApiTokenInfoRepository): Promise<TokenInfo> {
  return apiTokenRepository.getCurrentApiToken()
}

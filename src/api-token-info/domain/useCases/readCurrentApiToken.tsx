import { TokenInfo } from '../models/TokenInfo'
import { ApiTokenInfoRepository } from '../repositories/ApiTokenInfoRepository'

export function readCurrentApiToken(
  apiTokenRepository: ApiTokenInfoRepository
): Promise<TokenInfo> {
  return apiTokenRepository.getCurrentApiToken()
}

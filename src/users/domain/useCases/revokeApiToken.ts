import { ApiTokenInfoRepository } from '../repositories/ApiTokenInfoRepository'

export function revokeApiToken(apiTokenRepository: ApiTokenInfoRepository): Promise<void> {
  return apiTokenRepository.deleteApiToken()
}

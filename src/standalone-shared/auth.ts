import { ApiConfig, DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript'

export interface BearerTokenSource {
  bearerToken?: string
  getBearerToken?: () => string | null | undefined
}

export function configureSdkAuth(siteUrl: string, source: BearerTokenSource): void {
  const apiBaseUrl = `${siteUrl}/api/v1`

  const tokenGetter: (() => string | null) | undefined =
    source.getBearerToken !== undefined || source.bearerToken !== undefined
      ? () => source.getBearerToken?.() ?? source.bearerToken ?? null
      : undefined

  if (tokenGetter !== undefined) {
    ApiConfig.init(
      apiBaseUrl,
      DataverseApiAuthMechanism.BEARER_TOKEN,
      undefined,
      undefined,
      tokenGetter
    )
    return
  }

  ApiConfig.init(apiBaseUrl, DataverseApiAuthMechanism.SESSION_COOKIE)
}

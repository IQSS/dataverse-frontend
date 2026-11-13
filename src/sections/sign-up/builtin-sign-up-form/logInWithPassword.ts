import { requireAppConfig } from '@/config'

interface TokenResponse {
  access_token: string
  expires_in?: number
  refresh_token?: string
  refresh_expires_in?: number
  id_token?: string
}

const FALLBACK_EXPIRES_IN = 600

const epochAtSecondsFromNow = (seconds: number) => Math.round(Date.now() / 1000 + seconds)

const storeAuthItem = (key: string, value: unknown) => {
  const newValue = JSON.stringify(value)
  localStorage.setItem(key, newValue)
  window.dispatchEvent(new StorageEvent('storage', { key, newValue, storageArea: localStorage }))
}

export const logInWithPassword = async (username: string, password: string): Promise<void> => {
  const { oidc } = requireAppConfig()
  const response = await fetch(oidc.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'password',
      client_id: oidc.clientId,
      scope: 'openid',
      username,
      password
    })
  })

  if (!response.ok) {
    throw new Error(`Logging in after sign-up failed with status ${response.status}`)
  }

  const tokens = (await response.json()) as TokenResponse
  const prefix = oidc.localStorageKeyPrefix
  const expiresIn = tokens.expires_in ?? FALLBACK_EXPIRES_IN

  if (tokens.id_token) {
    storeAuthItem(`${prefix}idToken`, tokens.id_token)
  }
  if (tokens.refresh_token) {
    storeAuthItem(`${prefix}refreshToken`, tokens.refresh_token)
    storeAuthItem(
      `${prefix}refreshTokenExpire`,
      epochAtSecondsFromNow(tokens.refresh_expires_in ?? expiresIn + FALLBACK_EXPIRES_IN)
    )
  }
  storeAuthItem(`${prefix}tokenExpire`, epochAtSecondsFromNow(expiresIn))
  storeAuthItem(`${prefix}token`, tokens.access_token)
}

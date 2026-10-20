import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { OrcidSignUpConnection } from '@/users/domain/models/OrcidSignUpConnection'
import { connectOrcidForSignUp } from '@/users/domain/useCases/connectOrcidForSignUp'
import { getOrcidSignUpAuthorizationUrl } from '@/users/domain/useCases/getOrcidSignUpAuthorizationUrl'
import { Route } from '@/sections/Route.enum'
import { SignUpDraft } from './types'

export const SIGN_UP_DRAFT_STORAGE_KEY = 'dataverse.signUp.draft'

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

export const getOrcidSignUpRedirectUri = (): string =>
  `${window.location.origin}${BASENAME_URL}${Route.SIGN_UP}`

const saveDraft = (draft: SignUpDraft) => {
  try {
    sessionStorage.setItem(SIGN_UP_DRAFT_STORAGE_KEY, JSON.stringify(draft))
  } catch {
    return
  }
}

const takeDraft = (): SignUpDraft | null => {
  try {
    const raw = sessionStorage.getItem(SIGN_UP_DRAFT_STORAGE_KEY)
    sessionStorage.removeItem(SIGN_UP_DRAFT_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as SignUpDraft) : null
  } catch {
    return null
  }
}

interface UseOrcidSignUpReturnType {
  connection: OrcidSignUpConnection | null
  restoredDraft: SignUpDraft | null
  isConnecting: boolean
  error: string | null
  startConnection: (draft: SignUpDraft) => Promise<void>
  disconnect: () => void
}

export const useOrcidSignUp = (userRepository: UserRepository): UseOrcidSignUpReturnType => {
  const { t } = useTranslation('signUp')
  const [searchParams, setSearchParams] = useSearchParams()
  const [connection, setConnection] = useState<OrcidSignUpConnection | null>(null)
  const [restoredDraft, setRestoredDraft] = useState<SignUpDraft | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const handledCallback = useRef(false)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const oauthError = searchParams.get('error')

    if (handledCallback.current || (!code && !oauthError)) {
      return
    }
    handledCallback.current = true

    setRestoredDraft(takeDraft())
    setSearchParams({}, { replace: true })

    if (oauthError || !code || !state) {
      setError(t('fields.orcid.cancelled'))
      return
    }

    setIsConnecting(true)
    connectOrcidForSignUp(userRepository, { code, state, redirectUri: getOrcidSignUpRedirectUri() })
      .then((orcidConnection) => {
        setConnection(orcidConnection)
        setError(null)
      })
      .catch((connectError: unknown) => {
        setError(connectError instanceof Error ? connectError.message : String(connectError))
      })
      .finally(() => setIsConnecting(false))
  }, [searchParams, setSearchParams, userRepository, t])

  const startConnection = async (draft: SignUpDraft): Promise<void> => {
    setError(null)
    setIsConnecting(true)
    try {
      const authorizationUrl = await getOrcidSignUpAuthorizationUrl(
        userRepository,
        getOrcidSignUpRedirectUri()
      )
      saveDraft(draft)
      window.location.assign(authorizationUrl)
    } catch (startError) {
      setError(startError instanceof Error ? startError.message : String(startError))
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setConnection(null)
    setError(null)
  }

  return { connection, restoredDraft, isConnecting, error, startConnection, disconnect }
}

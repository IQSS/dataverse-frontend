import { User } from '../../domain/models/User'
import { TokenInfo } from '../../domain/models/TokenInfo'
import { UserRepository } from '../../domain/repositories/UserRepository'
import {
  AuthenticatedUser,
  getCurrentAuthenticatedUser,
  getCurrentApiToken,
  recreateCurrentApiToken,
  deleteCurrentApiToken,
  registerUser,
  signUp,
  getOrcidSignUpAuthorizationUrl,
  WriteError
} from '@iqss/dataverse-client-javascript'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSUserMapper } from '../mappers/JSUserMapper'
import { JSDataverseWriteErrorHandler } from '@/shared/helpers/JSDataverseWriteErrorHandler'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/axiosInstance'
import { UserDTO } from '@/users/domain/useCases/DTOs/UserDTO'
import { SignUpDTO } from '@/users/domain/useCases/DTOs/SignUpDTO'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { SignUpError } from '@/users/domain/models/SignUpError'
import { OrcidSignUpConnection } from '@/users/domain/models/OrcidSignUpConnection'
import { OrcidSignUpCallbackDTO } from '@/users/domain/useCases/DTOs/OrcidSignUpCallbackDTO'

interface SignUpErrorPayload {
  message?: string
  fieldErrors?: Record<string, string>
}

interface ApiTokenInfoPayload {
  apiToken: string
  expirationDate: Date
}

export class UserJSDataverseRepository implements UserRepository {
  getAuthenticated(): Promise<User> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => {
        return JSUserMapper.toUser(authenticatedUser)
      })
      .catch((error: ReadError) => {
        throw error
      })
  }

  getCurrentApiToken(): Promise<TokenInfo> {
    return getCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate
      }
    })
  }

  recreateApiToken(): Promise<TokenInfo> {
    return recreateCurrentApiToken.execute().then((apiTokenInfo: ApiTokenInfoPayload) => {
      return {
        apiToken: apiTokenInfo.apiToken,
        expirationDate: apiTokenInfo.expirationDate
      }
    })
  }

  deleteApiToken(): Promise<void> {
    return deleteCurrentApiToken.execute()
  }

  register(user: UserDTO): Promise<void> {
    return registerUser.execute(user)
  }

  signUp(signUpDTO: SignUpDTO): Promise<SignUpResult> {
    return signUp.execute(signUpDTO).catch((error) => {
      throw UserJSDataverseRepository.toSignUpError(error)
    })
  }

  getOrcidSignUpAuthorizationUrl(redirectUri: string): Promise<string> {
    return getOrcidSignUpAuthorizationUrl.execute(redirectUri).catch((error) => {
      throw UserJSDataverseRepository.toSignUpError(error)
    })
  }

  async connectOrcidForSignUp(callback: OrcidSignUpCallbackDTO): Promise<OrcidSignUpConnection> {
    try {
      const response = await axiosInstance.post<{ data: OrcidSignUpConnection }>(
        '/api/users/signup/orcid',
        callback,
        { excludeToken: true }
      )
      return response.data.data
    } catch (error) {
      throw UserJSDataverseRepository.toSignUpError(error)
    }
  }

  getAuthenticatedOrcid(): Promise<string | null> {
    return getCurrentAuthenticatedUser
      .execute()
      .then((authenticatedUser: AuthenticatedUser) => authenticatedUser.authenticatedOrcid ?? null)
  }

  private static toSignUpError(error: unknown): unknown {
    if (error instanceof WriteError || error instanceof ReadError) {
      return new SignUpError(
        new JSDataverseWriteErrorHandler(error).getReasonWithoutStatusCode() ?? error.message,
        error.fieldErrors ?? {}
      )
    }
    if (isAxiosError<SignUpErrorPayload>(error) && error.response) {
      return new SignUpError(
        error.response.data?.message ?? error.message,
        error.response.data?.fieldErrors ?? {}
      )
    }
    return error
  }
}

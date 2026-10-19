import { User } from '../../domain/models/User'
import { TokenInfo } from '../../domain/models/TokenInfo'
import { UserRepository } from '../../domain/repositories/UserRepository'
import {
  AuthenticatedUser,
  getCurrentAuthenticatedUser,
  getCurrentApiToken,
  recreateCurrentApiToken,
  deleteCurrentApiToken,
  registerUser
} from '@iqss/dataverse-client-javascript'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { JSUserMapper } from '../mappers/JSUserMapper'
import { isAxiosError } from 'axios'
import { axiosInstance } from '@/axiosInstance'
import { UserDTO } from '@/users/domain/useCases/DTOs/UserDTO'
import { SignUpDTO } from '@/users/domain/useCases/DTOs/SignUpDTO'
import { SignUpResult } from '@/users/domain/models/SignUpResult'
import { SignUpError } from '@/users/domain/models/SignUpError'

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

  async signUp(signUpDTO: SignUpDTO): Promise<SignUpResult> {
    try {
      const response = await axiosInstance.post<{ data?: { identifier?: string } }>(
        '/api/users/signup',
        signUpDTO,
        { excludeToken: true }
      )

      if (response.status === 202) {
        return { status: 'pending' }
      }

      return { status: 'created', identifier: response.data.data?.identifier ?? '' }
    } catch (error) {
      if (isAxiosError<SignUpErrorPayload>(error) && error.response) {
        throw new SignUpError(
          error.response.data?.message ?? error.message,
          error.response.data?.fieldErrors ?? {}
        )
      }
      throw error
    }
  }
}

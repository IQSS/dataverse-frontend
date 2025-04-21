import { User } from '../models/User'
import { TokenInfo } from '../.././domain/models/TokenInfo'
import { UserDTO } from '../useCases/DTOs/UserDTO'

export interface UserRepository {
  getAuthenticated: () => Promise<User>
  getCurrentApiToken: () => Promise<TokenInfo>
  recreateApiToken: () => Promise<TokenInfo>
  deleteApiToken: () => Promise<void>
  register: (user: UserDTO) => Promise<void>
}

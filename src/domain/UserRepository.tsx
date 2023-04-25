import { User } from './User'

export interface UserRepository {
  getAuthenticated(): Promise<User>
  removeAuthenticated(): Promise<void>
}

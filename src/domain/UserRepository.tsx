import { User } from './User'

export interface UserRepository {
  getAuthenticated(): Promise<User | void>
  removeAuthenticated(): Promise<void>
}

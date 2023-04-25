import { User } from '../models/User'

export interface UserRepository {
  getAuthenticated(): Promise<User | void>
  removeAuthenticated(): Promise<void>
}

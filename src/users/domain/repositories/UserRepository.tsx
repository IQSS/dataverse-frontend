import { User } from '../models/User'

export interface UserRepository {
  getAuthenticated: () => Promise<User>
  removeAuthenticated: () => Promise<void>
}

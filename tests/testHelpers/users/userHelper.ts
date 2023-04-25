import { User } from '../../../src/domain/User'

export const createTestUser = (): User => {
  return {
    name: 'Test User'
  }
}

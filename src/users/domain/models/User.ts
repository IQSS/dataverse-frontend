export interface User {
  displayName: string
  persistentId: string
  superuser: boolean
  firstName: string
  lastName: string
  email: string
  identifier: string
  affiliation?: string
}

import { AuthenticatedUser } from 'js-dataverse/dist/users'

export interface GetCurrentAuthenticatedUser {
  execute(): Promise<AuthenticatedUser>
}

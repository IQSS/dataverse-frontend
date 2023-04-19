import { AuthenticatedUser } from 'js-dataverse/dist/users'

export const createAuthenticatedUser = (): AuthenticatedUser => {
  return {
    id: 1,
    persistentUserId: 'Test',
    identifier: '@Test',
    displayName: 'Test User',
    firstName: 'Testname',
    lastName: 'Testlastname',
    email: 'testuser@dataverse.org',
    superuser: false,
    deactivated: false,
    createdTime: '2023-04-14T11:52:28Z',
    authenticationProviderId: 'builtin',
    lastLoginTime: '2023-04-14T11:52:28Z',
    lastApiUseTime: '2023-04-14T15:53:32Z'
  }
}

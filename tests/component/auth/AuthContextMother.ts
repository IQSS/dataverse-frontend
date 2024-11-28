export class AuthContextMother {
  static createToken() {
    return 'some.fake.token'
  }

  static createTokenData() {
    return {
      exp: 1732803352,
      iat: 1732803052,
      auth_time: 1732799407,
      jti: 'some-fake-jti-number',
      iss: 'http://localhost:8000/realms/test',
      aud: 'account',
      sub: 'some-fake-sub-number',
      typ: 'Bearer',
      azp: 'test',
      session_state: 'some-fake-session-state-number',
      acr: '0',
      realm_access: {
        roles: ['default-roles-test', 'offline_access', 'uma_authorization']
      },
      resource_access: {
        account: {
          roles: ['manage-account', 'manage-account-links', 'view-profile']
        }
      },
      scope: 'openid profile email',
      sid: 'some-fake-sid-number',
      email_verified: true,
      name: 'Dataverse User',
      preferred_username: 'user',
      given_name: 'Dataverse',
      family_name: 'User',
      email: 'dataverse-user@mailinator.com'
    }
  }
}

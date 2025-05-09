export type FakeTokenData = {
  name: string
  preferred_username: string
  given_name: string
  family_name: string
  email: string
  email_verified: boolean
  exp: number
  iat: number
  auth_time: number
  jti: string
  iss: string
  aud: string
  sub: string
  typ: string
  azp: string
  session_state: string
  acr: string
  realm_access: {
    roles: string[]
  }
  resource_access: {
    account: {
      roles: string[]
    }
  }
  scope: string
  sid: string
}

export class AuthContextMother {
  static createToken() {
    return 'some.fake.token'
  }

  static createTokenData(props?: Partial<FakeTokenData>): FakeTokenData {
    return {
      name: 'Dataverse User',
      preferred_username: 'user',
      given_name: 'Dataverse',
      family_name: 'User',
      email: 'dataverse-user@mailinator.com',
      email_verified: true,
      exp: 1732803352,
      iat: 1732803052,
      auth_time: 1732799407,
      jti: 'some-fake-jti-number',
      iss: 'https://localhost/realms/test',
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
      ...props
    }
  }

  static createTokenDataWithNoUsernameEmailFirstnameAndLastname(
    props?: Partial<
      Omit<FakeTokenData, 'preferred_username' | 'email' | 'given_name' | 'family_name'>
    >
  ): Omit<FakeTokenData, 'preferred_username' | 'email' | 'given_name' | 'family_name'> {
    return {
      name: 'Dataverse User',
      email_verified: true,
      exp: 1732803352,
      iat: 1732803052,
      auth_time: 1732799407,
      jti: 'some-fake-jti-number',
      iss: 'https://localhost/realms/test',
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
      ...props
    }
  }
}

export interface ValidTokenNotLinkedAccountFormData {
  username: string
  firstName: string
  lastName: string
  emailAddress: string
  position: string
  affiliation: string
  termsAccepted: boolean
}

// This enum is based only on some of the standard claims according to the official openId documentation
// https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims

export enum OIDC_STANDARD_CLAIMS {
  GIVEN_NAME = 'given_name',
  FAMILY_NAME = 'family_name',
  PREFERRED_USERNAME = 'preferred_username',
  EMAIL = 'email'
}

export type OptionalExceptFor<T, TRequired extends keyof T> = Partial<T> & Pick<T, TRequired>

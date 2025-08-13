import { type TTokenData } from 'react-oauth2-code-pkce/dist/types'
import {
  OIDC_STANDARD_CLAIMS,
  OptionalExceptFor,
  ValidTokenNotLinkedAccountFormData
} from './types'

export class ValidTokenNotLinkedAccountFormHelper {
  public static getTokenDataValue<T>(
    key: string,
    expectedType: 'string' | 'number' | 'boolean' | 'object',
    tokenData?: TTokenData
  ): T | undefined {
    if (!tokenData) {
      return undefined
    }

    if (!(key in tokenData)) {
      return undefined
    }

    const value = tokenData[key] as unknown

    if (typeof value !== expectedType) {
      console.error(
        `Expected token data key: ${key} to be of type ${expectedType} but got ${typeof value}`
      )
      return undefined
    }

    return value as T
  }

  public static defineRegistrationDTOProperties(
    formData: ValidTokenNotLinkedAccountFormData,
    tokenData?: TTokenData
  ) {
    const registrationDTO: OptionalExceptFor<ValidTokenNotLinkedAccountFormData, 'termsAccepted'> =
      {
        termsAccepted: formData.termsAccepted
      }

    // This will be a weird scenario, not having tokenData from the access token
    if (!tokenData) {
      registrationDTO.username = formData.username
      registrationDTO.firstName = formData.firstName
      registrationDTO.lastName = formData.lastName
      registrationDTO.emailAddress = formData.emailAddress
      registrationDTO.position = formData.position
      registrationDTO.affiliation = formData.affiliation

      return registrationDTO
    }

    // If properties are in the tokenData then dont send them at all

    if (OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME in tokenData === false) {
      registrationDTO.username = formData.username
    }

    if (OIDC_STANDARD_CLAIMS.GIVEN_NAME in tokenData === false) {
      registrationDTO.firstName = formData.firstName
    }

    if (OIDC_STANDARD_CLAIMS.FAMILY_NAME in tokenData === false) {
      registrationDTO.lastName = formData.lastName
    }

    if (OIDC_STANDARD_CLAIMS.EMAIL in tokenData === false) {
      registrationDTO.emailAddress = formData.emailAddress
    }

    if (formData.affiliation) {
      registrationDTO.affiliation = formData.affiliation
    }

    if (formData.position) {
      registrationDTO.position = formData.position
    }

    return registrationDTO
  }
}

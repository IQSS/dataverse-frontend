import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { OIDC_STANDARD_CLAIMS, type ValidTokenNotLinkedAccountFormData } from './types'
import { FormFields } from './FormFields'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'

export const ValidTokenNotLinkedAccountForm = () => {
  const { tokenData } = useContext(AuthContext)

  const defaultUserName =
    ValidTokenNotLinkedAccountFormHelper.getTokenDataValue<string>(
      OIDC_STANDARD_CLAIMS.PREFERRED_USERNAME,
      'string',
      tokenData
    ) ?? ''

  const defaultFirstName =
    ValidTokenNotLinkedAccountFormHelper.getTokenDataValue<string>(
      OIDC_STANDARD_CLAIMS.GIVEN_NAME,
      'string',
      tokenData
    ) ?? ''

  const defaultLastName =
    ValidTokenNotLinkedAccountFormHelper.getTokenDataValue<string>(
      OIDC_STANDARD_CLAIMS.FAMILY_NAME,
      'string',
      tokenData
    ) ?? ''

  const defaultEmail =
    ValidTokenNotLinkedAccountFormHelper.getTokenDataValue<string>(
      OIDC_STANDARD_CLAIMS.EMAIL,
      'string',
      tokenData
    ) ?? ''

  const formDefaultValues: ValidTokenNotLinkedAccountFormData = {
    username: defaultUserName,
    firstName: defaultFirstName,
    lastName: defaultLastName,
    emailAddress: defaultEmail,
    position: '',
    affiliation: '',
    termsAccepted: false
  }

  return <FormFields formDefaultValues={formDefaultValues} />
}

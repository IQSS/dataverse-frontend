import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
// import { useGetApiTermsOfUse } from '@/shared/hooks/useGetApiTermsOfUse'
import { OIDC_STANDARD_CLAIMS, type ValidTokenNotLinkedAccountFormData } from './types'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'
import { FormFields } from './FormFields'
// import { FormFieldsSkeleton } from './FormFieldsSkeleton'

interface ValidTokenNotLinkedAccountFormProps {
  userRepository: UserRepository
}

export const ValidTokenNotLinkedAccountForm = ({
  userRepository
}: ValidTokenNotLinkedAccountFormProps) => {
  const { tokenData } = useContext(AuthContext)

  // TODO - Change for application terms of use when available in API 👇
  // const { termsOfUse, isLoading: isLoadingTermsOfUse } =
  //   useGetApiTermsOfUse(dataverseInfoRepository)

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

  // if (isLoadingTermsOfUse) {
  //   return <FormFieldsSkeleton />
  // }

  return (
    <FormFields
      userRepository={userRepository}
      formDefaultValues={formDefaultValues}
      termsOfUse=""
    />
  )
}

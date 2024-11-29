import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { useGetTermsOfUse } from '@/shared/hooks/useGetTermsOfUse'
import { OIDC_STANDARD_CLAIMS, type ValidTokenNotLinkedAccountFormData } from './types'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'
import { FormFields } from './FormFields'
import { FormFieldsSkeleton } from './FormFieldsSkeleton'

interface ValidTokenNotLinkedAccountFormProps {
  dataverseInfoRepository: DataverseInfoRepository
  userRepository: UserRepository
}

export const ValidTokenNotLinkedAccountForm = ({
  userRepository,
  dataverseInfoRepository
}: ValidTokenNotLinkedAccountFormProps) => {
  const { tokenData } = useContext(AuthContext)
  const { termsOfUse, isLoading: isLoadingTermsOfUse } = useGetTermsOfUse(dataverseInfoRepository)

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

  if (isLoadingTermsOfUse) {
    return <FormFieldsSkeleton />
  }

  return (
    <FormFields
      userRepository={userRepository}
      formDefaultValues={formDefaultValues}
      termsOfUse={termsOfUse}
    />
  )
}

import { useContext } from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { Alert } from '@iqss/dataverse-design-system'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { useGetTermsOfUse } from '@/shared/hooks/useGetTermsOfUse'
import { OIDC_STANDARD_CLAIMS, type ValidTokenNotLinkedAccountFormData } from './types'
import { ValidTokenNotLinkedAccountFormHelper } from './ValidTokenNotLinkedAccountFormHelper'
import { FormFields } from './FormFields'
import { FormFieldsSkeleton } from './FormFieldsSkeleton'

interface ValidTokenNotLinkedAccountFormProps {
  userRepository: UserRepository
  dataverseInfoRepository: DataverseInfoRepository
}

export const ValidTokenNotLinkedAccountForm = ({
  userRepository,
  dataverseInfoRepository
}: ValidTokenNotLinkedAccountFormProps) => {
  const { tokenData } = useContext(AuthContext)

  const {
    termsOfUse,
    isLoading: isLoadingTermsOfUse,
    error: errorTermsOfUse
  } = useGetTermsOfUse(dataverseInfoRepository)

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

  if (errorTermsOfUse) {
    return <Alert variant="danger">{errorTermsOfUse}</Alert>
  }

  return (
    <FormFields
      userRepository={userRepository}
      formDefaultValues={formDefaultValues}
      termsOfUse={termsOfUse}
    />
  )
}

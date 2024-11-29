import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SignUp } from './SignUp'
import { QueryParamKey } from '../Route.enum'
import { DataverseInfoJSDataverseRepository } from '@/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'

const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
const userRepository = new UserJSDataverseRepository()

export class SignUpFactory {
  static create(): ReactElement {
    return <SignUpWithSearchParams />
  }
}

function SignUpWithSearchParams() {
  const [searchParams] = useSearchParams()

  const hasValidTokenButNotLinkedAccount =
    searchParams.get(QueryParamKey.VALID_TOKEN_BUT_NOT_LINKED_ACCOUNT) === 'true'

  return (
    <SignUp
      dataverseInfoRepository={dataverseInfoRepository}
      userRepository={userRepository}
      hasValidTokenButNotLinkedAccount={hasValidTokenButNotLinkedAccount}
    />
  )
}

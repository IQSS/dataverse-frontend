import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SignUp } from './SignUp'

export class SignUpFactory {
  static create(): ReactElement {
    return <SignUpWithSearchParams />
  }
}

function SignUpWithSearchParams() {
  const [searchParams] = useSearchParams()

  const isValidTokenButNotLinkedAccount =
    searchParams.get('validTokenButNotLinkedAccount') === 'true'

  return <SignUp validTokenButNotLinkedAccount={isValidTokenButNotLinkedAccount} />
}

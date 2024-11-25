// TODO:ME - Create form to sign up
// TODO:ME - Show alert indicating the user that the token is valid but there is no linked account
// TODO:ME - Explain about using data from the token to prefill the form and why it is readonly some fields
// TODO:ME - Check tokenData to see which token data is available to prefill the form and make them readonly

interface SignUpProps {
  validTokenButNotLinkedAccount: boolean
}

export const SignUp = ({ validTokenButNotLinkedAccount }: SignUpProps) => {
  console.log({ validTokenButNotLinkedAccount })

  return (
    <div>
      <h1>Sign Up</h1>
      <p>Valid token but not linked account : {validTokenButNotLinkedAccount}</p>
    </div>
  )
}

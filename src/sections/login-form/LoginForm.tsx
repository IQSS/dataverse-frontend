import React, { useState } from 'react'
import { InputField } from '../input-field/InputField'
import { SubmitButton } from '../submit-button/SubmitButton'

interface LoginFormProps {
  onLogin: ({ username, password }: { username: string; password: string }) => void
  title?: string
  errorMessage?: string
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  title = 'Log In',
  errorMessage
}) => {
  const [submitted, setSubmitted] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleFormSubmit = (event: React.FormEvent) => {
    console.log('clicked submit')
    event.preventDefault()
    if (username && password) {
      onLogin({ username, password })
    }
    setSubmitted(true)
  }

  return (
    <div className="max-w-screen-sm p-12 mx-auto bg-gray-50 rounded-md shadow-lg">
      <form data-testid="login-test" className="flex flex-col" onSubmit={handleFormSubmit}>
        <fieldset>
          <legend className="text-3xl text-gray-800 mb-4">{title}</legend>
          <InputField
            name="username"
            type="text"
            label="Username"
            submitted={submitted}
            requiredMessage="Username is required"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            value={username}
            autoComplete="username"
          />
          <InputField
            name="password"
            type="password"
            label="Password"
            submitted={submitted}
            requiredMessage="Password is required"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            value={password}
            autoComplete="current-password"
          />
          <SubmitButton onClick={() => handleFormSubmit}>Login</SubmitButton>
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </fieldset>
      </form>
    </div>
  )
}

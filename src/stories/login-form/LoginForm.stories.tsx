import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm } from '../../sections/login-form/LoginForm'
import { userEvent, within } from '@storybook/testing-library'
import { expect } from '@storybook/jest'
const meta: Meta<typeof LoginForm> = {
  title: 'Pages/Login Form',
  component: LoginForm
}

export default meta
type Story = StoryObj<typeof LoginForm>

export const Basic: Story = {
  render: () => (
    <LoginForm
      onLogin={({ username, password }) =>
        console.log(`Logging in with username: ${username} and password: ${password}`)
      }
      title="Log In"
    />
  )
}

export const BasicPlusInteraction: Story = {
  render: () => (
    <LoginForm
      onLogin={({ username, password }) =>
        console.log(`Logging in with username: ${username} and password: ${password}`)
      }
      title="Log In"
    />
  ),
  // eslint-disable-next-line @typescript-eslint/require-await
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    console.log('test interaction: ')
    console.log(canvas)
    userEvent.click(canvas.getByTestId('login-test'))
    expect(canvas.getByTestId('login-test')).toBeInTheDocument()
    expect(canvas.getByText('Login')).toBeInTheDocument()
  }
}

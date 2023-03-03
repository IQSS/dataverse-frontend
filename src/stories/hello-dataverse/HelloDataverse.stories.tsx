import { StoryFn, Meta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'
import { WithI18next } from '../WithI18next'

export default {
  title: 'Hello Dataverse/Page',
  component: HelloDataverse,
  decorators: [WithI18next],
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<typeof HelloDataverse>

const Template: StoryFn<typeof HelloDataverse> = () => <HelloDataverse />

export const LoggedOut = Template.bind({})

export const LoggedIn = Template.bind({})

LoggedIn.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const loginButton = await canvas.findByRole('button', { name: /Log in/i })
  userEvent.click(loginButton)
}

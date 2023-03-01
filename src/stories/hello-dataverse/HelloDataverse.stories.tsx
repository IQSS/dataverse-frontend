import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'

export default {
  title: 'Hello Dataverse/Page',
  component: HelloDataverse,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof HelloDataverse>

const Template: ComponentStory<typeof HelloDataverse> = () => <HelloDataverse />

export const LoggedOut = Template.bind({})

export const LoggedIn = Template.bind({})

LoggedIn.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const loginButton = canvas.getByRole('button', { name: /Log in/i })
  userEvent.click(loginButton)
}

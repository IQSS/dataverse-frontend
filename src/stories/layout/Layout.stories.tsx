import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Layout } from '../../sections/layout/Layout'
import { userEvent, within } from '@storybook/testing-library'

export default {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = () => <Layout />

export const LoggedOut = Template.bind({})

export const LoggedIn = Template.bind({})

LoggedIn.play = ({ canvasElement }) => {
  const canvas = within(canvasElement)
  const loginButton = canvas.getByRole('button', { name: /Log in/i })
  userEvent.click(loginButton)
}

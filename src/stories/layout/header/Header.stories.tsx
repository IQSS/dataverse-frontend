import { StoryFn, Meta } from '@storybook/react'
import { Header } from '../../../sections/layout/header/Header'

export default {
  title: 'Layout/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<typeof Header>

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />

export const LoggedIn = Template.bind({})
LoggedIn.args = {
  user: {
    name: 'Jane Doe'
  }
}

export const LoggedOut = Template.bind({})
LoggedOut.args = {}

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { within, userEvent } from '@storybook/testing-library'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'
import { WithLayout } from '../WithLayout'

export default {
  title: 'Hello Dataverse/Page',
  component: HelloDataverse,
  decorators: [WithLayout],
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof HelloDataverse>

const Template: ComponentStory<typeof HelloDataverse> = () => <HelloDataverse />

export const LoggedOut = Template.bind({})

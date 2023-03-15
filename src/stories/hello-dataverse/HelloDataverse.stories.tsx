import { StoryFn, Meta } from '@storybook/react'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'

export default {
  title: 'Pages/Hello Dataverse',
  component: HelloDataverse,
  decorators: [WithI18next, WithLayout],
  parameters: {
    layout: 'fullscreen'
  }
} as Meta<typeof HelloDataverse>

const Template: StoryFn<typeof HelloDataverse> = () => <HelloDataverse />

export const Default = Template.bind({})

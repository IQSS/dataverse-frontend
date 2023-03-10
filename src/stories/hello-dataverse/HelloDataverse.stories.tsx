import { ComponentStory, ComponentMeta } from '@storybook/react'
import { HelloDataverse } from '../../sections/hello-dataverse/HelloDataverse'
import { WithLayout } from '../WithLayout'

export default {
  title: 'Pages/Hello Dataverse',
  component: HelloDataverse,
  decorators: [WithLayout],
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof HelloDataverse>

const Template: ComponentStory<typeof HelloDataverse> = () => <HelloDataverse />

export const Default = Template.bind({})

import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Layout } from '../../sections/layout/Layout'

export default {
  title: 'Layout/Layout',
  component: Layout,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Layout>

const Template: ComponentStory<typeof Layout> = () => <Layout />

export const Default = Template.bind({})

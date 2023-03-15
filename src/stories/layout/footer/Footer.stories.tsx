import { ComponentMeta, ComponentStory } from '@storybook/react'
import { Footer } from '../../../sections/layout/footer/Footer'

export default {
  title: 'Layout/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Footer>

const Template: ComponentStory<typeof Footer> = () => <Footer />

export const Default = Template.bind({})

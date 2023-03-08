import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Navbar } from '../../../sections/ui/navbar/Navbar'
import logo from '../../../sections/ui/logo.svg'

export default {
  title: 'UI/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen'
  }
} as ComponentMeta<typeof Navbar>

const Template: ComponentStory<typeof Navbar> = (args) => <Navbar {...args} />

export const Example = Template.bind({})
Example.args = {
  brand: { logo: { src: logo, altText: 'logo' }, link: { title: 'Brand Title', path: '#' } },
  links: [
    { title: 'Link 1 ', path: '#' },
    { title: 'Link 2', path: '#' },
    { title: 'Link 3', path: '#' }
  ]
}

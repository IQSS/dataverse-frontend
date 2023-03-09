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
  brand: { logo: { src: logo, altText: 'logo' }, title: 'Brand Title', path: '#' },
  links: [
    { title: 'Link 1 ', value: '#' },
    { title: 'Link 2', value: '#' },
    {
      title: 'Dropdown 1',
      value: [
        { title: 'Link 3 ', value: '#' },
        { title: 'Link 4', value: '#' }
      ]
    },
    {
      title: 'Dropdown 2',
      value: [
        { title: 'Link 5 ', value: '#' },
        { title: 'Link 6', value: '#' }
      ]
    }
  ]
}

import { StoryFn, Meta } from '@storybook/react'
import { Button } from '../../sections/shared/Button'

export default {
  title: 'Shared/Button',
  component: Button,
  argTypes: {
    backgroundColor: { control: 'color' }
  }
} as Meta<typeof Button>

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />

export const Primary = Template.bind({})
Primary.args = {
  label: 'Button'
}

export const Secondary = Template.bind({})
Secondary.args = {
  secondary: true,
  label: 'Button'
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'Button'
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'Button'
}

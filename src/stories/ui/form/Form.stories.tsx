import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '../../../sections/ui/form/Form'

const meta: Meta<typeof Form> = {
  title: 'UI/Form',
  component: Form,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Form>

export const Default: Story = {
  render: () => (
    <Form>
      <Form.Group>
        <Form.Group.Label>Username</Form.Group.Label>
        <Form.Group.Input type="text" placeholder="username" />
      </Form.Group>
      <Form.Group>
        <Form.Group.Label>Email</Form.Group.Label>
        <Form.Group.Input type="email" placeholder="email" />
      </Form.Group>
      <Form.Group>
        <Form.Group.Label>Password</Form.Group.Label>
        <Form.Group.Input type="password" placeholder="password" />
      </Form.Group>
    </Form>
  )
}

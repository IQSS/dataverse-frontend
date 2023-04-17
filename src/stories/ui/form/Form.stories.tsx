import type { Meta, StoryObj } from '@storybook/react'
import { Form } from '../../../sections/ui/form/Form'

/**
 * ## Description
 * A form is a collection of HTML elements used to gather user input. Allows users to enter data, such as text, numbers,
 * or file uploads, and submit it to a server for processing.
 *
 * ## Usage guidelines
 * ### Dos
 * - Input labels:
 *   - Each input field should have a label
 *   - Labels should be short and descriptive
 *   - They should be placed above the input field
 * - Input text:
 *  - If you need to describe an input text you can use the `Form.Group.Text` component
 *  - Add the text below the input
 * - Select:
 *  - First option should be the 'Select...' option
 *  - The options should use the <option> tag
 *
 * ### Don'ts
 * - Leave inputs without labels
 */
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
      <Form.Group controlId="basic-form-username">
        <Form.Group.Label>Username</Form.Group.Label>
        <Form.Group.Input type="text" placeholder="Username" />
      </Form.Group>
      <Form.Group controlId="basic-form-email">
        <Form.Group.Label>Email</Form.Group.Label>
        <Form.Group.Input type="email" placeholder="Email" />
      </Form.Group>
      <Form.Group controlId="basic-form-password">
        <Form.Group.Label>Password</Form.Group.Label>
        <Form.Group.Input type="password" placeholder="Password" />
      </Form.Group>
    </Form>
  )
}
export const InputWithText: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-username">
        <Form.Group.Label>Username</Form.Group.Label>
        <Form.Group.Input type="text" placeholder="Username" />
        <Form.Group.Text>
          Create a valid username of 2 to 60 characters in length containing letters (a-Z), numbers
          (0-9), dashes (-), underscores (_), and periods (.).
        </Form.Group.Text>
      </Form.Group>
    </Form>
  )
}

export const RequiredInput: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-email" required>
        <Form.Group.Label>Email</Form.Group.Label>
        <Form.Group.Input type="email" placeholder="Email" />
      </Form.Group>
    </Form>
  )
}

export const Select: Story = {
  render: () => (
    <Form>
      <Form.Group controlId="basic-form-select">
        <Form.Group.Label>Selector</Form.Group.Label>
        <Form.Group.Select>
          <option>Select...</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </Form.Group.Select>
      </Form.Group>
    </Form>
  )
}

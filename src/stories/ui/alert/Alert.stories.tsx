import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../../../sections/layout/alert/Alert'
import { AlertLink } from '../../../sections/layout/alert/AlertLink'

const meta: Meta<typeof Alert> = {
  title: 'Layout/Alert',
  component: Alert
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => (
    <Alert variant="success">
      <b>Success!</b> This is a detailed message.
    </Alert>
  )
}
export const WithLink: Story = {
  render: () => (
    <Alert variant="success">
      Link with message <AlertLink href="#" link="here is a link"></AlertLink>
    </Alert>
  )
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <Alert variant="success">
        <b>Success!</b> This is a detailed message.
      </Alert>
      <Alert variant="info">
        <b>Information</b> This is a detailed message.
      </Alert>
      <Alert variant="warning">
        <b>Warning</b> This is a detailed message.
      </Alert>
      <Alert variant="danger">
        <b>Error!</b> This is a detailed message.
      </Alert>
    </>
  )
}

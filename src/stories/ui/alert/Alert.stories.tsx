import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from '../../../sections/layout/alert/Alert'

/**
 * ## Description
 * This component is for notifications based on user actions.
 * The type of message is controlled by the variant property.
 *
 * To include a link in the message, use the AlertLink component, which will style
 * link in the same colors as the alert message.
 *
 * By default, the Alert message is dismissible, make it not dismissible
 * by setting dismissible={false}.
 *
 *
 */
const meta: Meta<typeof Alert> = {
  title: 'Layout/Alert',
  component: Alert,
  tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
  render: () => <Alert variant="success">This is a detailed message.</Alert>
}
export const WithLink: Story = {
  render: () => (
    <Alert variant="success">
      Link with message <Alert.Link href="#" link="here is a link"></Alert.Link>
    </Alert>
  )
}
export const NotDismissible: Story = {
  render: () => (
    <Alert variant="info" dismissible={false}>
      This alert is not dismissible.
    </Alert>
  )
}

export const CustomHeading: Story = {
  render: () => (
    <Alert variant="info" customHeading="Something Happened!">
      This alert has a custom heading.
    </Alert>
  )
}
export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <Alert variant="success">This is a detailed message.</Alert>
      <Alert variant="info">This is a detailed message.</Alert>
      <Alert variant="warning">This is a detailed message.</Alert>
      <Alert variant="danger">This is a detailed message.</Alert>
    </>
  )
}

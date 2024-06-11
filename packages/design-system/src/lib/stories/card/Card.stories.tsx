import type { Meta, StoryObj } from '@storybook/react'
import { Card } from '../../components/card/Card'

const meta: Meta<typeof Card> = {
  title: 'Card',
  component: Card
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
  render: () => (
    <Card>
      <Card.Header>Header</Card.Header>
      <Card.Body>Body containing content.</Card.Body>
    </Card>
  )
}

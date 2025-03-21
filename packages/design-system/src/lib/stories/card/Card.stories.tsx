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
    <Card style={{ width: '18rem' }}>
      <Card.Header>Header</Card.Header>
      <Card.Body>Body containing content.</Card.Body>
    </Card>
  )
}

export const WithTopImage: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <Card.Image src="https://placehold.co/600x400" alt="Placeholder image" variant="top" />
      <Card.Body>Body containing content.</Card.Body>
    </Card>
  )
}

export const WithBottomImage: Story = {
  render: () => (
    <Card style={{ width: '18rem' }}>
      <Card.Body>Body containing content.</Card.Body>
      <Card.Image src="https://placehold.co/600x400" alt="Placeholder image" variant="bottom" />
    </Card>
  )
}

export const AllBordersAtAGlance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card style={{ width: '18rem' }}>
        <Card.Header>Default</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="primary" style={{ width: '18rem' }}>
        <Card.Header>Primary</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="secondary" style={{ width: '18rem' }}>
        <Card.Header>Secondary</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="success" style={{ width: '18rem' }}>
        <Card.Header>Success</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="danger" style={{ width: '18rem' }}>
        <Card.Header>Danger</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="warning" style={{ width: '18rem' }}>
        <Card.Header>Warning</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card border="info" style={{ width: '18rem' }}>
        <Card.Header>Info</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
    </div>
  )
}

export const AllBackgroundsAtAGlance: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card bg="primary" text="white" style={{ width: '18rem' }}>
        <Card.Header>Primary</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card bg="secondary" style={{ width: '18rem' }}>
        <Card.Header>Secondary</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card bg="success" text="white" style={{ width: '18rem' }}>
        <Card.Header>Success</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card bg="danger" text="white" style={{ width: '18rem' }}>
        <Card.Header>Danger</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card bg="warning" text="white" style={{ width: '18rem' }}>
        <Card.Header>Warning</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
      <Card bg="info" text="white" style={{ width: '18rem' }}>
        <Card.Header>Info</Card.Header>
        <Card.Body>Body containing content.</Card.Body>
      </Card>
    </div>
  )
}

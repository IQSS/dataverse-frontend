import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../../components/badge/Badge'

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
  render: () => <Badge variant="primary">Badge</Badge>
}

export const AllVariantsAtAGlance: Story = {
  render: () => (
    <>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </>
  )
}

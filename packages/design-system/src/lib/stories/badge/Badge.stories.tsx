import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from '../../components/badge/Badge'

const meta: Meta<typeof Badge> = {
  title: 'Badge',
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

export const WithPillShape: Story = {
  render: () => (
    <>
      <Badge variant="primary" pill>
        Primary
      </Badge>
      <Badge variant="secondary" pill>
        Secondary
      </Badge>
      <Badge variant="success" pill>
        Success
      </Badge>
      <Badge variant="danger" pill>
        Danger
      </Badge>
      <Badge variant="warning" pill>
        Warning
      </Badge>
      <Badge variant="info" pill>
        Info
      </Badge>
    </>
  )
}

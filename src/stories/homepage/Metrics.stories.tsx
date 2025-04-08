import { Metrics } from '@/sections/homepage/metrics/Metrics'
import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DataverseHubMockRepository } from '../dataverse-hub/DataverseHubMockRepository'
import { DataverseHubLoadingMockRepository } from '../dataverse-hub/DataverseHubLoadingMockRepository'

const meta: Meta<typeof Metrics> = {
  title: 'Sections/Homepage/Metrics',
  component: Metrics,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Metrics>

export const Default: Story = {
  render: () => <Metrics dataverseHubRepository={new DataverseHubMockRepository()} />
}

export const Loading: Story = {
  render: () => <Metrics dataverseHubRepository={new DataverseHubLoadingMockRepository()} />
}

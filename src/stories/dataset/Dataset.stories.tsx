import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { Dataset } from '../../sections/dataset/Dataset'
import { WithLayoutLoading } from '../WithLayoutLoading'
import { WithAnonymizedView } from './WithAnonymizedView'
import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetMockNoDataRepository } from './DatasetMockNoDataRepository'
import { WithCitationMetadataBlockInfo } from './WithCitationMetadataBlockInfo'

const meta: Meta<typeof Dataset> = {
  title: 'Pages/Dataset',
  component: Dataset,
  decorators: [WithI18next, WithCitationMetadataBlockInfo],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Dataset>

export const Default: Story = {
  decorators: [WithLayout],
  render: () => (
    <Dataset
      repository={new DatasetMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const Loading: Story = {
  decorators: [WithLayoutLoading],
  render: () => (
    <Dataset
      repository={new DatasetMockRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const DatasetNotFound: Story = {
  decorators: [WithLayout],
  render: () => (
    <Dataset
      repository={new DatasetMockNoDataRepository()}
      searchParams={{ persistentId: 'doi:10.5082/FK2/ABC123' }}
    />
  )
}

export const DatasetAnonymizedView: Story = {
  decorators: [WithLayout, WithAnonymizedView],
  render: () => (
    <Dataset
      repository={new DatasetMockRepository()}
      searchParams={{ privateUrlToken: '123456' }}
    />
  )
}

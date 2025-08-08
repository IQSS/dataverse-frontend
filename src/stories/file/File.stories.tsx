import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../sections/file/File'
import { WithLayout } from '../WithLayout'
import { FileMockLoadingRepository } from './FileMockLoadingRepository'
import { FileMockNoDataRepository } from './FileMockNoDataRepository'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'

const meta: Meta<typeof File> = {
  title: 'Pages/File',
  component: File,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof File>

export const Default: Story = {
  render: () => (
    <File
      repository={new FileMockRepository()}
      id={56}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const Restricted: Story = {
  render: () => (
    <File
      repository={new FileMockRepository(FileMother.createRestricted())}
      id={56}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const RestrictedWithAccessGranted: Story = {
  render: () => (
    <File
      repository={new FileMockRepository(FileMother.createRestrictedWithAccessGranted())}
      id={56}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <File
      repository={new FileMockLoadingRepository()}
      id={56}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const FileNotFound: Story = {
  render: () => (
    <File
      repository={new FileMockNoDataRepository()}
      id={56}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../sections/file/File'
import { WithLayout } from '../WithLayout'
import { FileMockLoadingRepository } from './FileMockLoadingRepository'
import { FileMockNoDataRepository } from './FileMockNoDataRepository'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMockRepository } from '../shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'

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
      datasetRepository={new DatasetMockRepository()}
      id={56}
    />
  )
}

export const Restricted: Story = {
  render: () => (
    <File
      repository={new FileMockRepository(FileMother.createRestricted())}
      datasetRepository={new DatasetMockRepository()}
      id={56}
    />
  )
}

export const RestrictedWithAccessGranted: Story = {
  render: () => (
    <File
      repository={new FileMockRepository(FileMother.createRestrictedWithAccessGranted())}
      datasetRepository={new DatasetMockRepository()}
      id={56}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <File
      repository={new FileMockLoadingRepository()}
      datasetRepository={new DatasetMockRepository()}
      id={56}
    />
  )
}

export const FileNotFound: Story = {
  render: () => (
    <File
      repository={new FileMockNoDataRepository()}
      datasetRepository={new DatasetMockRepository()}
      id={56}
    />
  )
}

export const WithMultipleExternalTools: Story = {
  render: () => (
    <ExternalToolsProvider externalToolsRepository={new ExternalToolsMockRepository()}>
      <File
        repository={new FileMockRepository(FileMother.createRealistic())}
        datasetRepository={new DatasetMockRepository()}
        id={56}
        toolTypeSelectedQueryParam="preview"
      />
    </ExternalToolsProvider>
  )
}

const externalToolsRepositoryOnlyPreviewTool = new ExternalToolsMockRepository()
externalToolsRepositoryOnlyPreviewTool.getExternalTools = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([ExternalToolsMother.createFilePreviewTool()])
    }, FakerHelper.loadingTimout())
  })
}

export const WithOnlyOnePreviewExternalTool: Story = {
  render: () => (
    <ExternalToolsProvider externalToolsRepository={externalToolsRepositoryOnlyPreviewTool}>
      <File
        repository={new FileMockRepository(FileMother.createRealistic())}
        datasetRepository={new DatasetMockRepository()}
        id={56}
        toolTypeSelectedQueryParam="preview"
      />
    </ExternalToolsProvider>
  )
}

const externalToolsRepositoryOnlyQueryTool = new ExternalToolsMockRepository()
externalToolsRepositoryOnlyQueryTool.getExternalTools = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([ExternalToolsMother.createFileQueryTool()])
    }, FakerHelper.loadingTimout())
  })
}

export const WithOnlyOneQueryExternalTool: Story = {
  render: () => (
    <ExternalToolsProvider externalToolsRepository={externalToolsRepositoryOnlyQueryTool}>
      <File
        repository={new FileMockRepository(FileMother.createRealistic())}
        datasetRepository={new DatasetMockRepository()}
        id={56}
        toolTypeSelectedQueryParam="query"
      />
    </ExternalToolsProvider>
  )
}

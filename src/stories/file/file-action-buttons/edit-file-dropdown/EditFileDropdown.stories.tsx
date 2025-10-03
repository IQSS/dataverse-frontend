import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { EditFileMenu } from '@/sections/file/file-action-buttons/edit-file-menu/EditFileMenu'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FileMockRepository } from '../../FileMockRepository'
import { DatasetMockRepository } from '../../../dataset/DatasetMockRepository'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMockRepository } from '@/stories/shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

const storyFile = FileMother.createRealistic()

const meta: Meta<typeof EditFileMenu> = {
  title: 'Sections/File Page/Action Buttons/EditFileMenu',
  component: EditFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof EditFileMenu>

export const Default: Story = {
  render: () => (
    <EditFileMenu
      fileId={storyFile.id}
      fileRepository={new FileMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      isRestricted={false}
      datasetInfo={{
        persistentId: storyFile.datasetPersistentId,
        releasedVersionExists: false,
        versionNumber: storyFile.datasetVersion.number.toString(),
        requestAccess: true
      }}
      storageIdentifier="s3://10.5072/FK2/FNJFOR"
      isTabularFile={true}
      fileType={storyFile.metadata.type.value}
    />
  )
}

const externalToolsRepositoryWithFileConfigureTool = new ExternalToolsMockRepository()
externalToolsRepositoryWithFileConfigureTool.getExternalTools = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([ExternalToolsMother.createFileConfigureTool()])
    }, FakerHelper.loadingTimout())
  })
}

export const WithConfigureToolOption: Story = {
  render: () => (
    <ExternalToolsProvider externalToolsRepository={externalToolsRepositoryWithFileConfigureTool}>
      <EditFileMenu
        fileId={storyFile.id}
        fileRepository={new FileMockRepository()}
        datasetRepository={new DatasetMockRepository()}
        isRestricted={false}
        datasetInfo={{
          persistentId: storyFile.datasetPersistentId,
          releasedVersionExists: false,
          versionNumber: storyFile.datasetVersion.number.toString(),
          requestAccess: true
        }}
        storageIdentifier="s3://10.5072/FK2/FNJFOR"
        isTabularFile={true}
        fileType={storyFile.metadata.type.value}
      />
    </ExternalToolsProvider>
  )
}

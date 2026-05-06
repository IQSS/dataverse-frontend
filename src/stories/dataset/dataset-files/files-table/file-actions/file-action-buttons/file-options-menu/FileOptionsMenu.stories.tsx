import { Meta, StoryObj } from '@storybook/react'
import { FileOptionsMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { WithLoggedInUser } from '../../../../../../WithLoggedInUser'
import { WithDatasetAllPermissionsGranted } from '../../../../../WithDatasetAllPermissionsGranted'
import { WithDatasetLockedFromEdits } from '../../../../../WithDatasetLockedFromEdits'
import { FilePreviewMother } from '../../../../../../../../tests/component/files/domain/models/FilePreviewMother'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMockRepository } from '@/stories/shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { WithRepositories } from '@/stories/WithRepositories'

const meta: Meta<typeof FileOptionsMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/FileOptionsMenu',
  component: FileOptionsMenu,
  decorators: [
    WithI18next,
    WithSettings,
    WithLoggedInUser,
    WithRepositories({ datasetRepository: new DatasetMockRepository() })
  ]
}

export default meta
type Story = StoryObj<typeof FileOptionsMenu>

export const DefaultWithLoggedInUser: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => (
    <FileOptionsMenu
      file={FilePreviewMother.createDefault()}
      fileRepository={new FileMockRepository()}
    />
  )
}

export const Restricted: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => (
    <FileOptionsMenu
      file={FilePreviewMother.createRestricted()}
      fileRepository={new FileMockRepository()}
    />
  )
}

export const WithDatasetLocked: Story = {
  decorators: [WithDatasetLockedFromEdits],
  render: () => (
    <FileOptionsMenu
      file={FilePreviewMother.createDefault()}
      fileRepository={new FileMockRepository()}
    />
  )
}

export const WithFileAlreadyDeleted: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => (
    <FileOptionsMenu
      file={FilePreviewMother.createDeleted()}
      fileRepository={new FileMockRepository()}
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

export const WithConfigureTool: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => (
    <ExternalToolsProvider externalToolsRepository={externalToolsRepositoryWithFileConfigureTool}>
      <FileOptionsMenu
        file={FilePreviewMother.createDefault()}
        fileRepository={new FileMockRepository()}
      />
    </ExternalToolsProvider>
  )
}

//
// export const WithEmbargoAllowed: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }
//
// export const WithProvenanceEnabled: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }

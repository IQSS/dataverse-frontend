import { StoryFn } from '@storybook/react'
import { FilePermissionsProvider } from '../../../sections/file/file-permissions/FilePermissionsProvider'
import { FileMockRepository } from '../FileMockRepository'

export const WithFilePermissions = (Story: StoryFn) => {
  return (
    <FilePermissionsProvider repository={new FileMockRepository()}>
      <Story />
    </FilePermissionsProvider>
  )
}

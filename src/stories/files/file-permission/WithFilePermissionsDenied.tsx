import { StoryFn } from '@storybook/react'
import { FilePermissionsProvider } from '../../../sections/file/file-permissions/FilePermissionsProvider'
import { FileWithDeniedPermissionsRepository } from '../FileWithDeniedPermissionsRepository'

export const WithFilePermissionsDenied = (Story: StoryFn) => {
  return (
    <FilePermissionsProvider repository={new FileWithDeniedPermissionsRepository()}>
      <Story />
    </FilePermissionsProvider>
  )
}

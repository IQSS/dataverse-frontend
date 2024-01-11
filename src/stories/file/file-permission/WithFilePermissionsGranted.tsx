import { StoryFn } from '@storybook/react'
import { FilePermissionsProvider } from '../../../sections/file/file-permissions/FilePermissionsProvider'
import { FileWithGrantedPermissionsRepository } from '../FileWithGrantedPermissionsRepository'

export const WithFilePermissionsGranted = (Story: StoryFn) => {
  return (
    <FilePermissionsProvider repository={new FileWithGrantedPermissionsRepository()}>
      <Story />
    </FilePermissionsProvider>
  )
}

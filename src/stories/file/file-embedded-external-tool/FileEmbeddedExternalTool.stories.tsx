import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileEmbeddedExternalTool } from '@/sections/file/file-embedded-external-tool/FileEmbeddedExternalTool'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { ExternalToolsMockRepository } from '@/stories/shared-mock-repositories/externalTools/ExternalToolsMockRepository'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'

const meta: Meta<typeof FileEmbeddedExternalTool> = {
  title: 'Sections/File Page/File External Tools Tab',
  component: FileEmbeddedExternalTool,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileEmbeddedExternalTool>

const file = FileMother.createRealistic() // text/plain file
const externalToolsRepository = new ExternalToolsMockRepository()

export const WithOneToolOnly: Story = {
  render: () => (
    <FileEmbeddedExternalTool
      file={file}
      isInView={true}
      applicableTools={[ExternalToolsMother.createFileQueryTool()]}
      toolTypeSelectedQueryParam=""
      externalToolsRepository={externalToolsRepository}
    />
  )
}

export const WithMoreThanOneTool: Story = {
  render: () => (
    <FileEmbeddedExternalTool
      file={file}
      isInView={true}
      applicableTools={[
        ExternalToolsMother.createFilePreviewTool(),
        ExternalToolsMother.createFileQueryTool()
      ]}
      toolTypeSelectedQueryParam=""
      externalToolsRepository={externalToolsRepository}
    />
  )
}

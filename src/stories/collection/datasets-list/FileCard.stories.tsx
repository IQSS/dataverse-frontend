import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileCard } from '../../../sections/collection/datasets-list/file-card/FileCard'
import { FilePreviewMother } from '../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof FileCard> = {
  title: 'Sections/Collection Page/FileCard',
  component: FileCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCard>

export const Default: Story = {
  render: () => <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createDefault()} />
}
export const TabDelimited: Story = {
  render: () => <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createTabular()} />
}
export const WithDescription: Story = {
  render: () => (
    <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createWithDescription()} />
  )
}
export const WithChecksum: Story = {
  render: () => (
    <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createWithChecksum()} />
  )
}

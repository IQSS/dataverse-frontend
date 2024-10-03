import { Meta, StoryObj } from '@storybook/react'
import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { WithI18next } from '../../WithI18next'
import { FileItemTypePreviewMother } from '../../../../tests/component/files/domain/models/FileItemTypePreviewMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'

const meta: Meta<typeof FileCard> = {
  title: 'Sections/Collection Page/FileCard',
  component: FileCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCard>

export const Default: Story = {
  render: () => <FileCard filePreview={FileItemTypePreviewMother.create()} />
}

export const WithLongDescription: Story = {
  render: () => {
    const filePreview = FileItemTypePreviewMother.create({
      description: FakerHelper.paragraph(20)
    })

    return <FileCard filePreview={filePreview} />
  }
}

export const WithDraft: Story = {
  render: () => <FileCard filePreview={FileItemTypePreviewMother.createWithDraft()} />
}

export const UnpublishedWithDraft: Story = {
  render: () => <FileCard filePreview={FileItemTypePreviewMother.createUnpublishedWithDraft()} />
}

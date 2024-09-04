import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { CollectionCard } from '../../../sections/collection/datasets-list/collection-card/CollectionCard'
import { CollectionPreviewMother } from '../../../../tests/component/collection/domain/models/CollectionPreviewMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'

const meta: Meta<typeof CollectionCard> = {
  title: 'Sections/Collection Page/CollectionCard',
  component: CollectionCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof CollectionCard>

export const Default: Story = {
  render: () => <CollectionCard collectionPreview={CollectionPreviewMother.createRealistic()} />
}

export const RequiredOnly: Story = {
  render: () => (
    <CollectionCard collectionPreview={CollectionPreviewMother.createWithOnlyRequiredFields()} />
  )
}
export const WithLongDescription: Story = {
  render: () => {
    const collectionPreview = CollectionPreviewMother.create({
      description: FakerHelper.paragraph(20)
    })

    return <CollectionCard collectionPreview={collectionPreview} />
  }
}

export const Unpublished: Story = {
  render: () => <CollectionCard collectionPreview={CollectionPreviewMother.createUnpublished()} />
}

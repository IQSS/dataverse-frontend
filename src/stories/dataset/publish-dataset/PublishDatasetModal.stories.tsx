import { Meta, StoryObj } from '@storybook/react'
import { PublishDatasetModal } from '../../../sections/dataset/publish-dataset/PublishDatasetModal'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithI18next } from '../../WithI18next'

const meta: Meta<typeof PublishDatasetModal> = {
  title: 'Sections/Dataset Page/PublishDatasetModal',
  component: PublishDatasetModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof PublishDatasetModal>

function DefaultExample() {
  return (
    <PublishDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      persistentId={'test'}
      releasedVersionExists={false}
      handleClose={() => {}}></PublishDatasetModal>
  )
}

export const Default: Story = {
  render: () => DefaultExample()
}

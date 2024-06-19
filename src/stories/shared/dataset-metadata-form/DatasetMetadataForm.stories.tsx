import type { StoryObj, Meta } from '@storybook/react'
import { faker } from '@faker-js/faker'
import { DatasetMetadataForm } from '../../../sections/shared/form/DatasetMetadataForm'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from '../../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { MetadataBlockName } from '../../../dataset/domain/models/Dataset'

const datasetToEditMock = DatasetMother.create({
  metadataBlocks: [
    {
      name: MetadataBlockName.CITATION,
      fields: {
        title: faker.lorem.words(2),
        subtitle: faker.lorem.sentence(),
        author: [
          {
            authorName: faker.name.fullName(),
            authorAffiliation: faker.lorem.word(8)
          }
        ],
        datasetContact: [
          {
            datasetContactName: faker.name.fullName(),
            datasetContactAffiliation: faker.lorem.word(),
            datasetContactEmail: faker.internet.email()
          }
        ],
        dsDescription: [
          {
            dsDescriptionValue: faker.lorem.paragraphs(4)
          }
        ],
        subject: ['Agricultural Sciences']
      }
    }
  ]
})

console.log(datasetToEditMock.metadataBlocks)

const meta: Meta<typeof DatasetMetadataForm> = {
  title: 'Sections/Shared/Dataset Metadata Form',
  component: DatasetMetadataForm,
  decorators: [WithI18next, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof DatasetMetadataForm>

export const CreateMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="create"
      collectionId="root"
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const EditMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="edit"
      collectionId="root"
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      datasetPersistentID={datasetToEditMock.persistentId}
      datasetMetadaBlocksCurrentValues={datasetToEditMock.metadataBlocks}
    />
  )
}

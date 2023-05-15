import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const metadataBlocks: DatasetMetadataBlock[] = [
  {
    title: 'Citation Metadata',
    fields: [
      {
        title: 'Title',
        description: 'The main title of the Dataset',
        value: 'Dataset Title'
      },
      {
        title: 'Author',
        description: 'The entity, e.g. a person or organization, that created the Dataset',
        value: [
          {
            authorName: 'Admin, Dataverse',
            authorAffiliation: 'Dataverse.org',
            authorIdentifierScheme: 'ORCID',
            authorIdentifier: '123456789'
          },
          {
            authorName: 'Owner, Dataverse',
            authorAffiliation: 'Dataverse.org',
            authorIdentifierScheme: 'ORCID',
            authorIdentifier: '123456789'
          }
        ]
      }
    ]
  },
  {
    title: 'Geospatial Metadata',
    fields: [
      {
        title: 'Geographic Unit',
        description: 'The unit of measurement for the geographic coverage',
        value: 'km'
      },
      {
        title: 'Geographic Coverage',
        description: 'The geographic coverage of the Dataset',
        value: [
          {
            geographicCoverageCountry: 'United States',
            geographicCoverageCity: 'Cambridge'
          }
        ]
      }
    ]
  }
]

export const Default: Story = {
  render: () => <DatasetMetadata metadataBlocks={metadataBlocks} />
}

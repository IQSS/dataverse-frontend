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
    title: 'citation.name',
    fields: [
      {
        title: 'citation.datasetField.title.name',
        description: 'citation.datasetField.title.description',
        value: 'Dataset Title'
      },
      {
        title: 'citation.datasetField.author.name',
        description: 'citation.datasetField.author.description',
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
    title: 'geospatial.name',
    fields: [
      {
        title: 'geospatial.datasetField.geographicUnit.name',
        description: 'geospatial.datasetField.geographicUnit.description',
        value: 'km'
      },
      {
        title: 'geospatial.datasetField.geographicCoverage.name',
        description: 'geospatial.datasetField.geographicCoverage.description',
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

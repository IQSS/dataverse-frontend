import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMetadata } from '../../../sections/dataset/dataset-metadata/DatasetMetadata'
import { DatasetMetadataBlock } from '../../../dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../dataset/domain/models/MetadataBlockName'

const meta: Meta<typeof DatasetMetadata> = {
  title: 'Sections/Dataset Page/DatasetMetadata',
  component: DatasetMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetadata>

const metadataBlocks: DatasetMetadataBlock[] = [
  {
    name: MetadataBlockName.CITATION,
    fields: {
      title: 'Dataset Title',
      author: [
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
  },
  {
    name: MetadataBlockName.GEOSPATIAL,
    fields: {
      geographicUnit: 'km',
      geographicCoverage: [
        {
          geographicCoverageCountry: 'United States',
          geographicCoverageCity: 'Cambridge'
        },
        {
          geographicCoverageCountry: 'United States',
          geographicCoverageCity: 'Cambridge'
        }
      ]
    }
  }
]

export const Default: Story = {
  render: () => <DatasetMetadata metadataBlocks={metadataBlocks} />
}

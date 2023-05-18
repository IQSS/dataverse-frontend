import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetCitation } from '../../sections/dataset/dataset-citation/DatasetCitation'
import { Citation } from '../../dataset/domain/models/Dataset'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

export const Default: Story = {
  render: () => {
    const citationFields: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'V1'
    }

    return <DatasetCitation citation={citationFields} />
  }
}

export const DraftVersion: Story = {
  render: () => {
    const citationFields: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'DRAFT'
    }

    /*
    Includes extra breaks so you can see the DRAFT tooltip message
     */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={citationFields} />
      </div>
    )
  }
}

export const Deaccessioned: Story = {
  render: () => {
    const citationFields: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'V1',
      isDeaccessioned: true
    }

    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={citationFields} />
      </div>
    )
  }
}

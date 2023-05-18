import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetCitation } from '../../sections/dataset/dataset-citation/DatasetCitation'
import { Citation, CitationStatus } from '../../dataset/domain/models/Dataset'

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
      value:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse',
      status: CitationStatus.PUBLISHED,
      version: '1.0'
    }

    return <DatasetCitation citation={citationFields} />
  }
}

export const DraftVersion: Story = {
  render: () => {
    const citationFields: Citation = {
      value:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse',
      status: CitationStatus.DRAFT,
      version: '1.0'
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
      value:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse',
      status: CitationStatus.DEACCESSIONED,
      version: '2.0'
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

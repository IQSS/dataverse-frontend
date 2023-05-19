import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetCitation } from '../../sections/dataset/dataset-citation/DatasetCitation'
import { Citation, DatasetStatus } from '../../dataset/domain/models/Dataset'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

export const Default: Story = {
  render: () => {
    const citation: Citation = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse'
    }
    const status = DatasetStatus.PUBLISHED
    const version = '1.0'
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={citation} status={status} version={version} />
      </div>
    )
  }
}
export const WithUNF: Story = {
  render: () => {
    const citation: Citation = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      unf: 'UNF:6:8ttuxucTZJWfZ9JgN1udiA== [fileUNF]'
    }
    const status = DatasetStatus.PUBLISHED
    const version = '1.0'
    return (
      <div>
        <br></br>
        <br></br> <DatasetCitation citation={citation} status={status} version={version} />
      </div>
    )
  }
}

export const DraftVersion: Story = {
  render: () => {
    const citation: Citation = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse'
    }
    const status = DatasetStatus.DRAFT
    const version = null

    /*
      Includes extra breaks so you can see the DRAFT tooltip message
       */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={citation} status={status} version={version} />
      </div>
    )
  }
}

export const Deaccessioned: Story = {
  render: () => {
    const citation: Citation = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse'
    }
    const status = DatasetStatus.DEACCESSIONED
    const version = '1.0'

    /*
        Includes extra breaks so you can see the DRAFT tooltip message
         */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={citation} status={status} version={version} />
      </div>
    )
  }
}

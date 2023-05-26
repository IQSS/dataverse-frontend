import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetCitation } from '../../sections/dataset/dataset-citation/DatasetCitation'
import {
  DatasetCitation as DatasetCitationModel,
  DatasetStatus,
  DatasetVersion
} from '../../dataset/domain/models/Dataset'
import { DatasetMockData } from './DatasetMockData'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

export const Default: Story = {
  render: () => {
    const dataset = DatasetMockData({
      version: new DatasetVersion(1, 0, DatasetStatus.RELEASED)
    })

    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={dataset.citation} version={dataset.version} />
      </div>
    )
  }
}
export const WithUNF: Story = {
  render: () => {
    const citation: DatasetCitationModel = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      url: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      unf: 'UNF:6:8ttuxucTZJWfZ9JgN1udiA== [fileUNF]'
    }
    const version = new DatasetVersion(1, 0, DatasetStatus.RELEASED)

    return (
      <div>
        <br></br>
        <br></br> <DatasetCitation citation={citation} version={version} />
      </div>
    )
  }
}

export const DraftVersion: Story = {
  render: () => {
    const dataset = DatasetMockData()

    /*
      Includes extra breaks, so you can see the DRAFT tooltip message
       */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={dataset.citation} version={dataset.version} />
      </div>
    )
  }
}

export const Deaccessioned: Story = {
  render: () => {
    const dataset = DatasetMockData({
      version: new DatasetVersion(1, 0, DatasetStatus.DEACCESSIONED)
    })

    /*
        Includes extra breaks, so you can see the DRAFT tooltip message
         */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={dataset.citation} version={dataset.version} />
      </div>
    )
  }
}

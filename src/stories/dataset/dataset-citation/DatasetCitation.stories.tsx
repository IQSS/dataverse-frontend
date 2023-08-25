import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetCitation } from '../../../sections/dataset/dataset-citation/DatasetCitation'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetMockData } from '../DatasetMockData'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

export const Default: Story = {
  render: () => {
    const dataset = DatasetMockData()
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation citation={dataset.citation} version={dataset.version} />
      </div>
    )
  }
}

export const DraftVersion: Story = {
  render: () => {
    const dataset = DatasetMockData({
      citation:
        'Admin, Dataverse, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DRAFT VERSION',
      version: new DatasetVersion(1, DatasetPublishingStatus.DRAFT, 1, 0)
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

export const Deaccessioned: Story = {
  render: () => {
    const dataset = DatasetMockData({
      citation:
        'Admin, Dataverse, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1 DEACCESSIONED VERSION',
      version: new DatasetVersion(1, DatasetPublishingStatus.DEACCESSIONED, 1, 0)
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

export const Anonymized: Story = {
  render: () => {
    const dataset = DatasetMockData({
      citation:
        'Author name(s) withheld, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1'
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

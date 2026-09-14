import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetCitation } from '../../../sections/dataset/dataset-citation/DatasetCitation'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithRepositories } from '../../WithRepositories'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next, WithRepositories({ datasetRepository: new DatasetMockRepository() })]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

export const Default: Story = {
  render: () => {
    const version = DatasetVersionMother.createRealistic()
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation version={version} datasetId="1" />
      </div>
    )
  }
}

export const WithThumbnailImage: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({ thumbnail: FakerHelper.getImageUrl() })
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation thumbnail={dataset.thumbnail} version={dataset.version} datasetId="1" />
      </div>
    )
  }
}

export const DraftVersion: Story = {
  render: () => {
    const version = DatasetVersionMother.createDraft()
    /*
      Includes extra breaks, so you can see the DRAFT tooltip message
       */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation version={version} datasetId="1" />
      </div>
    )
  }
}

export const Deaccessioned: Story = {
  render: () => {
    const version = DatasetVersionMother.createDeaccessioned()

    /*
        Includes extra breaks, so you can see the DRAFT tooltip message
         */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation version={version} datasetId="1" />
      </div>
    )
  }
}

export const Anonymized: Story = {
  render: () => {
    const dataset = DatasetMother.createRealisticAnonymized()

    /*
        Includes extra breaks, so you can see the DRAFT tooltip message
         */
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation version={dataset.version} datasetId="1" />
      </div>
    )
  }
}

export const WithoutThumbnail: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic()
    return <DatasetCitation withoutThumbnail version={dataset.version} datasetId="1" />
  }
}

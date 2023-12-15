import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetCitation } from '../../../sections/dataset/dataset-citation/DatasetCitation'
import { faker } from '@faker-js/faker'
import {
  DatasetMother,
  DatasetVersionMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
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
        <DatasetCitation version={version} />
      </div>
    )
  }
}

export const WithThumbnail: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({ thumbnail: faker.image.imageUrl() })
    return (
      <div>
        <br></br>
        <br></br>
        <DatasetCitation thumbnail={dataset.thumbnail} version={dataset.version} />
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
        <DatasetCitation version={version} />
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
        <DatasetCitation version={version} />
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
        <DatasetCitation version={dataset.version} />
      </div>
    )
  }
}

import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { DatasetCitation } from '../../sections/dataset/datasetCitation/DatasetCitation'

const meta: Meta<typeof DatasetCitation> = {
  title: 'Sections/Dataset Page/DatasetCitation',
  component: DatasetCitation,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetCitation>

const displayCitation =
  'K, Ellen, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse, V1'

export const Default: Story = {
  render: () => <DatasetCitation displayCitation={displayCitation} />
}

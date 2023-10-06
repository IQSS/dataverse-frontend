import type { Meta, StoryObj } from '@storybook/react'
import { DatasetMockData } from '../DatasetMockData'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'
import { AlertVariant } from '@iqss/dataverse-design-system/dist/components/alert/AlertVariant'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetAlerts>

export const DraftVersion: Story = {
  render: () => {
    const dataset = DatasetMockData({
      version: new DatasetVersion(1, DatasetPublishingStatus.DRAFT, 1, 0)
    })
    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}

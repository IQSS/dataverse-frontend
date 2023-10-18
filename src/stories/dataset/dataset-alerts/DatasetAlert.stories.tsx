import type { Meta, StoryObj } from '@storybook/react'
import { DatasetMockData } from '../DatasetMockData'
import {
  DatasetAlert,
  DatasetAlertMessageKey,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'

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
export const VersionNotFound: Story = {
  render: () => {
    const dataset = DatasetMockData({
      version: new DatasetVersion(1, DatasetPublishingStatus.RELEASED, 1, 0, '3.0')
    })
    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}
export const PrivateUrl: Story = {
  render: () => {
    const alerts = [
      new DatasetAlert('info', DatasetAlertMessageKey.UNPUBLISHED_DATASET, {
        privateUrl:
          'http://localhost:8080/privateurl.xhtml?token=f6815782-1227-4d80-a46d-91621c2d9386'
      })
    ]

    return (
      <div>
        <DatasetAlerts alerts={alerts} />
      </div>
    )
  }
}

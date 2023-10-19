import type { Meta, StoryObj } from '@storybook/react'

import {
  DatasetAlert,
  DatasetAlertMessageKey,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'

import { WithDatasetDraftAsOwner } from '../WithDatasetDraftAsOwner'
import { useDataset } from '../../../sections/dataset/DatasetContext'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetAlerts>

export const DraftVersion: Story = {
  decorators: [WithDatasetDraftAsOwner],
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.DRAFT,
        true,
        false,
        DatasetPublishingStatus.DRAFT
      )
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
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.RELEASED,
        true,
        false,
        DatasetPublishingStatus.RELEASED,
        1,
        0,
        '3.0'
      )
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

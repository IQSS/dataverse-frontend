import type { Meta, StoryObj } from '@storybook/react'

import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'

import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { useAlertContext } from '../../../sections/dataset/DatasetAlertContext'
import { WithAlerts } from '../../WithAlerts'
import { Alert, AlertMessageKey } from '../../../alert/domain/models/Alert'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next, WithAlerts]
}
const allUpdateAlerts: Alert[] = [
  new Alert('success', AlertMessageKey.METADATA_UPDATED),
  new Alert('success', AlertMessageKey.THUMBNAIL_UPDATED),
  new Alert('success', AlertMessageKey.TERMS_UPDATED),
  new Alert('success', AlertMessageKey.FILES_UPDATED),
  new Alert('success', AlertMessageKey.DATASET_DELETED)
]

export default meta
type Story = StoryObj<typeof DatasetAlerts>
export const UpdateAlerts: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic()
    const { addDatasetAlert } = useAlertContext()
    allUpdateAlerts.forEach((alert) => addDatasetAlert(alert))
    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}

const publishAlert = new Alert('warning', AlertMessageKey.PUBLISH_IN_PROGRESS)
export const PublishInProgress: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic()
    const { addDatasetAlert } = useAlertContext()
    addDatasetAlert(publishAlert)
    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}

export const DraftVersion: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.DRAFT,
        true,
        false,
        DatasetPublishingStatus.DRAFT
      ),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed()
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
export const VersionNotFoundShowDraft: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.DRAFT,
        true,
        false,
        DatasetPublishingStatus.DRAFT,
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
export const SharePrivateUrl: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.RELEASED,
        true,
        false,
        DatasetPublishingStatus.DRAFT,
        1,
        0
      ),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })

    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}
export const UsePrivateUrl: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: new DatasetVersion(
        1,
        DatasetPublishingStatus.RELEASED,
        true,
        false,
        DatasetPublishingStatus.DRAFT,
        1,
        0
      ),
      permissions: DatasetPermissionsMother.createWithNoneAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })

    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}

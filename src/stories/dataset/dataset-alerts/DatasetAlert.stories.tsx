import { useEffect } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { useAlertContext } from '../../../sections/alerts/AlertContext'
import { WithAlerts } from '../../WithAlerts'
import { Alert, AlertMessageKey } from '../../../alert/domain/models/Alert'
import useUpdateDatasetAlerts from '../../../sections/dataset/useUpdateDatasetAlerts'
import { Dataset } from '../../../dataset/domain/models/Dataset'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next, WithAlerts]
}
export default meta

type Story = StoryObj<typeof DatasetAlerts>

const DatasetAlertsWrapper = ({ alerts }: { alerts: Alert[] }) => {
  const { setAlerts } = useAlertContext()

  useEffect(() => {
    setAlerts(alerts)
  }, [alerts, setAlerts])

  return <DatasetAlerts />
}

const DatasetAlertsWithDatasetInfoWrapper = ({ dataset }: { dataset: Dataset }) => {
  useUpdateDatasetAlerts({ dataset })

  return <DatasetAlerts />
}

const allUpdateAlerts: Alert[] = [
  new Alert('success', AlertMessageKey.METADATA_UPDATED),
  new Alert('success', AlertMessageKey.THUMBNAIL_UPDATED),
  new Alert('success', AlertMessageKey.TERMS_UPDATED),
  new Alert('success', AlertMessageKey.FILES_UPDATED),
  new Alert('success', AlertMessageKey.DATASET_DELETED)
]

export const UpdateAlerts: Story = {
  render: () => {
    return <DatasetAlertsWrapper alerts={allUpdateAlerts} />
  }
}

const publishAlert = new Alert('warning', AlertMessageKey.PUBLISH_IN_PROGRESS)
export const PublishInProgress: Story = {
  render: () => {
    return <DatasetAlertsWrapper alerts={[publishAlert]} />
  }
}

export const DraftVersion: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithPublishingDatasetAllowed()
    })

    return <DatasetAlertsWithDatasetInfoWrapper dataset={dataset} />
  }
}

export const VersionNotFound: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createReleased(),
      requestedVersion: '3.0'
    })

    return <DatasetAlertsWithDatasetInfoWrapper dataset={dataset} />
  }
}
export const VersionNotFoundShowDraft: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraft(),
      requestedVersion: '3.0'
    })

    return <DatasetAlertsWithDatasetInfoWrapper dataset={dataset} />
  }
}
export const SharePrivateUrl: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithAllAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })

    return <DatasetAlertsWithDatasetInfoWrapper dataset={dataset} />
  }
}
export const UsePrivateUrl: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic({
      version: DatasetVersionMother.createDraft(),
      permissions: DatasetPermissionsMother.createWithNoneAllowed(),
      privateUrl: {
        urlSnippet: 'http://localhost:8080/privateurl.xhtml?token=',
        token: 'cd943c75-1cc7-4c1d-9717-98141d65d5cb'
      }
    })

    return <DatasetAlertsWithDatasetInfoWrapper dataset={dataset} />
  }
}

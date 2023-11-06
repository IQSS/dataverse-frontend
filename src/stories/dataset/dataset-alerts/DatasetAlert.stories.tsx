import type { Meta, StoryObj } from '@storybook/react'

import {
  DatasetAlert,
  DatasetAlertMessageKey,
  DatasetPublishingStatus,
  DatasetVersion
} from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'

import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetAlertContext } from '../../../sections/dataset/DatasetAlertContext'
import { useEffect, useState } from 'react'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next]
}
const editMetadataAlert = [new DatasetAlert('success', DatasetAlertMessageKey.METADATA_UPDATED)]

export default meta
type Story = StoryObj<typeof DatasetAlerts>
export const EditMetadataSuccessful: Story = {
  render: () => {
    const dataset = DatasetMother.createRealistic()

    return (
      <DatasetAlertContext.Provider
        value={{
          datasetAlerts: editMetadataAlert,
          setDatasetAlerts: () => {}
        }}>
        <div>
          <DatasetAlerts alerts={dataset.alerts} />
        </div>
      </DatasetAlertContext.Provider>
    )
  }
}

const publishAlert = [new DatasetAlert('warning', DatasetAlertMessageKey.PUBLISH_IN_PROGRESS)]

export const PublishInProgress: StoryObj<typeof DatasetAlerts> = {
  render: () => {
    const dataset = DatasetMother.createRealistic()
    const [alerts, setAlerts] = useState(publishAlert)

    // Set a timeout to remove the alert after 3 seconds
    useEffect(() => {
      const timer = setTimeout(() => {
        setAlerts([]) // This will clear the alert after 3 seconds
      }, 3000) // Timeout of 3 seconds

      // Clear the timer if the component unmounts
      return () => clearTimeout(timer)
    }, [])

    return (
      <DatasetAlertContext.Provider
        value={{
          datasetAlerts: alerts,
          setDatasetAlerts: setAlerts
        }}>
        <div>
          <DatasetAlerts alerts={dataset.alerts} />
        </div>
      </DatasetAlertContext.Provider>
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

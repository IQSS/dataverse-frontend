import type { Meta, StoryObj } from '@storybook/react'

import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { DatasetAlerts } from '../../../sections/dataset/dataset-alerts/DatasetAlerts'
import { WithI18next } from '../../WithI18next'

import {
  DatasetMother,
  DatasetPermissionsMother
} from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof DatasetAlerts> = {
  title: 'Sections/Dataset Page/DatasetAlerts',
  component: DatasetAlerts,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetAlerts>

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
    const dataset = DatasetMother.createWithPrivateUrlToken(
      'http://localhost:8080/privateurl.xhtml?token=cd943c75-1cc7-4c1d-9717-98141d65d5cb',
      {
        version: new DatasetVersion(
          1,
          DatasetPublishingStatus.RELEASED,
          true,
          false,
          DatasetPublishingStatus.DRAFT,
          1,
          0
        ),
        permissions: DatasetPermissionsMother.createWithUpdateDatasetAllowed()
      }
    )

    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}
export const UsePrivateUrl: Story = {
  render: () => {
    const dataset = DatasetMother.createWithPrivateUrlToken(
      'http://localhost:8080/privateurl.xhtml?token=cd943c75-1cc7-4c1d-9717-98141d65d5cb',
      {
        version: new DatasetVersion(
          1,
          DatasetPublishingStatus.RELEASED,
          true,
          false,
          DatasetPublishingStatus.DRAFT,
          1,
          0
        ),
        permissions: DatasetPermissionsMother.createWithNoneAllowed()
      }
    )

    return (
      <div>
        <DatasetAlerts alerts={dataset.alerts} />
      </div>
    )
  }
}

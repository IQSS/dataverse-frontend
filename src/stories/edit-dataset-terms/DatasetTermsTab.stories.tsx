import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithDataset } from '../dataset/WithDataset'
import { DatasetTermsTab } from '../../sections/edit-dataset-terms/dataset-terms-tab/DatasetTermsTab'
import { LicenseMockRepository } from '../shared-mock-repositories/license/LicenseMockRepository'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetLicenseUpdateRequest } from '@/dataset/domain/models/DatasetLicenseUpdateRequest'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetLicense } from '@/dataset/domain/models/Dataset'

const meta: Meta<typeof DatasetTermsTab> = {
  title: 'Sections/EditDatasetTerms/DatasetTermsTab',
  component: DatasetTermsTab,
  decorators: [WithI18next, WithLayout, WithDataset],
  parameters: {
    chromatic: { delay: 5000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof DatasetTermsTab>

const licenseRepository: LicenseRepository = new LicenseMockRepository() as LicenseRepository

const defaultLicense: DatasetLicense = {
  name: 'CC0 1.0',
  uri: 'http://creativecommons.org/publicdomain/zero/1.0',
  iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
}

// Mock repository that succeeds quickly
class SuccessDatasetMockRepository extends DatasetMockRepository {
  updateDatasetLicense(
    _datasetId: string | number,
    _licenseUpdateRequest: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ License updated successfully!')
        resolve()
      }, 1000)
    })
  }
}

// Mock repository that shows loading state for longer
class SlowLoadingDatasetMockRepository extends DatasetMockRepository {
  updateDatasetLicense(
    _datasetId: string | number,
    _licenseUpdateRequest: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ License updated after long delay')
        resolve()
      }, 5000)
    })
  }
}

// Mock repository that throws an error
class ErrorDatasetMockRepository extends DatasetMockRepository {
  updateDatasetLicense(
    _datasetId: string | number,
    _licenseUpdateRequest: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new WriteError(
            'Failed to update license: The license name is invalid or not found in the database.'
          )
        )
      }, 1000)
    })
  }
}

// Mock repository that throws a network error
class NetworkErrorDatasetMockRepository extends DatasetMockRepository {
  updateDatasetLicense(
    _datasetId: string | number,
    _licenseUpdateRequest: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Network error: Unable to connect to the server'))
      }, 1000)
    })
  }
}

// Mock repository that throws a permission error
class PermissionErrorDatasetMockRepository extends DatasetMockRepository {
  updateDatasetLicense(
    _datasetId: string | number,
    _licenseUpdateRequest: DatasetLicenseUpdateRequest
  ): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new WriteError('Forbidden: You do not have permission to update the dataset license.')
        )
      }, 1000)
    })
  }
}

export const Default: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={defaultLicense}
      licenseRepository={licenseRepository}
      datasetRepository={new SuccessDatasetMockRepository()}
      isInitialCustomTerms={false}
    />
  )
}

export const WithCustomTerms: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={{
        termsOfUse: 'Custom terms of use for this dataset',
        confidentialityDeclaration: 'Confidential data handling required',
        specialPermissions: 'Written permission needed',
        restrictions: 'No commercial use',
        citationRequirements: 'Must cite original author',
        depositorRequirements: 'Depositor approval required',
        conditions: 'Available for academic use only',
        disclaimer: 'Use at your own risk'
      }}
      licenseRepository={licenseRepository}
      datasetRepository={new SuccessDatasetMockRepository()}
      isInitialCustomTerms={true}
    />
  )
}

export const SubmittingState: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={defaultLicense}
      licenseRepository={licenseRepository}
      datasetRepository={new SlowLoadingDatasetMockRepository()}
      isInitialCustomTerms={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the submitting state with loading indicator. Try changing the license and clicking "Save Changes" to see the loading state for 5 seconds.'
      }
    }
  }
}

export const ValidationError: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={{
        termsOfUse: '',
        confidentialityDeclaration: '',
        specialPermissions: '',
        restrictions: '',
        citationRequirements: '',
        depositorRequirements: '',
        conditions: '',
        disclaimer: ''
      }}
      licenseRepository={licenseRepository}
      datasetRepository={new ErrorDatasetMockRepository()}
      isInitialCustomTerms={true}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows validation error when custom terms are required. The "Terms of Use" field is required when using custom terms. Try submitting without filling it.'
      }
    }
  }
}

export const ServerError: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={defaultLicense}
      licenseRepository={licenseRepository}
      datasetRepository={new ErrorDatasetMockRepository()}
      isInitialCustomTerms={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows server error state. Try changing the license and saving to see the error message: "Failed to update license: The license name is invalid or not found in the database."'
      }
    }
  }
}

export const NetworkError: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={defaultLicense}
      licenseRepository={licenseRepository}
      datasetRepository={new NetworkErrorDatasetMockRepository()}
      isInitialCustomTerms={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows network error state. Try changing the license and saving to see the error: "Network error: Unable to connect to the server"'
      }
    }
  }
}

export const PermissionError: Story = {
  render: () => (
    <DatasetTermsTab
      initialLicense={defaultLicense}
      licenseRepository={licenseRepository}
      datasetRepository={new PermissionErrorDatasetMockRepository()}
      isInitialCustomTerms={false}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows permission error. Try changing the license and saving to see: "Forbidden: You do not have permission to update the dataset license."'
      }
    }
  }
}

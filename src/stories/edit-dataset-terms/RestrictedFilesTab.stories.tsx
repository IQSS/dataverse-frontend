import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithDataset } from '../dataset/WithDataset'
import { RestrictedFilesTab } from '../../sections/edit-dataset-terms/restricted-files-tab/RestrictedFilesTab'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { TermsOfAccess } from '@/dataset/domain/models/Dataset'
import { WriteError } from '@iqss/dataverse-client-javascript'

const meta: Meta<typeof RestrictedFilesTab> = {
  title: 'Sections/EditDatasetTerms/RestrictedFilesTab',
  component: RestrictedFilesTab,
  decorators: [WithI18next, WithLayout, WithDataset],
  parameters: {
    chromatic: { delay: 5000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof RestrictedFilesTab>

const defaultTermsOfAccess: TermsOfAccess = {
  fileAccessRequest: false,
  termsOfAccessForRestrictedFiles: '',
  dataAccessPlace: '',
  originalArchive: '',
  availabilityStatus: '',
  contactForAccess: '',
  sizeOfCollection: '',
  studyCompletion: ''
}

const populatedTermsOfAccess: TermsOfAccess = {
  fileAccessRequest: true,
  termsOfAccessForRestrictedFiles:
    'All data access requests must be approved by the Principal Investigator.',
  dataAccessPlace: 'Data must be accessed on-site at the research facility.',
  originalArchive: 'National Archives and Records Administration',
  availabilityStatus: 'Available upon request',
  contactForAccess: 'dataaccess@university.edu',
  sizeOfCollection: 'Approximately 500GB',
  studyCompletion: 'Data available 2 years after study completion'
}

// Mock repository that succeeds quickly
class SuccessDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, _termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Terms of access updated successfully!', _termsOfAccess)
        resolve()
      }, 1000)
    })
  }
}

// Mock repository that shows loading state for longer
class SlowLoadingDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, _termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('✅ Terms of access updated after long delay')
        resolve()
      }, 5000)
    })
  }
}

// Mock repository that throws an error
class ErrorDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, _termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new WriteError(
            'Failed to update terms of access: Invalid data format or missing required fields.'
          )
        )
      }, 1000)
    })
  }
}

// Mock repository that throws a validation error
class ValidationErrorDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        if (termsOfAccess.fileAccessRequest && !termsOfAccess.contactForAccess) {
          reject(
            new WriteError(
              'Validation Error: When file access request is enabled, contact information must be provided.'
            )
          )
        } else {
          reject(new WriteError('Validation Error: Invalid terms of access data.'))
        }
      }, 1000)
    })
  }
}

// Mock repository that throws a permission error
class PermissionErrorDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, _termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(
          new WriteError(
            'Forbidden: You do not have permission to update the terms of access for this dataset.'
          )
        )
      }, 1000)
    })
  }
}

// Mock repository that throws a network error
class NetworkErrorDatasetMockRepository extends DatasetMockRepository {
  updateTermsOfAccess(_datasetId: string | number, _termsOfAccess: TermsOfAccess): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Network error: Unable to connect to the server. Please try again later.'))
      }, 1000)
    })
  }
}

export const Default: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new SuccessDatasetMockRepository()}
      initialTermsOfAccess={defaultTermsOfAccess}
    />
  )
}

export const WithAccessRequestEnabled: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new SuccessDatasetMockRepository()}
      initialTermsOfAccess={populatedTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form with file access request enabled and all fields populated. Note the info alert that appears when access request is checked.'
      }
    }
  }
}

export const SubmittingState: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new SlowLoadingDatasetMockRepository()}
      initialTermsOfAccess={defaultTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the submitting state with loading indicator. Try making changes and clicking "Save Changes" to see the loading state for 5 seconds.'
      }
    }
  }
}

export const ServerError: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new ErrorDatasetMockRepository()}
      initialTermsOfAccess={defaultTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows server error state. Try making changes and saving to see the error message: "Failed to update terms of access: Invalid data format or missing required fields."'
      }
    }
  }
}

export const ValidationError: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new ValidationErrorDatasetMockRepository()}
      initialTermsOfAccess={{
        ...defaultTermsOfAccess,
        fileAccessRequest: true
      }}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows validation error. Try enabling "Request Access" and saving without providing contact information to see: "Validation Error: When file access request is enabled, contact information must be provided."'
      }
    }
  }
}

export const NetworkError: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new NetworkErrorDatasetMockRepository()}
      initialTermsOfAccess={defaultTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows network error state. Try making changes and saving to see the error: "Network error: Unable to connect to the server. Please try again later."'
      }
    }
  }
}

export const PermissionError: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new PermissionErrorDatasetMockRepository()}
      initialTermsOfAccess={defaultTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows permission error. Try making changes and saving to see: "Forbidden: You do not have permission to update the terms of access for this dataset."'
      }
    }
  }
}

export const PopulatedWithError: Story = {
  render: () => (
    <RestrictedFilesTab
      datasetRepository={new ErrorDatasetMockRepository()}
      initialTermsOfAccess={populatedTermsOfAccess}
    />
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows the form fully populated, with an error occurring on submission. This demonstrates how the form handles errors with existing data.'
      }
    }
  }
}

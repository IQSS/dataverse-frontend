import { ReactNode } from 'react'
import { RestrictedFilesTab } from '@/sections/edit-dataset-terms/restricted-files-tab/RestrictedFilesTab'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { TermsOfAccessMother } from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { Dataset, TermsOfAccess } from '@/dataset/domain/models/Dataset'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const mockDataset = DatasetMother.create({
  id: 123
})

describe('RestrictedFilesTab', () => {
  const withProviders = (component: ReactNode, dataset: Dataset) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)

    return (
      <DatasetProvider
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}
        repository={datasetRepository}>
        {component}
      </DatasetProvider>
    )
  }

  describe('Request Access Section', () => {
    it('renders the request access checkbox', () => {
      const termsOfAccess = TermsOfAccessMother.create({ fileAccessRequest: true })

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByLabelText('Enable access request').should('exist')
      cy.findByLabelText('Enable access request').should('be.checked')
    })

    it('shows info alert', () => {
      const termsOfAccess = TermsOfAccessMother.create({ fileAccessRequest: true })

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByText(/Restricting limits access to published files/).should('exist')
    })
  })

  describe('Terms of Access Fields', () => {
    it('renders all terms of access fields', () => {
      const termsOfAccess = TermsOfAccessMother.create()

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
      cy.findByLabelText('Data Access Place').should('exist')
      cy.findByLabelText('Original Archive').should('exist')
      cy.findByLabelText('Availability Status').should('exist')
      cy.findByLabelText('Contact for Access').should('exist')
      cy.findByLabelText('Size of Collection').should('exist')
      cy.findByLabelText('Study Completion').should('exist')
    })

    it('pre-fills fields with initial values', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        termsOfAccessForRestrictedFiles: 'Access requires approval',
        dataAccessPlace: 'Main office',
        originalArchive: 'University archive',
        availabilityStatus: 'Available',
        contactForAccess: 'contact@example.com',
        sizeOfCollection: '100 MB',
        studyCompletion: '2023-12-31'
      })

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      // Check that fields are pre-filled
      cy.findByDisplayValue('Access requires approval').should('exist')
      cy.findByDisplayValue('Main office').should('exist')
      cy.findByDisplayValue('University archive').should('exist')
      cy.findByDisplayValue('Available').should('exist')
      cy.findByDisplayValue('contact@example.com').should('exist')
      cy.findByDisplayValue('100 MB').should('exist')
      cy.findByDisplayValue('2023-12-31').should('exist')
    })

    it('allows editing of terms of access fields', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        termsOfAccessForRestrictedFiles: 'Initial terms'
      })

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByLabelText('Terms of Access for Restricted Files')
        .clear()
        .type('Updated terms of access')

      cy.findByDisplayValue('Updated terms of access').should('exist')
    })
  })

  describe('Form Actions', () => {
    it('renders save and cancel buttons', () => {
      const termsOfAccess = TermsOfAccessMother.create()

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('exist')
      cy.findByRole('button', { name: 'Cancel' }).should('exist')
    })

    it('enables save button when form is valid', () => {
      const termsOfAccess = TermsOfAccessMother.create()

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('resets form to initial values when cancel is clicked', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        termsOfAccessForRestrictedFiles: 'Original terms',
        fileAccessRequest: true
      })

      const datasetWithTerms = DatasetMother.create({
        id: 123,
        termsOfUse: {
          termsOfAccess: termsOfAccess
        }
      })

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          datasetWithTerms
        )
      )

      cy.findByLabelText('Terms of Access for Restricted Files').clear().type('Modified terms')
      cy.findByDisplayValue('Modified terms').should('exist')

      cy.findByRole('button', { name: 'Cancel' }).click()
      cy.findByDisplayValue('Original terms').should('exist')
    })

    it('submits form data when save is clicked', () => {
      const termsOfAccess = TermsOfAccessMother.create()

      cy.customMount(
        withProviders(
          <RestrictedFilesTab
            datasetRepository={datasetRepository}
            initialTermsOfAccess={termsOfAccess}
          />,
          mockDataset
        )
      )

      cy.findByLabelText('Terms of Access for Restricted Files').clear().type('New terms')

      cy.findByRole('button', { name: 'Save Changes' }).click()
    })
  })

  it('handles empty initial terms of access', () => {
    const emptyTermsOfAccess = TermsOfAccessMother.createEmpty()

    cy.customMount(
      withProviders(
        <RestrictedFilesTab
          datasetRepository={datasetRepository}
          initialTermsOfAccess={emptyTermsOfAccess}
        />,
        mockDataset
      )
    )

    // Should render without errors
    cy.findByLabelText('Enable access request').should('exist')
    cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
  })

  it('handles undefined values in terms of access', () => {
    const termsOfAccess: TermsOfAccess = {
      fileAccessRequest: false,
      termsOfAccessForRestrictedFiles: undefined,
      dataAccessPlace: undefined,
      originalArchive: undefined,
      availabilityStatus: undefined,
      contactForAccess: undefined,
      sizeOfCollection: undefined,
      studyCompletion: undefined
    }

    cy.customMount(
      withProviders(
        <RestrictedFilesTab
          datasetRepository={datasetRepository}
          initialTermsOfAccess={termsOfAccess}
        />,
        mockDataset
      )
    )

    // Should render without errors and fields should be empty
    cy.findByLabelText('Terms of Access for Restricted Files').should('have.value', '')
    cy.findByLabelText('Data Access Place').should('have.value', '')
  })
})

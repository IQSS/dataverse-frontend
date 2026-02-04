import { ReactNode } from 'react'
import { EditTermsOfAccess } from '@/sections/edit-dataset-terms/edit-terms-of-access/EditTermsOfAccess'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  TermsOfAccessMother,
  TermsOfUseMother
} from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { Dataset } from '@/dataset/domain/models/Dataset'

const datasetRepository: DatasetRepository = {} as DatasetRepository

const mockDataset = DatasetMother.create({
  id: 123,
  termsOfUse: TermsOfUseMother.withoutCustomTerms({
    termsOfAccess: TermsOfAccessMother.create({
      fileAccessRequest: true,
      termsOfAccessForRestrictedFiles: 'Access requires approval',
      dataAccessPlace: 'Main office',
      originalArchive: 'University archive',
      availabilityStatus: 'Available',
      contactForAccess: 'contact@example.com',
      sizeOfCollection: '100 MB',
      studyCompletion: '2023-12-31'
    })
  })
})

describe('EditTermsOfAccess', () => {
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
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByLabelText('Enable access request').should('exist')
      cy.findByLabelText('Enable access request').should('be.checked')
    })

    it('shows info alert', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByText(/Restricting limits access to published files/).should('exist')
    })
  })

  describe('Terms of Access Fields', () => {
    it('renders all terms of access fields', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
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
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )
      cy.findByDisplayValue('Access requires approval').should('exist')
      cy.findByDisplayValue('Main office').should('exist')
      cy.findByDisplayValue('University archive').should('exist')
      cy.findByDisplayValue('Available').should('exist')
      cy.findByDisplayValue('contact@example.com').should('exist')
      cy.findByDisplayValue('100 MB').should('exist')
      cy.findByDisplayValue('2023-12-31').should('exist')
    })

    it('allows editing of terms of access fields', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByLabelText('Terms of Access for Restricted Files')
        .clear()
        .type('Updated terms of access')

      cy.findByDisplayValue('Updated terms of access').should('exist')
    })
  })

  describe('Form Actions', () => {
    it('renders save and cancel buttons', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('exist')
      cy.findByRole('button', { name: 'Cancel' }).should('exist')
    })

    it('enables save button when form is valid', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('disables save button when request access is disabled and terms are empty', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
      cy.findByLabelText(/Terms of Access for Restricted Files/i).type('Provide contact details')
      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('submits form data when save is clicked', () => {
      cy.customMount(
        withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
      )

      cy.findByLabelText('Terms of Access for Restricted Files').clear().type('New terms')
      cy.findByRole('button', { name: 'Save Changes' }).click()
    })
  })

  it('handles empty initial terms of access', () => {
    cy.customMount(
      withProviders(<EditTermsOfAccess datasetRepository={datasetRepository} />, mockDataset)
    )

    cy.findByLabelText('Enable access request').should('exist')
    cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
  })

  describe('Toast Notifications', () => {
    it('displays success toast when terms of access are updated successfully', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        fileAccessRequest: false
      })
      datasetRepository.updateTermsOfAccess = cy.stub().resolves()

      cy.customMount(
        withProviders(
          <EditTermsOfAccess datasetRepository={datasetRepository} />,
          DatasetMother.create({
            id: 123,
            termsOfUse: { termsOfAccess }
          })
        )
      )

      cy.findByLabelText('Enable access request').check()
      cy.findByLabelText('Terms of Access for Restricted Files').type('Please contact for access')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('The terms for this dataset have been updated.').should('exist')
    })

    it('displays success toast when request access checkbox is toggled', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        fileAccessRequest: true
      })
      datasetRepository.updateTermsOfAccess = cy.stub().resolves()

      cy.customMount(
        withProviders(
          <EditTermsOfAccess datasetRepository={datasetRepository} />,
          DatasetMother.create({
            id: 123,
            termsOfUse: { termsOfAccess }
          })
        )
      )

      cy.findByLabelText('Enable access request').should('be.checked')
      cy.findByLabelText('Enable access request').uncheck()

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('The terms for this dataset have been updated.').should('exist')
    })
  })
})

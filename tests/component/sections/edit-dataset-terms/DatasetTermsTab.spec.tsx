import { ReactNode } from 'react'
import { DatasetTermsTab } from '@/sections/edit-dataset-terms/dataset-terms-tab/DatasetTermsTab'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  TermsOfUseMother,
  CustomTermsMother
} from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { License } from '@/licenses/domain/models/License'

const licenseRepository: LicenseRepository = {} as LicenseRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

const mockLicenses: License[] = [
  {
    id: 1,
    name: 'CC0 1.0',
    shortDescription: 'Creative Commons CC0 1.0 Universal Public Domain Dedication.',
    uri: 'http://creativecommons.org/publicdomain/zero/1.0',
    iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png',
    active: true,
    isDefault: true,
    sortOrder: 0,
    rightsIdentifier: 'CC0-1.0',
    rightsIdentifierScheme: 'SPDX',
    schemeUri: 'https://spdx.org/licenses/',
    languageCode: 'en'
  },
  {
    id: 2,
    name: 'CC BY 4.0',
    shortDescription: 'Creative Commons Attribution 4.0 International License.',
    uri: 'http://creativecommons.org/licenses/by/4.0',
    iconUri: 'https://licensebuttons.net/l/by/4.0/88x31.png',
    active: true,
    isDefault: false,
    sortOrder: 2,
    rightsIdentifier: 'CC-BY-4.0',
    rightsIdentifierScheme: 'SPDX',
    schemeUri: 'https://spdx.org/licenses/',
    languageCode: 'en'
  }
]

const mockDataset = DatasetMother.create({
  id: 123,
  termsOfUse: TermsOfUseMother.create()
})

describe('DatasetTermsTab', () => {
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

  beforeEach(() => {
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
  })

  describe('License Selection', () => {
    it('renders license dropdown with available licenses', () => {
      const license = mockLicenses[0]

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByDisplayValue('CC0 1.0').should('exist')

      cy.get('select').should('contain.html', 'CC0 1.0')
      cy.get('select').should('contain.html', 'CC BY 4.0')
      cy.get('select').should('contain.html', 'Custom Dataset Terms')
    })

    it('allows user to change license selection', () => {
      const license = mockLicenses[0]

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.get('select').select('CC BY 4.0')
      cy.get('select').should('have.value', '2')

      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })
  })

  describe('Custom Terms', () => {
    it('shows custom terms fields when "Custom Dataset Terms" is selected', () => {
      const customTerms = CustomTermsMother.create()

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={customTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={true}
          />,
          mockDataset
        )
      )

      cy.findByText('Terms of Use').should('exist')
      cy.findByText(customTerms.termsOfUse).should('exist')
      cy.findByText(customTerms?.confidentialityDeclaration as string).should('exist')
      cy.findByText(customTerms?.specialPermissions as string).should('exist')
      cy.findByText(customTerms?.restrictions as string).should('exist')
      cy.findByText(customTerms?.citationRequirements as string).should('exist')
      cy.findByText(customTerms?.depositorRequirements as string).should('exist')
      cy.findByText(customTerms?.conditions as string).should('exist')
      cy.findByText(customTerms?.disclaimer as string).should('exist')
    })

    it('validates required fields in custom terms', () => {
      const customTerms = CustomTermsMother.create({
        termsOfUse: ''
      })
      datasetRepository.updateDatasetLicense = cy.stub().resolves()

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={customTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={true}
          />,
          mockDataset
        )
      )

      cy.findByTestId('customTerms.termsOfUse').should('exist')
      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
      cy.findByTestId('customTerms.termsOfUse').type('temp').clear()
      cy.findByText('Terms of use is required.').should('exist')

      cy.findByTestId('customTerms.termsOfUse').type('Some custom terms')
      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('allows switching between license and custom terms', () => {
      const license = mockLicenses[0]

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.get('select').select('Custom Dataset Terms')
      cy.findByText('Terms of Use').should('exist')
      cy.get('select').select('CC0 1.0')
      cy.findByText('Terms of Use').should('not.exist')
    })
  })

  describe('Form Actions', () => {
    it('enables save button when form is valid', () => {
      const license = mockLicenses[0]

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('resets form when cancel is clicked', () => {
      const license = mockLicenses[0]

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.get('select').select('CC BY 4.0')
      cy.get('select').should('have.value', '2')
      cy.findByRole('button', { name: 'Cancel' }).click()
      cy.get('select').should('have.value', '1')
    })
  })

  describe('Loading States', () => {
    it('shows loading state while fetching licenses', () => {
      const license = mockLicenses[0]
      licenseRepository.getAvailableStandardLicenses = cy.stub().returns(new Promise(() => {})) // Never resolves

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByText('Loading...').should('exist')
    })

    it('shows saving state during form submission', () => {
      const license = mockLicenses[0]
      datasetRepository.updateDatasetLicense = cy.stub().returns(new Promise(() => {}))

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByDisplayValue('CC0 1.0').should('exist')

      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByRole('button', { name: 'Saving' }).should('exist')
      cy.findByRole('button', { name: 'Saving' }).should('be.disabled')
    })
  })

  describe('Error Handling', () => {
    it('displays error message when license loading fails', () => {
      const license = mockLicenses[0]
      licenseRepository.getAvailableStandardLicenses = cy
        .stub()
        .rejects(new Error('Failed to load licenses'))

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByText(/Something went wrong getting the licenses. Try again later./i).should('exist')
    })

    it('displays error message when license update fails', () => {
      const license = mockLicenses[0]
      datasetRepository.updateDatasetLicense = cy.stub().rejects(new Error())

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByDisplayValue('CC0 1.0').should('exist')

      cy.findByRole('button', { name: 'Save Changes' }).click()
      cy.findByText(
        /An error occurred while updating the dataset license. Please try again./i
      ).should('exist')
    })
  })

  describe('Toast Notifications', () => {
    it('displays success toast when license is updated successfully', () => {
      const license = mockLicenses[0]
      datasetRepository.updateDatasetLicense = cy.stub().resolves()

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={license}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={false}
          />,
          mockDataset
        )
      )

      cy.findByDisplayValue('CC0 1.0').should('exist')

      cy.get('select').select('CC BY 4.0')
      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('The license for this dataset has been updated.').should('exist')
    })

    it('displays success toast when custom terms are updated successfully', () => {
      const customTerms = CustomTermsMother.create()
      datasetRepository.updateDatasetLicense = cy.stub().resolves()

      cy.customMount(
        withProviders(
          <DatasetTermsTab
            initialLicense={customTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
            isInitialCustomTerms={true}
          />,
          mockDataset
        )
      )

      cy.findByTestId('customTerms.termsOfUse').clear().type('Updated custom terms')
      cy.findByRole('button', { name: 'Save Changes' }).click()

      cy.findByText('The license for this dataset has been updated.').should('exist')
    })
  })
})

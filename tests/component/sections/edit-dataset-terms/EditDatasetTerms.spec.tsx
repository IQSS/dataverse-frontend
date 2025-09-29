import { ReactNode } from 'react'
import { EditDatasetTerms } from '@/sections/edit-dataset-terms/EditDatasetTerms'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { EditDatasetTermsHelper } from '@/sections/edit-dataset-terms/EditDatasetTermsHelper'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  TermsOfUseMother,
  TermsOfAccessMother,
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

describe('EditDatasetTerms Integration', () => {
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

  describe('Tab Navigation', () => {
    it('renders all three tabs', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Check that all tabs are present
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('exist')
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should('exist')
      cy.findByRole('tab', { name: 'Guest Book' }).should('exist')
    })

    it('switches between tabs correctly', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Default tab should be active
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

      // Switch to restricted files tab
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )

      // Should show restricted files content
      cy.findByLabelText('Enable access request').should('exist')

      // Switch to guest book tab
      cy.findByRole('tab', { name: 'Guest Book' }).click()
      cy.findByRole('tab', { name: 'Guest Book' }).should('have.attr', 'aria-selected', 'true')
    })

    it('starts with the correct default tab', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={
              EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms
            }
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Restricted files tab should be active by default
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )
      cy.findByLabelText('Enable access request').should('exist')
    })

    it('displays info alert about editing terms', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      cy.findByText('Edit Dataset Terms').should('exist')
    })
  })

  describe.only('Dataset Terms Tab Integration', () => {
    it('displays dataset terms tab with license data', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0]
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      cy.findByDisplayValue('CC0 1.0').should('exist')
      cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    })

    it('displays custom terms when dataset has custom terms', () => {
      const customTerms = CustomTermsMother.create({ termsOfUse: 'Custom terms text' })
      const dataset = DatasetMother.create({
        termsOfUse: TermsOfUseMother.create({ customTerms })
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      cy.findByText('Custom Dataset Terms').should('exist')
      cy.findByText('Terms of Use').should('exist')
      cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    })

    // it.only('handles form validation for required custom terms', () => {
    //   const customTerms = CustomTermsMother.create({ termsOfUse: 'Some terms' })
    //   const dataset = DatasetMother.create({
    //     termsOfUse: TermsOfUseMother.create({ customTerms })
    //   })

    //   cy.customMount(
    //     withProviders(
    //       <EditDatasetTerms
    //         defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
    //         licenseRepository={licenseRepository}
    //         datasetRepository={datasetRepository}
    //       />,
    //       dataset
    //     )
    //   )

    //   cy.findByRole('button', { name: 'Save Changes' }).should('exist').click()
    //   cy.wait(1000)
    //   cy.findByText(
    //     'Error - An error occurred while updating the dataset license. Please try again.'
    //   ).should('exist')
    // })
  })

  describe('Restricted Files Tab Integration', () => {
    it('displays restricted files tab with terms of access data', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        fileAccessRequest: true,
        termsOfAccessForRestrictedFiles: 'Access requires approval'
      })
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create({ termsOfAccess })
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={
              EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms
            }
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Should show terms of access data
      cy.findByLabelText('Enable access request').should('be.checked')
      cy.findByDisplayValue('Access requires approval').should('exist')

      // Should show info alert since access request is enabled
      cy.findByText(/Restricting limits access to published files/).should('exist')
    })

    it('handles empty terms of access', () => {
      const termsOfAccess = TermsOfAccessMother.createEmpty()
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create({ termsOfAccess })
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={
              EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms
            }
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Should render without errors
      cy.findByLabelText('Enable access request').should('exist')
      cy.findByLabelText('Terms of Access for Restricted Files').should('exist')

      // No info alert should show since access request is disabled
      cy.findByText(/Restricting limits access to published files/).should('not.exist')
    })
  })

  describe('Breadcrumbs', () => {
    it('displays correct breadcrumbs', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.create()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      // Should show breadcrumb with edit terms action
      cy.findByText('Edit Dataset Terms and Guestbook').should('exist')
    })
  })
})

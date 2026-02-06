import { ReactNode } from 'react'
import { EditDatasetTerms } from '@/sections/edit-dataset-terms/EditDatasetTerms'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import {
  EditDatasetTermsHelper,
  EditDatasetTermsTabKey
} from '@/sections/edit-dataset-terms/EditDatasetTermsHelper'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  TermsOfUseMother,
  TermsOfAccessMother
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

describe('EditDatasetTermsHelper', () => {
  describe('defineSelectedTabKey', () => {
    it('should return the correct tab key when a tab query param is present in the URL', () => {
      const searchParams = new URLSearchParams()
      searchParams.set(
        EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY,
        'restrictedFilesTerms'
      )

      const result = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(
        EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms
      )
    })

    it('should return the correct tab key for guestBook', () => {
      const searchParams = new URLSearchParams()
      searchParams.set(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY, 'guestBook')

      const result = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestBook)
    })

    it('should return the dataset terms tab key as default if the tab query param is not present in the URL', () => {
      const searchParams = new URLSearchParams()

      const result = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms)
    })

    it('should return the dataset terms tab key as default if the tab query param is invalid', () => {
      const searchParams = new URLSearchParams()
      searchParams.set(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY, 'doesNotExist')

      const result = EditDatasetTermsHelper.defineSelectedTabKey(searchParams)

      expect(result).to.equal(EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms)
    })
  })
})

describe('EditDatasetTerms', () => {
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
    cy.viewport(1920, 1080)
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
  })

  it('renders NotFoundPage when dataset is missing', () => {
    datasetRepository.getByPersistentId = cy.stub().resolves(undefined)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(undefined)

    cy.customMount(
      <DatasetProvider
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}
        repository={datasetRepository}>
        <EditDatasetTerms
          defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
          licenseRepository={licenseRepository}
          datasetRepository={datasetRepository}
        />
      </DatasetProvider>
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  describe('Tab Navigation', () => {
    it('renders all three tabs', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('exist')
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should('exist')
      cy.findByRole('tab', { name: 'GuestBook' }).should('exist')
    })

    it('switches between tabs correctly', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )

      cy.findByLabelText('Enable access request').should('exist')

      cy.findByRole('tab', { name: 'GuestBook' }).should('not.be.selected')
    })

    it('starts with the correct default tab', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

    it('show unsaved changed modal when the editing form is dirty and switching tabs', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

      cy.get('select').select('CC BY 4.0')

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

      cy.findByText('Unsaved Changes').should('exist')
      cy.findByText('Stay on this page').should('exist').click()

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

      cy.findByText('Unsaved Changes').should('exist')
      cy.findByText('Leave without saving').click()

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )
    })

    it('show unsaved changed modal and switch tab without saving', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

      cy.get('select').select('CC BY 4.0')

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

      cy.findByText('Unsaved Changes').should('exist')
      cy.findByText('Stay on this page').should('exist')
      cy.findByText('Leave without saving').click()

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )
    })

    it('switches tabs without unsaved modal when active tab is guest book', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestBook}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')
    })

    it('switches tabs without unsaved modal when active tab key is unknown', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            // Force an invalid key to hit the default branch in getCurrentFormDirtyState
            defaultActiveTabKey={'unknown-tab' as unknown as EditDatasetTermsTabKey}
            licenseRepository={licenseRepository}
            datasetRepository={datasetRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')
    })

    it('does nothing when selecting the currently active tab', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.get('select').select('CC BY 4.0')
      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')
    })
  })

  describe('Dataset Terms Tab Integration', () => {
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
      const dataset = DatasetMother.create({
        license: undefined,
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

      cy.findByText('Custom Dataset Terms').should('exist')
      cy.findByTestId('customTerms.termsOfUse').should('exist')
      cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    })
  })

  describe('Restricted Files Tab Integration', () => {
    it('displays restricted files tab with terms of access data', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        fileAccessRequest: true,
        termsOfAccessForRestrictedFiles: 'Access requires approval'
      })
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms({ termsOfAccess })
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

      cy.findByLabelText('Enable access request').should('be.checked')
      cy.findByDisplayValue('Access requires approval').should('exist')
      cy.findByText(/Restricting limits access to published files/).should('exist')
    })

    it('requires terms of access when request access is disabled', () => {
      const termsOfAccess = TermsOfAccessMother.create({
        fileAccessRequest: true,
        termsOfAccessForRestrictedFiles: 'Existing access terms'
      })
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms({ termsOfAccess })
      })
      datasetRepository.updateTermsOfAccess = cy.stub().resolves()

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

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )

      cy.findByLabelText('Enable access request').should('be.checked')
      cy.findByLabelText('Enable access request').uncheck()
      cy.findByLabelText('Enable access request').should('not.be.checked')

      cy.findByLabelText(/Terms of Access for Restricted Files/i).clear()

      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')

      cy.findByText(
        'Add information about terms of access for restricted files when request access is disabled.'
      ).should('exist')

      cy.wrap(datasetRepository.updateTermsOfAccess).should('not.have.been.called')

      cy.findByLabelText(/Terms of Access for Restricted Files/i).type('Provide contact details')

      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })
  })

  describe('Breadcrumbs', () => {
    it('displays correct breadcrumbs', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

      cy.findByText('Edit Dataset Terms and Guestbook').should('exist')
    })
  })
})

describe('EditDatasetTerms Mobile View', () => {
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

  it('displays accordion sections in mobile view', () => {
    cy.viewport(500, 1080)
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
    const dataset = DatasetMother.create({
      license: mockLicenses[0],
      termsOfUse: TermsOfUseMother.withoutCustomTerms()
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

    cy.findByText('Dataset Terms').should('exist')
    cy.findByText('Restricted Files + Terms of Access').should('exist')
  })
})

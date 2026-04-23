import { ReactNode } from 'react'
import { EditDatasetTerms } from '@/sections/edit-dataset-terms/EditDatasetTerms'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { LicenseRepository } from '@/licenses/domain/repositories/LicenseRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { EditDatasetTermsHelper } from '@/sections/edit-dataset-terms/EditDatasetTermsHelper'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import {
  TermsOfUseMother,
  TermsOfAccessMother
} from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { License } from '@/licenses/domain/models/License'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { WithRepositories } from '@tests/component/WithRepositories'

const licenseRepository: LicenseRepository = {} as LicenseRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
let guestbookRepository: GuestbookRepository

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

const mockGuestbooks: Guestbook[] = [
  {
    id: 1,
    name: 'Data Request Guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [],
    createTime: '2025-03-11T00:00:00Z',
    dataverseId: 10
  },
  {
    id: 2,
    name: 'Secondary Guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: false,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [
      {
        question: 'How will you use this data?',
        required: true,
        displayOrder: 1,
        type: 'text',
        hidden: false
      }
    ],
    createTime: '2025-03-11T00:00:00Z',
    dataverseId: 10
  }
]

describe('EditDatasetTerms', () => {
  const withProviders = (component: ReactNode, dataset: Dataset) => {
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    datasetRepository.getByPrivateUrlToken = cy.stub().resolves(dataset)
    return (
      <WithRepositories datasetRepository={datasetRepository}>
        <DatasetProvider
          searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}
          repository={datasetRepository}>
          {component}
        </DatasetProvider>
      </WithRepositories>
    )
  }

  beforeEach(() => {
    cy.viewport(1920, 1080)
    licenseRepository.getAvailableStandardLicenses = cy.stub().resolves(mockLicenses)
    guestbookRepository = {
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy.stub().resolves(mockGuestbooks),
      assignDatasetGuestbook: cy.stub().resolves(undefined),
      removeDatasetGuestbook: cy.stub().resolves(undefined)
    }
  })

  describe('EditDatasetTermsHelper', () => {
    it('maps guestbook tab query param to guestbook tab key', () => {
      const searchParams = new URLSearchParams({
        [EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY]: 'guestbook'
      })

      expect(EditDatasetTermsHelper.defineSelectedTabKey(searchParams)).to.equal(
        EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook
      )
    })

    it('falls back to dataset terms tab key when tab query param is missing or invalid', () => {
      const missingTabSearchParams = new URLSearchParams()
      const invalidTabSearchParams = new URLSearchParams({
        [EditDatasetTermsHelper.EDIT_DATASET_TERMS_TAB_QUERY_KEY]: 'invalid-tab'
      })

      expect(EditDatasetTermsHelper.defineSelectedTabKey(missingTabSearchParams)).to.equal(
        EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms
      )
      expect(EditDatasetTermsHelper.defineSelectedTabKey(invalidTabSearchParams)).to.equal(
        EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms
      )
    })
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
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Dataset Terms' }).should('exist')
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should('exist')
      cy.findByRole('tab', { name: 'Guestbook' }).should('exist')
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
            guestbookRepository={guestbookRepository}
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

      cy.findByRole('tab', { name: 'Guestbook' }).should('not.be.selected')
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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
            guestbookRepository={guestbookRepository}
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

  describe('Guestbook Tab Integration', () => {
    it('displays available guestbooks and keeps Save Changes disabled for current guestbook', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        guestbookId: mockGuestbooks[0].id
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Guestbook' }).should('have.attr', 'aria-selected', 'true')
      cy.findByLabelText('Data Request Guestbook').should('be.checked')
      cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
      cy.findAllByRole('button', { name: 'Preview Guestbook' }).should('have.length', 2)
      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
    })

    it('enables Save Changes when selecting a different guestbook', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        guestbookId: mockGuestbooks[0].id
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
      cy.findByLabelText('Secondary Guestbook').click()
      cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    })

    it('opens guestbook preview modal from guestbook tab', () => {
      const dataset = DatasetMother.create({
        license: mockLicenses[0],
        guestbookId: mockGuestbooks[1].id
      })

      cy.customMount(
        withProviders(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findAllByRole('button', { name: 'Preview Guestbook' }).should('have.length', 2)
      cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(1).click()

      cy.findByRole('dialog')
        .should('be.visible')
        .within(() => {
          cy.findByText('Secondary Guestbook').should('exist')
          cy.findByText(/How will you use this data?/).should('exist')
          cy.findByText(/Email/).should('exist')
        })
    })
  })

  describe('Tab State Guard Branches', () => {
    const withProvidersOptionalDataset = (component: ReactNode, dataset: Dataset | undefined) => {
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

    it('renders not found page when dataset does not exist', () => {
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          undefined
        )
      )

      cy.findByText('404').should('exist')
    })

    it('shows unsaved changes modal when restricted files tab form is dirty and switching tabs', () => {
      const dataset = DatasetMother.create()
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={
              EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.restrictedFilesTerms
            }
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByLabelText('Enable access request').uncheck()
      cy.findByLabelText(/Terms of Access for Restricted Files/i)
        .clear()
        .type('Need contact approval')

      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('exist')
    })

    it('switches from guestbook tab without unsaved modal when guestbook form is not dirty', () => {
      const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')
    })

    it('shows unsaved changes modal when guestbook tab form is dirty and switching tabs', () => {
      const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.guestbook}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByLabelText('Secondary Guestbook').click()
      cy.findByRole('tab', { name: 'Dataset Terms' }).click()

      cy.findByText('Unsaved Changes').should('exist')
    })

    it('uses default dirty-state branch when active tab key is unknown', () => {
      const dataset = DatasetMother.create()
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={'unknown-tab-key' as unknown as never}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
        'have.attr',
        'aria-selected',
        'true'
      )
    })

    it('does not trigger tab switch flow when selecting the current active tab', () => {
      const dataset = DatasetMother.create()
      cy.customMount(
        withProvidersOptionalDataset(
          <EditDatasetTerms
            defaultActiveTabKey={EditDatasetTermsHelper.EDIT_DATASET_TERMS_TABS_KEYS.datasetTerms}
            licenseRepository={licenseRepository}
            guestbookRepository={guestbookRepository}
          />,
          dataset
        )
      )

      cy.get('select').select('CC0 1.0')
      cy.findByRole('tab', { name: 'Dataset Terms' }).click()
      cy.findByText('Unsaved Changes').should('not.exist')
      cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')
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
            guestbookRepository={guestbookRepository}
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
      <WithRepositories datasetRepository={datasetRepository}>
        <DatasetProvider
          searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}
          repository={datasetRepository}>
          {component}
        </DatasetProvider>
      </WithRepositories>
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
          guestbookRepository={guestbookRepository}
        />,
        dataset
      )
    )

    cy.findByText('Dataset Terms').should('exist')
    cy.findByText('Restricted Files + Terms of Access').should('exist')
  })
})

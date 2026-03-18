import { ReactNode, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { EditGuestbook } from '@/sections/edit-dataset-terms/edit-guestbook/EditGuestbook'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import {
  DatasetMother,
  DatasetVersionMother
} from '@tests/component/dataset/domain/models/DatasetMother'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'

const LocationDisplay = () => {
  const location = useLocation()
  return <div data-testid="location-display">{`${location.pathname}${location.search}`}</div>
}

const datasetRepository: DatasetRepository = {} as DatasetRepository
let guestbookRepository: GuestbookRepository

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
    createTime: '2026-01-01T00:00:00.000Z',
    dataverseId: 1
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
    createTime: '2026-01-01T00:00:00.000Z',
    dataverseId: 1
  }
]

describe('EditGuestbook', () => {
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

  const withDatasetContext = (component: ReactNode, dataset: Dataset | undefined) => (
    <DatasetContext.Provider
      value={{
        dataset,
        isLoading: false,
        refreshDataset: () => {}
      }}>
      {component}
    </DatasetContext.Provider>
  )

  beforeEach(() => {
    guestbookRepository = {
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy.stub().resolves(mockGuestbooks),
      assignDatasetGuestbook: cy.stub().resolves(undefined),
      removeDatasetGuestbook: cy.stub().resolves(undefined)
    }
  })

  it('renders guestbook options and keeps Save Changes disabled for current guestbook', () => {
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Data Request Guestbook').should('be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Clear Selection' }).should('be.enabled')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('enables Save Changes when selecting a different guestbook', () => {
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
  })

  it('keeps Save Changes disabled when dataset has no assigned guestbook and none is selected', () => {
    const dataset = DatasetMother.create({ guestbookId: undefined })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Clear Selection' }).should('not.exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('falls back to no preselection when dataset has no guestbook id', () => {
    const dataset = DatasetMother.create({ guestbookId: undefined })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Clear Selection' }).should('not.exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('clears the selected guestbook when clicking Clear Selection', () => {
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByRole('button', { name: 'Clear Selection' }).click()

    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Clear Selection' }).should('not.exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
  })

  it('renders the empty state message with the collection name', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).resolves(
      []
    )
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Data Request Guestbook').should('not.exist')
    cy.findByLabelText('Secondary Guestbook').should('not.exist')
    cy.findByRole('link', { name: 'Dataset Guestbook' }).should(
      'have.attr',
      'href',
      'https://guides.dataverse.org/en/6.9/user/dataverse-management.html#dataset-guestbooks'
    )
    cy.findByText(/There are no guestbooks enabled in Root\./).should('exist')
    cy.findByText(/To create a guestbook, return to Root,/).should('exist')
    cy.findByText(/select the "Dataset Guestbooks" option\./).should('exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('opens preview modal when clicking Preview Guestbook', () => {
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findAllByRole('button', { name: 'Preview Guestbook' }).should('have.length', 2)
    cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(1).click()

    cy.findByRole('dialog')
      .should('be.visible')
      .within(() => {
        cy.findByText('Secondary Guestbook').should('exist')
        cy.findByText(/How will you use this data\?/).should('exist')
        cy.findByText('Preview Guestbook').should('exist')
        cy.findByText('Secondary Guestbook').should('exist')
        cy.findByText(/Account Information/).should('exist')
        cy.findByText(/Custom Questions/).should('exist')
        cy.findByText(/Email \(Required\)/).should('exist')
        cy.findByText(/Institution \(Optional\)/).should('exist')
        cy.findByText(/Name \(Optional\)/).should('exist')
        cy.findByText(/Position \(Optional\)/).should('exist')
      })
  })

  it('closes preview modal when clicking Close', () => {
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(0).click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('calls onPreview callback when provided', () => {
    const onPreview = cy.stub().as('onPreview')
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(
        <EditGuestbook guestbookRepository={guestbookRepository} onPreview={onPreview} />,
        dataset
      )
    )

    cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(0).click()
    cy.get('@onPreview').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
  })

  it('submits selected guestbook', () => {
    const assignDatasetGuestbookStub =
      guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    assignDatasetGuestbookStub.resolves(undefined)
    assignDatasetGuestbookStub.as('assignDatasetGuestbookExecute')
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@assignDatasetGuestbookExecute').should(
      'have.been.calledOnceWith',
      999,
      mockGuestbooks[1].id
    )
  })

  it('navigates back to the dataset view when clicking Cancel without submitting', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).as(
      'assignDatasetGuestbookExecute'
    )
    const releasedDataset = DatasetMother.create({
      id: 999,
      persistentId: 'doi:10.5072/FK2/CANCELPID',
      guestbookId: mockGuestbooks[0].id,
      version: DatasetVersionMother.createReleased()
    })

    cy.customMount(
      withProviders(
        <>
          <EditGuestbook guestbookRepository={guestbookRepository} />
          <LocationDisplay />
        </>,
        releasedDataset
      )
    )

    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.findByTestId('location-display').should(
      'have.text',
      '/datasets?persistentId=doi%3A10.5072%2FFK2%2FCANCELPID&version=1.0'
    )
    cy.get('@assignDatasetGuestbookExecute').should('not.have.been.called')
  })

  it('navigates with DRAFT version query param after successful submit for draft datasets', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).resolves(
      undefined
    )
    const draftDataset = DatasetMother.create({
      id: 999,
      persistentId: 'doi:10.5072/FK2/DRAFTPID',
      guestbookId: mockGuestbooks[0].id,
      version: DatasetVersionMother.createDraft()
    })

    cy.customMount(
      withProviders(
        <>
          <EditGuestbook guestbookRepository={guestbookRepository} />
          <LocationDisplay />
        </>,
        draftDataset
      )
    )

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByTestId('location-display').should(
      'have.text',
      '/datasets?persistentId=doi%3A10.5072%2FFK2%2FDRAFTPID&version=DRAFT'
    )
  })

  it('navigates with numeric version query param after successful submit for non-draft datasets', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).resolves(
      undefined
    )
    const releasedDataset = DatasetMother.create({
      id: 999,
      persistentId: 'doi:10.5072/FK2/RELEASEDPID',
      guestbookId: mockGuestbooks[0].id,
      version: DatasetVersionMother.createReleased()
    })

    cy.customMount(
      withProviders(
        <>
          <EditGuestbook guestbookRepository={guestbookRepository} />
          <LocationDisplay />
        </>,
        releasedDataset
      )
    )

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByTestId('location-display').should(
      'have.text',
      '/datasets?persistentId=doi%3A10.5072%2FFK2%2FRELEASEDPID&version=1.0'
    )
  })

  it('keeps selected guestbook when dataset has no assigned guestbook and selected id still exists after guestbooks refresh', () => {
    const collectionA = 'collection-a'
    const collectionB = 'collection-b'
    const guestbooksForA = mockGuestbooks
    const guestbooksForB = [mockGuestbooks[1]]

    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).callsFake(
      (collectionIdOrAlias) => {
        if (collectionIdOrAlias === collectionA) return Promise.resolve(guestbooksForA)
        return Promise.resolve(guestbooksForB)
      }
    )

    const createDataset = (collectionId: string) =>
      DatasetMother.create({
        guestbookId: undefined,
        hierarchy: UpwardHierarchyNodeMother.createDataset({
          parent: UpwardHierarchyNodeMother.createCollection({ id: collectionId, name: 'Root' })
        })
      })

    const Harness = () => {
      const [dataset, setDataset] = useState<Dataset>(createDataset(collectionA))
      return (
        <>
          {withDatasetContext(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)}
          <button onClick={() => setDataset(createDataset(collectionB))} type="button">
            Switch Collection
          </button>
        </>
      )
    }

    cy.customMount(<Harness />)

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
    cy.findByRole('button', { name: 'Switch Collection' }).click()
    cy.findByLabelText('Secondary Guestbook').should('be.checked')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
  })

  it('keeps current selected guestbook when dataset has assigned guestbook but user selected another valid guestbook', () => {
    const collectionA = 'collection-a'
    const collectionB = 'collection-b'
    const guestbooksForA = mockGuestbooks
    const guestbooksForB = [mockGuestbooks[0], mockGuestbooks[1]]

    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).callsFake(
      (collectionIdOrAlias) => {
        if (collectionIdOrAlias === collectionA) return Promise.resolve(guestbooksForA)
        return Promise.resolve(guestbooksForB)
      }
    )

    const createDataset = (collectionId: string) =>
      DatasetMother.create({
        guestbookId: mockGuestbooks[0].id,
        hierarchy: UpwardHierarchyNodeMother.createDataset({
          parent: UpwardHierarchyNodeMother.createCollection({ id: collectionId, name: 'Root' })
        })
      })

    const Harness = () => {
      const [dataset, setDataset] = useState<Dataset>(createDataset(collectionA))
      return (
        <>
          {withDatasetContext(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)}
          <button onClick={() => setDataset(createDataset(collectionB))} type="button">
            Switch Collection
          </button>
        </>
      )
    }

    cy.customMount(<Harness />)

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Switch Collection' }).click()
    cy.findByLabelText('Secondary Guestbook').should('be.checked')
    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
  })

  it('does not submit when selectedGuestbookId is undefined and dataset has no guestbook', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).as(
      'assignDatasetGuestbookExecute'
    )
    ;(guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).as(
      'removeDatasetGuestbookExecute'
    )
    const dataset = DatasetMother.create({ id: 999, guestbookId: undefined })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.get('form').submit()
    cy.get('@assignDatasetGuestbookExecute').should('not.have.been.called')
    cy.get('@removeDatasetGuestbookExecute').should('not.have.been.called')
  })

  it('does not submit when dataset is undefined', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).as(
      'assignDatasetGuestbookExecute'
    )
    ;(guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).as(
      'removeDatasetGuestbookExecute'
    )

    cy.customMount(
      withDatasetContext(<EditGuestbook guestbookRepository={guestbookRepository} />, undefined)
    )

    cy.get('form').submit()
    cy.get('@assignDatasetGuestbookExecute').should('not.have.been.called')
    cy.get('@removeDatasetGuestbookExecute').should('not.have.been.called')
  })

  it('removes selected guestbook when selection is cleared and saved', () => {
    const removeDatasetGuestbookStub =
      guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>
    removeDatasetGuestbookStub.resolves(undefined)
    removeDatasetGuestbookStub.as('removeDatasetGuestbookExecute')
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByRole('button', { name: 'Clear Selection' }).click()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@removeDatasetGuestbookExecute').should('have.been.calledOnceWith', 999)
    cy.wrap(guestbookRepository.assignDatasetGuestbook).should('not.have.been.called')
  })

  it('shows assign guestbook error alert when save fails', () => {
    ;(guestbookRepository.assignDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('unexpected')
    )
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByText(
      /An error occurred while updating the dataset guestbook. Please try again./
    ).should('exist')
  })

  it('shows remove guestbook error alert when clear and save fails', () => {
    ;(guestbookRepository.removeDatasetGuestbook as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('unexpected')
    )
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByRole('button', { name: 'Clear Selection' }).click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByText(
      /An error occurred while updating the dataset guestbook. Please try again./
    ).should('exist')
  })

  it('shows an error alert when loading guestbooks fails', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('network error')
    )
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(
      withProviders(<EditGuestbook guestbookRepository={guestbookRepository} />, dataset)
    )

    cy.findByText(
      /Something went wrong getting guestbooks by collection id. Try again later./
    ).should('exist')
  })
})

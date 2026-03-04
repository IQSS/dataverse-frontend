import { ReactNode } from 'react'
import { EditGuestbook } from '@/sections/edit-dataset-terms/edit-guestbook/EditGuestbook'
import { DatasetProvider } from '@/sections/dataset/DatasetProvider'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import {
  assignDatasetGuestbook,
  getGuestbooksByCollectionId
} from '@iqss/dataverse-client-javascript'

const datasetRepository: DatasetRepository = {} as DatasetRepository

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

  it('renders guestbook options and keeps Save Changes disabled for current guestbook', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Data Request Guestbook').should('be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('enables Save Changes when selecting a different guestbook', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
  })

  it('keeps Save Changes disabled when dataset has no assigned guestbook and none is selected', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: undefined })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('falls back to no preselection when dataset guestbook is not in fetched list', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: 9999 })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Data Request Guestbook').should('not.be.checked')
    cy.findByLabelText('Secondary Guestbook').should('not.be.checked')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('handles empty guestbook list', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves([])
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Data Request Guestbook').should('not.exist')
    cy.findByLabelText('Secondary Guestbook').should('not.exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('be.disabled')
  })

  it('opens preview modal when clicking Preview Guestbook', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

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
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(0).click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('calls onPreview callback when provided', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const onPreview = cy.stub().as('onPreview')
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook onPreview={onPreview} />, dataset))

    cy.findAllByRole('button', { name: 'Preview Guestbook' }).eq(0).click()
    cy.get('@onPreview').should('have.been.calledOnce')
    cy.findByRole('dialog').should('not.exist')
  })

  it('submits selected guestbook', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    const assignDatasetGuestbookExecute = cy.stub(assignDatasetGuestbook, 'execute')
    assignDatasetGuestbookExecute.resolves(undefined)
    assignDatasetGuestbookExecute.as('assignDatasetGuestbookExecute')
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@assignDatasetGuestbookExecute').should(
      'have.been.calledOnceWith',
      999,
      mockGuestbooks[1].id
    )
  })

  it('shows assign guestbook error alert when save fails', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').resolves(mockGuestbooks)
    cy.stub(assignDatasetGuestbook, 'execute').rejects(new Error('unexpected'))
    const dataset = DatasetMother.create({ id: 999, guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByLabelText('Secondary Guestbook').click()
    cy.findByRole('button', { name: 'Save Changes' }).click()
    cy.findByText(
      /An error occurred while updating the dataset guestbook. Please try again./
    ).should('exist')
  })

  it('shows an error alert when loading guestbooks fails', () => {
    cy.stub(getGuestbooksByCollectionId, 'execute').rejects(new Error('network error'))
    const dataset = DatasetMother.create({ guestbookId: mockGuestbooks[0].id })

    cy.customMount(withProviders(<EditGuestbook />, dataset))

    cy.findByText(
      /Something went wrong getting guestbooks by collection id. Try again later./
    ).should('exist')
  })
})

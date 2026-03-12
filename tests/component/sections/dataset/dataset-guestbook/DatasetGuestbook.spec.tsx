import * as guestbookHookModule from '@/sections/dataset/dataset-guestbook/useGetGuestbookById'
import { DatasetGuestbook } from '@/sections/dataset/dataset-guestbook/DatasetGuestbook'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'

const guestbookRepository: GuestbookRepository = {
  getGuestbook: cy.stub(),
  assignDatasetGuestbook: cy.stub().resolves(undefined),
  removeDatasetGuestbook: cy.stub().resolves(undefined)
}

const guestbook: Guestbook = {
  id: 10,
  name: 'Guestbook Test',
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 1
}

describe('DatasetGuestbook', () => {
  const mountComponent = () =>
    cy.customMount(
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <DatasetContext.Provider
          value={{
            dataset: DatasetMother.create({ guestbookId: guestbook.id }),
            isLoading: false,
            refreshDataset: () => {}
          }}>
          <DatasetGuestbook />
        </DatasetContext.Provider>
      </GuestbookRepositoryProvider>
    )

  it('renders a spinner while the guestbook is loading', () => {
    cy.stub(guestbookHookModule, 'useGetGuestbookById').returns({
      guestbook,
      isLoadingGuestbook: true,
      errorGetGuestbook: null,
      fetchGuestbook: cy.stub()
    })

    mountComponent()

    cy.get('[data-testid="dataset-guestbook-section"]').find('.spinner-border').should('exist')
  })

  it('renders a fallback dash when the guestbook name is missing', () => {
    cy.stub(guestbookHookModule, 'useGetGuestbookById').returns({
      guestbook: { ...guestbook, name: undefined } as unknown as Guestbook,
      isLoadingGuestbook: false,
      errorGetGuestbook: null,
      fetchGuestbook: cy.stub()
    })

    mountComponent()

    cy.findByTestId('dataset-guestbook-name').should('have.text', '-')
  })

  it('opens and closes the preview modal from the preview button', () => {
    cy.stub(guestbookHookModule, 'useGetGuestbookById').returns({
      guestbook,
      isLoadingGuestbook: false,
      errorGetGuestbook: null,
      fetchGuestbook: cy.stub()
    })

    mountComponent()

    cy.findByRole('button', { name: 'Preview Guestbook' }).click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByRole('button', { name: 'Close' }).click()
    cy.findByRole('dialog').should('not.exist')
  })
})

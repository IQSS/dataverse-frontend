import { DatasetGuestbook } from '@/sections/dataset/dataset-guestbook/DatasetGuestbook'
import { DatasetContext } from '@/sections/dataset/DatasetContext'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { Dataset as DatasetModel } from '@/dataset/domain/models/Dataset'
import { DatasetMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { QueryParamKey, Route } from '@/sections/Route.enum'

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
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    guestbookRepository = {
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy.stub(),
      assignDatasetGuestbook: cy.stub().resolves(undefined),
      removeDatasetGuestbook: cy.stub().resolves(undefined)
    }
  })

  const mountComponent = (
    dataset: DatasetModel = DatasetMother.create({ guestbookId: guestbook.id })
  ) =>
    cy.customMount(
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <DatasetContext.Provider
          value={{
            dataset,
            isLoading: false,
            refreshDataset: () => {}
          }}>
          <DatasetGuestbook />
        </DatasetContext.Provider>
      </GuestbookRepositoryProvider>
    )

  it('renders a spinner while the guestbook is loading', () => {
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).returns(
      new Promise(() => {})
    )

    mountComponent()

    cy.get('[data-testid="dataset-guestbook-section"]').find('.spinner-border').should('exist')
  })

  it('renders a fallback dash when the guestbook name is missing', () => {
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).resolves({
      ...guestbook,
      name: undefined
    } as unknown as Guestbook)

    mountComponent()

    cy.findByTestId('dataset-guestbook-name').should('have.text', '-')
  })

  it('opens and closes the preview modal from the preview button', () => {
    const dataset = DatasetMother.create({ guestbookId: guestbook.id })
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).resolves({
      ...guestbook,
      customQuestions: [
        {
          question: 'How will you use this data?',
          required: true,
          displayOrder: 1,
          type: 'text',
          hidden: false
        }
      ]
    })

    mountComponent(dataset)

    cy.findByRole('button', { name: 'Preview Guestbook' }).should('exist')
    cy.findByRole('button', { name: 'Preview Guestbook' }).click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByRole('link', { name: 'Custom Questions' }).should(
      'have.attr',
      'href',
      `/spa${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${encodeURIComponent(
        dataset.persistentId
      )}&${QueryParamKey.TAB}=terms&termsTab=guestbook`
    )
    cy.findByRole('dialog').within(() => {
      cy.findAllByRole('button', { name: 'Close' }).last().click()
    })
    cy.findByRole('dialog').should('not.exist')
  })
})

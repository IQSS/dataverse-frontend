import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { EditGuestbook } from '@/sections/guestbooks/edit-guestbook/EditGuestbook'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const guestbook: Guestbook = {
  id: 10,
  name: 'Research Guestbook',
  enabled: true,
  emailRequired: true,
  nameRequired: false,
  institutionRequired: true,
  positionRequired: false,
  customQuestions: [
    {
      id: 55,
      question: 'Preferred format',
      required: true,
      displayOrder: 0,
      type: 'options',
      hidden: false,
      optionValues: [
        { id: 101, value: 'CSV', displayOrder: 0 },
        { id: 102, value: 'JSON', displayOrder: 1 }
      ]
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 17
}

describe('EditGuestbook', () => {
  const collectionRepository = {} as CollectionRepository
  let guestbookRepository: GuestbookRepository

  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: '17',
        name: 'SubCollection'
      })
    )
    guestbookRepository = {
      createGuestbook: cy.stub(),
      editGuestbook: cy.stub().as('editGuestbook').resolves(undefined),
      getGuestbook: cy.stub().as('getGuestbook').resolves(guestbook),
      getGuestbooksByCollectionId: cy.stub(),
      getGuestbookResponsesByGuestbookId: cy.stub(),
      setGuestbookEnabled: cy.stub(),
      downloadGuestbookResponsesByCollectionId: cy.stub(),
      downloadGuestbookResponsesByGuestbookId: cy.stub(),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }
  })

  const mountComponent = () =>
    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <EditGuestbook
          collectionId="17"
          guestbookId={guestbook.id}
          collectionRepository={collectionRepository}
        />
      </WithRepositories>
    )

  it('prefills fields correctly', () => {
    mountComponent()

    cy.findByDisplayValue('Research Guestbook').should('exist')
    cy.findByLabelText('Email').should('be.checked')
    cy.findByLabelText('Institution').should('be.checked')
    cy.findByLabelText('Name').should('not.be.checked')
    cy.findByLabelText('Position').should('not.be.checked')
    cy.findByDisplayValue('Preferred format').should('exist')
    cy.findByDisplayValue('CSV').should('exist')
    cy.findByDisplayValue('JSON').should('exist')
    cy.findByLabelText('Required field').should('be.checked')

    cy.get('@getGuestbook').should('have.been.calledOnceWith', guestbook.id)
    cy.get('@editGuestbook').should('not.have.been.called')
  })

  it('shows success toast after save changes', () => {
    mountComponent()

    cy.findByDisplayValue('Research Guestbook').clear().type('Updated Guestbook')
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.get('@editGuestbook').should('have.been.calledOnce')
    cy.findByText('The guestbook has been updated.').should('exist')
  })

  it('renders when the guestbook response omits custom questions', () => {
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).resolves({
      ...guestbook,
      customQuestions: undefined
    })

    mountComponent()

    cy.findByDisplayValue('Research Guestbook').should('exist')
    cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    cy.findByLabelText('Add question').should('exist')
  })

  it('renders collection not found page when the collection cannot be fetched', () => {
    collectionRepository.getById = cy.stub().rejects(new Error('missing collection'))

    mountComponent()

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText(/We can't find the/i).should('exist')
    cy.findByText('Collection').should('exist')
  })

  it('renders not found page when the guestbook cannot be found', () => {
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).resolves(undefined)

    mountComponent()

    cy.findByTestId('not-found-page').should('exist')
  })

  it('shows an error alert when getting the guestbook fails', () => {
    ;(guestbookRepository.getGuestbook as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('unexpected')
    )

    mountComponent()

    cy.findByText(/Something went wrong getting the guestbook/i).should('exist')
  })

  it('shows an error alert when editing the guestbook fails', () => {
    ;(guestbookRepository.editGuestbook as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('unexpected')
    )

    mountComponent()

    cy.findByDisplayValue('Research Guestbook').clear().type('Updated Guestbook')
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.findByText(/unexpected/i).should('exist')
  })
})

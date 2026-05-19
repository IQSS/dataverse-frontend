import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookRepositoryProvider } from '@/sections/guestbooks/GuestbookRepositoryProvider'
import { Guestbooks } from '@/sections/guestbooks/ManageGuestbooks'

describe('ManageGuestbooks', () => {
  const collectionRepository = {} as CollectionRepository
  let guestbookRepository: GuestbookRepository

  const guestbook: Guestbook = {
    id: 10,
    name: 'Downloadable Guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: true,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [],
    createTime: '2026-01-01T00:00:00.000Z',
    dataverseId: 17
  }
  const rootGuestbook: Guestbook = {
    id: 11,
    name: 'Alpha Root Guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: false,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [],
    createTime: '2025-01-01T00:00:00.000Z',
    dataverseId: 1
  }
  const localGuestbookLater: Guestbook = {
    id: 12,
    name: 'zeta local guestbook',
    enabled: true,
    emailRequired: true,
    nameRequired: false,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [
      { question: 'Q1', required: false, displayOrder: 1, type: 'text', hidden: false }
    ],
    createTime: '2027-01-01T00:00:00.000Z',
    dataverseId: 17
  }
  const localGuestbookMostQuestions: Guestbook = {
    id: 13,
    name: 'Beta Local Guestbook',
    enabled: false,
    emailRequired: true,
    nameRequired: false,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [
      { question: 'Q1', required: false, displayOrder: 1, type: 'text', hidden: false },
      { question: 'Q2', required: false, displayOrder: 2, type: 'text', hidden: false }
    ],
    createTime: '2024-01-01T00:00:00.000Z',
    dataverseId: 17
  }

  const TranslationPreloader = ({ children }: { children: ReactNode }) => {
    useTranslation('guestbooks')

    return <>{children}</>
  }

  const defaultGuestbooks = [
    guestbook,
    rootGuestbook,
    localGuestbookLater,
    localGuestbookMostQuestions
  ]

  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: '17',
        name: 'Root'
      })
    )

    guestbookRepository = {
      createGuestbook: cy.stub(),
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy.stub().resolves(defaultGuestbooks),
      setGuestbookEnabled: cy.stub().as('setGuestbookEnabled').resolves(undefined),
      downloadGuestbookResponsesByDataverseId: cy
        .stub()
        .as('downloadGuestbookResponsesByDataverseId')
        .resolves('name,email\nJane Doe,jane@example.com'),
      downloadGuestbookResponsesOfAGuestbook: cy
        .stub()
        .as('downloadGuestbookResponsesOfAGuestbook')
        .resolves('name,email\nJane Doe,jane@example.com'),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('blob:guestbook-download')
      cy.stub(win.URL, 'revokeObjectURL')
    })
  })

  const mountComponent = () =>
    cy.customMount(
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <Suspense fallback="loading">
          <TranslationPreloader>
            <Guestbooks collectionRepository={collectionRepository} collectionId="17" />
          </TranslationPreloader>
        </Suspense>
      </GuestbookRepositoryProvider>
    )

  const getRenderedGuestbookNames = () =>
    cy
      .get('tbody tr td:first-child')
      .then(($cells) => [...$cells].map((cell) => cell.textContent?.trim() ?? ''))

  it('downloads guestbook responses from the guestbook page ui', () => {
    const createElementSpy = cy.spy(document, 'createElement')

    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'Download responses' })
      .click()

    cy.get('@downloadGuestbookResponsesOfAGuestbook').should('have.been.calledOnceWith', 17, 10)
    cy.then(() => {
      expect(createElementSpy).to.have.been.calledWith('a')
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
    cy.findByText('Your download has started.').should('exist')
  })

  it('sorts guestbooks by name and toggles sort direction on repeated clicks', () => {
    mountComponent()

    cy.findByRole('button', { name: /Guestbook Name/i }).click()
    cy.findByRole('button', { name: /Guestbook Name/i })
      .should('have.attr', 'aria-pressed', 'true')
      .invoke('attr', 'class')
      .should('include', 'sort-button-active')
    cy.findByRole('button', { name: /Guestbook Name/i })
      .closest('th')
      .invoke('attr', 'class')
      .should('include', 'sort-header-active')
    getRenderedGuestbookNames().should('deep.equal', [
      'Alpha Root Guestbook',
      'Beta Local Guestbook',
      'Downloadable Guestbook',
      'zeta local guestbook'
    ])

    cy.findByRole('button', { name: /Guestbook Name/i }).click()
    getRenderedGuestbookNames().should('deep.equal', [
      'zeta local guestbook',
      'Downloadable Guestbook',
      'Beta Local Guestbook',
      'Alpha Root Guestbook'
    ])
  })

  it('sorts guestbooks by created date', () => {
    mountComponent()

    cy.findByRole('button', { name: /Created/i }).click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Beta Local Guestbook',
      'Alpha Root Guestbook',
      'Downloadable Guestbook',
      'zeta local guestbook'
    ])
  })

  it('sorts guestbooks by responses using custom question count', () => {
    mountComponent()

    cy.findByRole('button', { name: /Download All Responses/i }).click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Downloadable Guestbook',
      'Alpha Root Guestbook',
      'zeta local guestbook',
      'Beta Local Guestbook'
    ])
  })

  it('filters inherited guestbooks when include guestbooks from root is toggled', () => {
    mountComponent()

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.findByText('Alpha Root Guestbook').should('not.exist')
    cy.findByText('Downloadable Guestbook').should('exist')
    cy.findByText('Beta Local Guestbook').should('exist')

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.findByText('Alpha Root Guestbook').should('exist')
  })

  it('opens and closes the preview guestbook modal from the page ui', () => {
    mountComponent()

    cy.findAllByRole('button', { name: 'View' }).first().click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Preview Guestbook').should('exist')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('downloads all guestbook responses from the dataverse use case', () => {
    const createElementSpy = cy.spy(document, 'createElement')

    mountComponent()

    cy.findByText('Download All Responses').click()

    cy.get('@downloadGuestbookResponsesByDataverseId').should('have.been.calledOnceWith', '17')
    cy.then(() => {
      expect(createElementSpy).to.have.been.calledWith('a')
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
    cy.findByText('Your download has started.').should('exist')
  })

  it('toggles a guestbook through the setGuestbookEnabled use case and refreshes the table', () => {
    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'Disable' })
      .click()

    cy.get('@setGuestbookEnabled').should('have.been.calledOnceWith', 17, 10, false)
    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'Enable' })
      .should('exist')
    cy.findByText('The guestbook status has been updated.').should('exist')
  })

  it('shows an error when toggling guestbook status fails', () => {
    ;(guestbookRepository.setGuestbookEnabled as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('toggle failed')
    )

    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'Disable' })
      .click()

    cy.findByText(/Something went wrong updating the guestbook status. Try again later.*/i).should(
      'exist'
    )
  })

  it('shows an error when guestbook response download fails', () => {
    ;(
      guestbookRepository.downloadGuestbookResponsesOfAGuestbook as Cypress.Agent<sinon.SinonStub>
    ).rejects(new Error('download failed'))

    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'Download responses' })
      .click()

    cy.findByText(
      /Something went wrong downloading guestbook responses. Try again later.*/i
    ).should('exist')
  })

  it('shows an error when downloading all guestbook responses fails', () => {
    ;(
      guestbookRepository.downloadGuestbookResponsesByDataverseId as Cypress.Agent<sinon.SinonStub>
    ).rejects(new Error('download failed'))

    mountComponent()

    cy.findByText('Download All Responses').click()

    cy.findByText(
      /Something went wrong downloading guestbook responses. Try again later.*/i
    ).should('exist')
  })

  it('shows an error alert when fetching guestbooks fails', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).rejects(
      new Error('unexpected')
    )

    mountComponent()

    cy.findByRole('alert')
      .should('exist')
      .and(
        'contain.text',
        'Something went wrong getting guestbooks by collection id. Try again later.'
      )
  })
})

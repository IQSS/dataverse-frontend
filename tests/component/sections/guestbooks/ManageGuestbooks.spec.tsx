import { ReactNode, Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { Guestbooks } from '@/sections/guestbooks/ManageGuestbooks'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { WithRepositories } from '@tests/component/WithRepositories'

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
    dataverseId: 17,
    usageCount: 5,
    responseCount: 1
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
    dataverseId: 1,
    usageCount: 1,
    responseCount: 2
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
    dataverseId: 17,
    usageCount: 3,
    responseCount: 4
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
    dataverseId: 17,
    usageCount: 8,
    responseCount: 6
  }
  const guestbookWithoutStats: Guestbook = {
    id: 14,
    name: 'Stats Missing Guestbook',
    enabled: true,
    emailRequired: false,
    nameRequired: false,
    institutionRequired: false,
    positionRequired: false,
    customQuestions: [],
    createTime: '2026-06-01T00:00:00.000Z',
    dataverseId: 17
  }

  const TranslationPreloader = ({ children }: { children: ReactNode }) => {
    useTranslation('guestbooks')

    return <>{children}</>
  }

  const LocationDisplay = () => {
    const location = useLocation()

    return <div data-testid="location-display">{location.pathname}</div>
  }

  const defaultGuestbooks = [
    guestbook,
    rootGuestbook,
    localGuestbookLater,
    localGuestbookMostQuestions
  ]
  const currentCollectionGuestbooks = [
    guestbook,
    localGuestbookLater,
    localGuestbookMostQuestions,
    guestbookWithoutStats
  ]

  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: '17',
        name: 'SubCollection',
        hierarchy: UpwardHierarchyNodeMother.createSubCollection({
          id: '17',
          name: 'SubCollection',
          parent: UpwardHierarchyNodeMother.createCollection({
            id: 'root',
            name: 'Root'
          })
        })
      })
    )

    guestbookRepository = {
      createGuestbook: cy.stub(),
      editGuestbook: cy.stub(),
      getGuestbook: cy.stub(),
      getGuestbooksByCollectionId: cy
        .stub()
        .callsFake(
          (
            _collectionIdOrAlias: number | string,
            _includeStats = false,
            includeInherited = false
          ) => Promise.resolve(includeInherited ? defaultGuestbooks : currentCollectionGuestbooks)
        ),
      getGuestbookResponsesByGuestbookId: cy.stub(),
      setGuestbookEnabled: cy.stub().as('setGuestbookEnabled').resolves(undefined),
      downloadGuestbookResponsesByCollectionId: cy
        .stub()
        .as('downloadGuestbookResponsesByCollectionId')
        .resolves('name,email\nJane Doe,jane@example.com'),
      downloadGuestbookResponsesByGuestbookId: cy
        .stub()
        .as('downloadGuestbookResponsesByGuestbookId')
        .resolves('name,email\nJane Doe,jane@example.com'),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('blob:guestbook-download')
      cy.stub(win.URL, 'revokeObjectURL')
    })
  })

  const mountComponent = (collectionId = '17') =>
    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <Suspense fallback="loading">
          <TranslationPreloader>
            <Guestbooks collectionRepository={collectionRepository} collectionId={collectionId} />
            <LocationDisplay />
          </TranslationPreloader>
        </Suspense>
      </WithRepositories>
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

    cy.get('@downloadGuestbookResponsesByGuestbookId').should('have.been.calledOnceWith', 17, 10)
    cy.then(() => {
      expect(createElementSpy).to.have.been.calledWith('a')
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
    cy.findByText('Your download has started.').should('exist')
  })

  it('navigates to the guestbook responses page from the view responses action', () => {
    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook')
      .findByRole('button', { name: 'View Responses' })
      .click()

    cy.findByTestId('location-display').should('have.text', '/17/guestbooks/10/responses')
  })

  it('navigates to the create guestbook page from the copy action', () => {
    mountComponent()

    cy.contains('tbody tr', 'Downloadable Guestbook').findByRole('button', { name: 'Copy' }).click()

    cy.findByTestId('location-display').should('have.text', '/17/guestbooks/create')
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

  it('sorts guestbooks by usage count', () => {
    mountComponent()

    cy.get('thead')
      .findByRole('button', { name: /^Usage$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Alpha Root Guestbook',
      'zeta local guestbook',
      'Downloadable Guestbook',
      'Beta Local Guestbook'
    ])
  })

  it('sorts guestbooks by usage count with missing stats treated as zero and toggles direction', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).resolves([
      guestbook,
      guestbookWithoutStats,
      localGuestbookLater
    ])

    mountComponent()

    cy.get('thead')
      .findByRole('button', { name: /^Usage$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Stats Missing Guestbook',
      'zeta local guestbook',
      'Downloadable Guestbook'
    ])

    cy.contains('tbody tr', 'Stats Missing Guestbook').within(() => {
      cy.get('td').eq(2).should('have.text', '0')
      cy.get('td').eq(3).should('have.text', '0')
    })

    cy.get('thead')
      .findByRole('button', { name: /^Usage$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Downloadable Guestbook',
      'zeta local guestbook',
      'Stats Missing Guestbook'
    ])
  })

  it('sorts guestbooks by response count', () => {
    mountComponent()

    cy.get('thead')
      .findByRole('button', { name: /^Responses$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Downloadable Guestbook',
      'Alpha Root Guestbook',
      'zeta local guestbook',
      'Beta Local Guestbook'
    ])
  })

  it('sorts guestbooks by response count with missing stats treated as zero and toggles direction', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).resolves([
      guestbook,
      guestbookWithoutStats,
      localGuestbookLater
    ])

    mountComponent()

    cy.get('thead')
      .findByRole('button', { name: /^Responses$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'Stats Missing Guestbook',
      'Downloadable Guestbook',
      'zeta local guestbook'
    ])

    cy.get('thead')
      .findByRole('button', { name: /^Responses$/i })
      .click()

    getRenderedGuestbookNames().should('deep.equal', [
      'zeta local guestbook',
      'Downloadable Guestbook',
      'Stats Missing Guestbook'
    ])
  })

  it('prefills usage and response counts from the guestbooks stats payload', () => {
    mountComponent()

    cy.get('tbody tr')
      .eq(0)
      .within(() => {
        cy.get('td').eq(2).should('have.text', '5')
        cy.get('td').eq(3).should('have.text', '1')
      })

    cy.get('tbody tr')
      .eq(3)
      .within(() => {
        cy.get('td').eq(2).should('have.text', '8')
        cy.get('td').eq(3).should('have.text', '6')
      })

    cy.wrap(
      guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>
    ).should('have.been.calledWith', '17', true, true)
    cy.wrap(
      guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>
    ).should('have.been.calledWith', '17', false, false)
  })

  it('fetches and filters inherited guestbooks when include guestbooks from parent is toggled', () => {
    mountComponent()

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.wrap(
      guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>
    ).should('have.been.calledWith', '17', true, false)
    cy.findByText('Alpha Root Guestbook').should('not.exist')
    cy.findByText('Downloadable Guestbook').should('exist')
    cy.findByText('Beta Local Guestbook').should('exist')

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.wrap(
      guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>
    ).should('have.been.calledWith', '17', true, true)
    cy.findByText('Alpha Root Guestbook').should('exist')
  })

  it('passes includeInherited from the include guestbooks from parent checkbox state', () => {
    const getGuestbooksByCollectionIdStub =
      guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>

    mountComponent()

    cy.findByLabelText('Include Guestbooks from Root').should('be.checked')
    cy.wrap(getGuestbooksByCollectionIdStub).should('have.been.calledWith', '17', true, true)
    cy.wrap(getGuestbooksByCollectionIdStub).should('have.been.calledWith', '17', false, false)

    cy.then(() => {
      getGuestbooksByCollectionIdStub.resetHistory()
    })

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.findByLabelText('Include Guestbooks from Root').should('not.be.checked')
    cy.wrap(getGuestbooksByCollectionIdStub).should('have.been.calledOnceWith', '17', true, false)

    cy.then(() => {
      getGuestbooksByCollectionIdStub.resetHistory()
    })

    cy.findByLabelText('Include Guestbooks from Root').click()
    cy.findByLabelText('Include Guestbooks from Root').should('be.checked')
    cy.wrap(getGuestbooksByCollectionIdStub).should('have.been.calledOnceWith', '17', true, true)
  })

  it('hides the include guestbooks checkbox at the root collection', () => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: 'root',
        name: 'Root',
        hierarchy: UpwardHierarchyNodeMother.createCollection({
          id: 'root',
          name: 'Root'
        })
      })
    )

    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <Suspense fallback="loading">
          <TranslationPreloader>
            <Guestbooks collectionRepository={collectionRepository} collectionId="root" />
          </TranslationPreloader>
        </Suspense>
      </WithRepositories>
    )

    cy.findByLabelText('Include Guestbooks from Root').should('not.exist')
  })

  it('uses Parent in the include guestbooks checkbox label when the parent hierarchy name is missing', () => {
    const parentNodeWithoutName = new UpwardHierarchyNode(
      undefined as unknown as string,
      DvObjectType.COLLECTION,
      'root'
    )
    const subCollectionNode = new UpwardHierarchyNode(
      'SubCollection',
      DvObjectType.COLLECTION,
      '17',
      undefined,
      undefined,
      true,
      parentNodeWithoutName
    )
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: '17',
        name: 'SubCollection',
        hierarchy: subCollectionNode
      })
    )

    mountComponent()

    cy.findByLabelText('Include Guestbooks from Parent').should('exist')
  })

  it('renders the collection not found page when the collection cannot be fetched', () => {
    collectionRepository.getById = cy.stub().rejects(new Error('missing collection'))

    mountComponent()

    cy.findByTestId('not-found-page').should('exist')
    cy.findByText(/We can't find the/i).should('exist')
    cy.findByText('Collection').should('exist')
  })

  it('opens and closes the preview guestbook modal from the page ui', () => {
    mountComponent()

    cy.findAllByRole('button', { name: 'Preview' }).first().click()
    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Preview Guestbook').should('exist')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('downloads all guestbook responses from the dataverse use case', () => {
    const createElementSpy = cy.spy(document, 'createElement')

    mountComponent()

    cy.findByText('Download All Responses').click()

    cy.get('@downloadGuestbookResponsesByCollectionId').should('have.been.calledOnceWith', '17')
    cy.then(() => {
      expect(createElementSpy).to.have.been.calledWith('a')
    })
    cy.window().then((win) => {
      expect(win.URL['createObjectURL']).to.have.been.called
      expect(win.URL['revokeObjectURL']).to.have.been.called
    })
    cy.findByText('Your download has started.').should('exist')
  })

  it('hides download all responses when there are no guestbooks', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).resolves(
      []
    )

    mountComponent()

    cy.findByText('Download All Responses').should('not.exist')
    cy.findByText('Why Use Guestbooks?').should('exist')
  })

  it('hides download all responses when no guestbook has responses', () => {
    ;(guestbookRepository.getGuestbooksByCollectionId as Cypress.Agent<sinon.SinonStub>).resolves([
      {
        ...guestbook,
        responseCount: 0
      },
      {
        ...localGuestbookLater,
        responseCount: undefined
      }
    ])

    mountComponent()

    cy.findByText('Download All Responses').should('not.exist')
    cy.findByText('Downloadable Guestbook').should('exist')
    cy.findByText('zeta local guestbook').should('exist')
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

  it('only shows preview, copy, download, and view responses actions for inherited guestbooks from a parent collection', () => {
    mountComponent()

    cy.contains('tbody tr', 'Alpha Root Guestbook').within(() => {
      cy.findByText('Guestbook created at root').should('exist')
      cy.findByRole('button', { name: 'Disable' }).should('not.exist')
      cy.findByRole('button', { name: 'Enable' }).should('not.exist')
      cy.findByRole('button', { name: 'Preview' }).should('exist')
      cy.findByRole('button', { name: 'Copy' }).should('exist')
      cy.findByRole('button', { name: 'Edit' }).should('not.exist')
      cy.findByRole('button', { name: 'Download responses' }).should('exist')
      cy.findByRole('button', { name: 'View Responses' }).should('exist')
    })

    cy.contains('tbody tr', 'Downloadable Guestbook').within(() => {
      cy.findByRole('button', { name: 'Disable' }).should('exist')
      cy.findByRole('button', { name: 'Edit' }).should('exist')
    })
  })

  it('keeps current collection guestbook actions when the collection id is an alias', () => {
    collectionRepository.getById = cy.stub().resolves(
      CollectionMother.create({
        id: 'subcollection',
        name: 'SubCollection',
        hierarchy: UpwardHierarchyNodeMother.createSubCollection({
          id: 'subcollection',
          name: 'SubCollection',
          parent: UpwardHierarchyNodeMother.createCollection({
            id: 'root',
            name: 'Root'
          })
        })
      })
    )

    mountComponent('subcollection')

    cy.contains('tbody tr', 'Downloadable Guestbook').within(() => {
      cy.findByText(/Guestbook created at/i).should('not.exist')
      cy.findByRole('button', { name: 'Disable' }).should('exist')
      cy.findByRole('button', { name: 'Edit' }).should('exist')
    })

    cy.contains('tbody tr', 'Alpha Root Guestbook').within(() => {
      cy.findByText('Guestbook created at root').should('exist')
      cy.findByRole('button', { name: 'Disable' }).should('not.exist')
      cy.findByRole('button', { name: 'Edit' }).should('not.exist')
    })
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
      guestbookRepository.downloadGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
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
      guestbookRepository.downloadGuestbookResponsesByCollectionId as Cypress.Agent<sinon.SinonStub>
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

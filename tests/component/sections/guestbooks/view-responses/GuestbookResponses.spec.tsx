import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { EventType, GuestbookResponse } from '@/guestbooks/domain/models/GuestbookResponse'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { GuestbookResponses } from '@/sections/guestbooks/view-responses/GuestbookResponses'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const guestbook: Guestbook = {
  id: 10,
  name: 'Research Guestbook',
  enabled: true,
  emailRequired: true,
  nameRequired: false,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 17
}

const guestbookResponses: GuestbookResponse[] = [
  {
    id: 1,
    dataset: 'Zeta Dataset',
    datasetPid: 'doi:10.5072/FK2/ZETA',
    date: '2026-02-01T00:00:00.000Z',
    type: EventType.DOWNLOAD,
    fileName: 'zeta.csv',
    fileId: 101,
    userName: 'Jane User',
    customQuestions: [{ question: 'Purpose', response: 'Replication' }]
  },
  {
    id: 2,
    dataset: 'Alpha Dataset',
    datasetPid: 'doi:10.5072/FK2/ALPHA',
    date: '2026-01-01T00:00:00.000Z',
    type: EventType.ACCESS_REQUEST,
    fileName: 'alpha.tab',
    fileId: 102,
    userName: 'Ada User'
  }
]

const createGuestbookResponse = (id: number): GuestbookResponse => ({
  id,
  dataset: `Dataset ${id.toString().padStart(2, '0')}`,
  datasetPid: `doi:10.5072/FK2/${id}`,
  date: `2026-01-${id.toString().padStart(2, '0')}T00:00:00.000Z`,
  type: EventType.DOWNLOAD,
  fileName: `file-${id}.csv`,
  fileId: id,
  userName: `User ${id}`,
  customQuestions: [{ question: `Question ${id}`, response: `Answer ${id}` }]
})

describe('GuestbookResponses', () => {
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
      editGuestbook: cy.stub(),
      getGuestbook: cy.stub().as('getGuestbook').resolves(guestbook),
      getGuestbooksByCollectionId: cy.stub(),
      getGuestbookResponsesByGuestbookId: cy
        .stub()
        .as('getGuestbookResponsesByGuestbookId')
        .resolves({
          guestbookResponses,
          totalGuestbookResponseCount: guestbookResponses.length
        }),
      setGuestbookEnabled: cy.stub(),
      downloadGuestbookResponsesByCollectionId: cy.stub(),
      downloadGuestbookResponsesByGuestbookId: cy
        .stub()
        .as('downloadGuestbookResponsesByGuestbookId')
        .resolves('dataset,user\nResearch Guestbook,Jane User'),
      assignDatasetGuestbook: cy.stub(),
      removeDatasetGuestbook: cy.stub()
    }

    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').returns('blob:guestbook-responses')
      cy.stub(win.URL, 'revokeObjectURL')
    })
  })

  const mountComponent = () =>
    cy.customMount(
      <WithRepositories guestbookRepository={guestbookRepository}>
        <GuestbookResponses
          collectionId="17"
          guestbookId={guestbook.id}
          collectionRepository={collectionRepository}
        />
      </WithRepositories>
    )

  it('renders guestbook response page details and rows', () => {
    mountComponent()

    cy.findAllByText('Guestbook Responses').should('have.length.at.least', 1)
    cy.findByRole('heading', { name: 'SubCollection' }).should('exist')
    cy.findByText(/Click "Download Responses" to download all collected responses/i).should('exist')
    cy.findByText('Guestbook Name').should('exist')
    cy.findByText('Research Guestbook').should('exist')
    cy.findByText('2 Responses').should('exist')
    cy.findByRole('button', { name: 'Download Responses' }).should('exist')

    cy.findByRole('columnheader', { name: /Dataset/ }).should('exist')
    cy.findByRole('columnheader', { name: /Date/ }).should('exist')
    cy.findByRole('columnheader', { name: /Type/ }).should('exist')
    cy.findByRole('columnheader', { name: /File/ }).should('exist')
    cy.findByRole('columnheader', { name: /User/ }).should('exist')
    cy.findByRole('columnheader', { name: /Custom Questions/ }).should('exist')
    cy.findByText('Zeta Dataset').should('exist')
    cy.findByText('Download').should('exist')
    cy.findByText('zeta.csv').should('exist')
    cy.findByText('Jane User').should('exist')
    cy.findByText(/Purpose: Replication/).should('exist')

    cy.get('@getGuestbook').should('have.been.calledOnceWith', guestbook.id)
    cy.get('@getGuestbookResponsesByGuestbookId').should(
      'have.been.calledOnceWith',
      guestbook.id,
      10,
      0
    )
  })

  it('sorts responses by dataset', () => {
    mountComponent()

    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Zeta Dataset',
        'Alpha Dataset'
      ])
    })

    cy.findByRole('button', { name: /^Dataset/ }).click()

    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Alpha Dataset',
        'Zeta Dataset'
      ])
    })
  })

  it('sorts responses by date, type, file, and user and toggles sort direction', () => {
    mountComponent()

    cy.findByRole('button', { name: /^Date/ }).click()
    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Alpha Dataset',
        'Zeta Dataset'
      ])
    })

    cy.findByRole('button', { name: /^Date/ }).click()
    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Zeta Dataset',
        'Alpha Dataset'
      ])
    })

    cy.findByRole('button', { name: /^Type/ }).click()
    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Alpha Dataset',
        'Zeta Dataset'
      ])
    })

    cy.findByRole('button', { name: /^File/ }).click()
    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Alpha Dataset',
        'Zeta Dataset'
      ])
    })

    cy.findByRole('button', { name: /^User/ }).click()
    cy.get('tbody tr td:first-child').then(($cells) => {
      expect([...$cells].map((cell) => cell.textContent?.trim())).to.deep.equal([
        'Alpha Dataset',
        'Zeta Dataset'
      ])
    })
  })

  it('renders missing file names as empty and falls back to unknown event type label', () => {
    ;(
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    ).resolves({
      guestbookResponses: [
        {
          id: 3,
          dataset: 'Unknown Event Dataset',
          datasetPid: 'doi:10.5072/FK2/UNKNOWN',
          date: '2026-03-01T00:00:00.000Z',
          type: 'UnknownEvent' as EventType,
          userName: 'Unknown User'
        }
      ],
      totalGuestbookResponseCount: 1
    })

    mountComponent()

    cy.contains('tbody tr', 'Unknown Event Dataset').within(() => {
      cy.findByText('UnknownEvent').should('exist')
      cy.get('td').eq(3).should('have.text', '')
    })
  })

  it('downloads guestbook responses from the page action', () => {
    mountComponent()

    cy.findByRole('button', { name: 'Download Responses' }).click()

    cy.get('@downloadGuestbookResponsesByGuestbookId').should(
      'have.been.calledOnceWith',
      guestbook.dataverseId,
      guestbook.id
    )
    cy.findByText('Your download has started.').should('exist')
  })

  it('shows an error when downloading guestbook responses fails', () => {
    ;(
      guestbookRepository.downloadGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    ).rejects(new Error('download failed'))

    mountComponent()

    cy.findByRole('button', { name: 'Download Responses' }).click()

    cy.findByText(/Something went wrong downloading guestbook responses/i).should('exist')
  })

  it('shows no records found when the guestbook has no responses', () => {
    ;(
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    ).resolves({
      guestbookResponses: [],
      totalGuestbookResponseCount: 0
    })

    mountComponent()

    cy.findByText('0 Responses').should('exist')
    cy.findByText('No records found.').should('exist')
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
      new ReadError('Guestbook lookup failed')
    )

    mountComponent()

    cy.findByText(/Guestbook lookup failed/i).should('exist')
  })

  it('shows an error alert when getting guestbook responses fails', () => {
    ;(
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    ).rejects(new Error('unexpected'))

    mountComponent()

    cy.findByText(/Something went wrong getting guestbook responses/i).should('exist')
  })

  it('paginates guestbook responses', () => {
    const paginatedGuestbookResponses = Array.from({ length: 12 }, (_, index) =>
      createGuestbookResponse(index + 1)
    )
    ;(
      guestbookRepository.getGuestbookResponsesByGuestbookId as Cypress.Agent<sinon.SinonStub>
    ).callsFake((_guestbookId: number, limit?: number, offset?: number) => {
      const pageSize = limit ?? 10
      const pageOffset = offset ?? 0

      return Promise.resolve({
        guestbookResponses: paginatedGuestbookResponses.slice(pageOffset, pageOffset + pageSize),
        totalGuestbookResponseCount: paginatedGuestbookResponses.length
      })
    })

    mountComponent()

    cy.findByText('Dataset 01').should('exist')
    cy.findByText('Dataset 11').should('not.exist')
    cy.findByTestId('pagination-controls').should('exist')

    cy.findByRole('button', { name: '2' }).click()

    cy.findByText('Dataset 11').should('exist')
    cy.findByText(/Question 11: Answer 11/).should('exist')
    cy.findByText('Dataset 01').should('not.exist')
    cy.get('@getGuestbookResponsesByGuestbookId').should(
      'have.been.calledWith',
      guestbook.id,
      10,
      10
    )
  })
})

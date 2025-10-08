import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import {
  DatasetConfigureOptions,
  DatasetExploreOptions
} from '@/sections/dataset/dataset-action-buttons/DatasetToolsOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { DatasetExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/DatasetExternalToolResolvedMother'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'

const testExternalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository

const testDatasetExploreTool = ExternalToolsMother.createDatasetExploreTool()
const testDatasetConfigureTool = ExternalToolsMother.createDatasetConfigureTool()

describe('DatasetToolOptions', () => {
  beforeEach(() => {
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([testDatasetExploreTool, testDatasetConfigureTool])
  })

  it('renders the dataset configure tools options if they are available', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetConfigureOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('Configure Options').should('exist')
    cy.findByText('Dataset Configure Tool').should('exist')
  })

  it('renders nothing if there are no dataset configure tools', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([])
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetConfigureOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )
    cy.findByText('Configure Options').should('not.exist')
  })

  it('renders the dataset explore tools options if they are available', () => {
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Configure Options').should('not.exist')
    cy.findByText('Explore Options').should('exist')
    cy.findByText('Dataset Explore Tool').should('exist')
  })

  it('renders nothing if there are no dataset explore tools', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([])
    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )
    cy.findByText('Explore Options').should('not.exist')
  })

  it('opens the external tool in a new tab when clicking on a tool option', () => {
    const mockDatasetToolResolvedUrl = 'https://example.com/external-tool'

    testExternalToolsRepository.getDatasetExternalToolResolved = cy.stub().resolves(
      DatasetExternalToolResolvedMother.create({
        toolUrlResolved: mockDatasetToolResolvedUrl
      })
    )

    const fakeWindow = {
      closed: false,
      document: { title: '' },
      location: { href: '' },
      close: cy.stub().as('windowCloseStub')
    }

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').returns(fakeWindow)
    })

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Dataset Explore Tool').should('exist').click()

    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .its('firstCall.args')
      .then(() => {
        expect(fakeWindow.document.title).to.eq(`Loading ${testDatasetExploreTool.displayName}...`)
        expect(fakeWindow.location.href).to.eq(mockDatasetToolResolvedUrl)
      })
  })

  it('shows an error toast if fetching the tool URL fails', () => {
    testExternalToolsRepository.getDatasetExternalToolResolved = cy
      .stub()
      .rejects(new Error('Failed to fetch tool URL'))

    const fakeWindow = {
      closed: false,
      document: { title: '' },
      location: { href: '' },
      close: cy.stub().as('windowCloseStub')
    }

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').returns(fakeWindow)
    })

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Dataset Explore Tool').should('exist').click()

    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .then(() => {
        cy.findByText(/There was a problem opening the external tool. Please try again./).should(
          'exist'
        )
        cy.get('@windowCloseStub').should('have.been.calledOnce')
      })
  })

  describe('popup blocked alert notification', () => {
    it('should shows popup blocked alert notification if the popup is blocked -> window is falsy', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen').returns(false)
      })

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <DatasetExploreOptions persistentId="some-persistent-id" />
        </ExternalToolsProvider>
      )

      cy.findByText('Dataset Explore Tool').should('exist').click()

      cy.get('@windowOpen')
        .should('have.been.calledOnce')
        .then(() => {
          cy.findByText(
            /You must enable popups in your browser to open external tools in a new window or tab./
          ).should('exist')
        })
    })

    it('should shows popup blocked alert notification if the popup is blocked when new window.closed is true', () => {
      const fakeWindow = {
        closed: true,
        document: { title: '' },
        location: { href: '' },
        close: cy.stub().as('windowCloseStub')
      }
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen').returns(fakeWindow)
      })

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <DatasetExploreOptions persistentId="some-persistent-id" />
        </ExternalToolsProvider>
      )

      cy.findByText('Dataset Explore Tool').should('exist').click()

      cy.get('@windowOpen')
        .should('have.been.calledOnce')
        .then(() => {
          cy.findByText(
            /You must enable popups in your browser to open external tools in a new window or tab./
          ).should('exist')
        })
    })

    it('should shows popup blocked alert notification if the popup is blocked when typeof new window.closed is "undefined"', () => {
      const fakeWindow = {
        closed: undefined,
        document: { title: '' },
        location: { href: '' },
        close: cy.stub().as('windowCloseStub')
      }
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen').returns(fakeWindow)
      })

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <DatasetExploreOptions persistentId="some-persistent-id" />
        </ExternalToolsProvider>
      )

      cy.findByText('Dataset Explore Tool').should('exist').click()

      cy.get('@windowOpen')
        .should('have.been.calledOnce')
        .then(() => {
          cy.findByText(
            /You must enable popups in your browser to open external tools in a new window or tab./
          ).should('exist')
        })
    })
  })
})

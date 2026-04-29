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

  it('calls getDatasetExternalToolResolved with preview=false and locale', () => {
    testExternalToolsRepository.getDatasetExternalToolResolved = cy
      .stub()
      .as('getDatasetExternalToolResolved')
      .resolves(
        DatasetExternalToolResolvedMother.create({
          toolUrlResolved: 'https://example.com/external-tool'
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

    cy.findByText('Dataset Explore Tool').click()

    cy.get('@getDatasetExternalToolResolved')
      .should('have.been.calledOnce')
      .its('firstCall.args')
      .then((args) => {
        expect(args[0]).to.equal('some-persistent-id')
        expect(args[1]).to.equal(testDatasetExploreTool.id)
        expect(args[2]).to.have.property('preview', false)
        expect(args[2]).to.have.property('locale').that.is.a('string').and.is.not.empty
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

  it('does not close popup when it is already closed during error handling', () => {
    const fakeWindow = {
      closed: false,
      document: { title: '' },
      location: { href: '' },
      close: cy.stub().as('windowCloseStub')
    }

    testExternalToolsRepository.getDatasetExternalToolResolved = cy.stub().callsFake(() => {
      fakeWindow.closed = true
      return Promise.reject(new Error('Failed to fetch tool URL'))
    })

    cy.window().then((win) => {
      cy.stub(win, 'open').as('windowOpen').returns(fakeWindow)
    })

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <DatasetExploreOptions persistentId="some-persistent-id" />
      </ExternalToolsProvider>
    )

    cy.findByText('Dataset Explore Tool').click()

    cy.findByText(/There was a problem opening the external tool. Please try again./).should(
      'exist'
    )
    cy.get('@windowCloseStub').should('not.have.been.called')
  })

  it('does not open multiple windows if the tool option is clicked rapidly', () => {
    const mockDatasetToolResolvedUrl = 'https://example.com/external-tool'

    testExternalToolsRepository.getDatasetExternalToolResolved = cy
      .stub()
      .as('getDatasetExternalToolResolved')
      .callsFake(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              DatasetExternalToolResolvedMother.create({
                toolUrlResolved: mockDatasetToolResolvedUrl
              })
            )
          }, 50)
        })
      })

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

    cy.findByText('Dataset Explore Tool').should('exist').as('toolButton')

    cy.get('@toolButton').then(($btn) => {
      const el = $btn[0]
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    cy.get('@windowOpen').should('have.been.calledOnce')
    cy.get('@getDatasetExternalToolResolved').should('have.been.calledOnce')
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

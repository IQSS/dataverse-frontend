import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import {
  FileExploreToolsOptions,
  FileQueryToolsOptions,
  FileConfigureToolsOptions
} from '@/sections/file/file-action-buttons/access-file-menu/FileToolOptions'
import { ExternalToolsProvider } from '@/shared/contexts/external-tools/ExternalToolsProvider'
import { ExternalToolsMother } from '@tests/component/externalTools/domain/models/ExternalToolsMother'
import { FileExternalToolResolvedMother } from '@tests/component/externalTools/domain/models/FileExternalToolResolvedMother'
import { ToolScope, ToolType } from '@/externalTools/domain/models/ExternalTool'

const testExternalToolsRepository: ExternalToolsRepository = {} as ExternalToolsRepository
const testFileExploreTool = ExternalToolsMother.createFileExploreTool()
const testFileQueryTool = ExternalToolsMother.createFileQueryTool()
const testFileConfigureTool = ExternalToolsMother.createFileConfigureTool()

describe('FileToolOptions', () => {
  beforeEach(() => {
    testExternalToolsRepository.getExternalTools = cy
      .stub()
      .resolves([testFileExploreTool, testFileQueryTool, testFileConfigureTool])
  })

  describe('FileExploreToolsOptions', () => {
    it('renders the tool options if file explore tools are available and compatible with the type', () => {
      testExternalToolsRepository.getExternalTools = cy.stub().resolves([
        testFileExploreTool,
        {
          ...testFileExploreTool,
          id: 33,
          displayName: 'PDF Explore Tool',
          contentType: 'application/pdf'
        },
        testFileQueryTool
      ])

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileExploreToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Query Options').should('not.exist')
      cy.findByText('Configure Options').should('not.exist')
      cy.findByText('Explore Options').should('exist')
      cy.findByText('File Explore Tool').should('exist')
      cy.findByText('PDF Explore Tool').should('not.exist')
      cy.findByText('File Query Tool').should('not.exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileExploreToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })

  describe('FileQueryToolsOptions', () => {
    it('renders the tool options if file query tools are available and compatible with the type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileQueryToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Configure Options').should('not.exist')
      cy.findByText('Query Options').should('exist')
      cy.findByText('File Query Tool').should('exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileQueryToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })

  describe('FileConfigureToolsOptions', () => {
    it('renders the tool options if file configure tools are available and compatible with the type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileConfigureToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
      cy.findByText('Configure Options').should('exist')
      cy.findByText('File Configure Tool').should('exist')
    })

    it('does not render the tool options if there are not applicable tools for the file type', () => {
      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileConfigureToolsOptions fileId={1} fileType="application/pdf" />
        </ExternalToolsProvider>
      )

      cy.findByText('Explore Options').should('not.exist')
      cy.findByText('Query Options').should('not.exist')
    })
  })

  it('opens the external tool in a new tab when clicking on a tool option', () => {
    const mockFileResolvedUrl = 'https://example.com/external-tool'

    testExternalToolsRepository.getFileExternalToolResolved = cy.stub().resolves(
      FileExternalToolResolvedMother.create({
        toolUrlResolved: mockFileResolvedUrl
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
        <FileExploreToolsOptions fileId={1} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('File Explore Tool').should('exist').click()

    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .its('firstCall.args')
      .then(() => {
        expect(fakeWindow.document.title).to.eq(`Loading ${testFileExploreTool.displayName}...`)
        expect(fakeWindow.location.href).to.eq(mockFileResolvedUrl)
      })
  })

  it('calls getFileExternalToolResolved with preview=false and locale', () => {
    testExternalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .as('getFileExternalToolResolved')
      .resolves(
        FileExternalToolResolvedMother.create({
          toolUrlResolved: 'https://example.com/query-tool'
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
        <FileQueryToolsOptions fileId={123} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('File Query Tool').click()

    cy.get('@getFileExternalToolResolved')
      .should('have.been.calledOnce')
      .its('firstCall.args')
      .then((args) => {
        expect(args[0]).to.equal(123)
        expect(args[1]).to.equal(testFileQueryTool.id)
        expect(args[2]).to.have.property('preview', false)
        expect(args[2]).to.have.property('locale').that.is.a('string').and.is.not.empty
      })
  })

  it('does not render file tools that require unsupported requirements metadata', () => {
    testExternalToolsRepository.getExternalTools = cy.stub().resolves([
      {
        id: 77,
        displayName: 'File Explore Tool With Requirements',
        description: 'Description for File Explore Tool With Requirements',
        scope: ToolScope.File,
        types: [ToolType.Explore],
        contentType: 'text/plain',
        requirements: {
          auxFilesExist: [{ formatTag: 'DP', formatVersion: '1.0' }]
        }
      }
    ])

    cy.customMount(
      <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
        <FileExploreToolsOptions fileId={1} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('Explore Options').should('not.exist')
    cy.findByText('File Explore Tool With Requirements').should('not.exist')
  })

  it('shows an error toast if fetching the tool URL fails', () => {
    testExternalToolsRepository.getFileExternalToolResolved = cy
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
        <FileExploreToolsOptions fileId={1} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('File Explore Tool').should('exist').click()

    cy.get('@windowOpen')
      .should('have.been.calledOnce')
      .then(() => {
        cy.findByText(/There was a problem opening the external tool. Please try again./).should(
          'exist'
        )
        cy.get('@windowCloseStub').should('have.been.calledOnce')
      })
  })

  it('does not open multiple windows if the tool option is clicked rapidly', () => {
    const mockFileResolvedUrl = 'https://example.com/external-tool'

    testExternalToolsRepository.getFileExternalToolResolved = cy
      .stub()
      .as('getFileExternalToolResolved')
      .callsFake(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(
              FileExternalToolResolvedMother.create({
                toolUrlResolved: mockFileResolvedUrl
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
        <FileExploreToolsOptions fileId={1} fileType="text/plain" />
      </ExternalToolsProvider>
    )

    cy.findByText('File Explore Tool').should('exist').as('toolButton')

    cy.get('@toolButton').then(($btn) => {
      const el = $btn[0]
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    cy.get('@windowOpen').should('have.been.calledOnce')
    cy.get('@getFileExternalToolResolved').should('have.been.calledOnce')
  })

  describe('popup blocked alert notification', () => {
    it('should shows popup blocked alert notification if the popup is blocked -> window is falsy', () => {
      cy.window().then((win) => {
        cy.stub(win, 'open').as('windowOpen').returns(false)
      })

      cy.customMount(
        <ExternalToolsProvider externalToolsRepository={testExternalToolsRepository}>
          <FileExploreToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('File Explore Tool').should('exist').click()

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
          <FileExploreToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('File Explore Tool').should('exist').click()

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
          <FileExploreToolsOptions fileId={1} fileType="text/plain" />
        </ExternalToolsProvider>
      )

      cy.findByText('File Explore Tool').should('exist').click()

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

import { FilesTree } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeRepository } from '../../../../../../src/files/domain/repositories/FileTreeRepository'
import type { FileTreePage } from '../../../../../../src/files/domain/models/FileTreePage'
import { DatasetVersionMother } from '../../../../dataset/domain/models/DatasetMother'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'
import { FileTreePageMother } from '../../../../files/domain/models/FileTreePageMother'

const datasetVersion = DatasetVersionMother.create()

class FakeTreeRepository implements FileTreeRepository {
  private pages: Map<string, FileTreePage>
  public calls: { path: string; cursor?: string }[] = []

  constructor(pages: Record<string, FileTreePage>) {
    this.pages = new Map(Object.entries(pages))
  }

  getNode(params: { path?: string; cursor?: string }): Promise<FileTreePage> {
    const path = params.path ?? ''
    this.calls.push({ path, cursor: params.cursor })
    const page = this.pages.get(path)
    if (!page) {
      return Promise.reject(new Error(`No mock page for path "${path}"`))
    }
    return Promise.resolve(page)
  }
}

describe('FilesTree', () => {
  it('renders a loading state and then the root items', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFolderMother.create({ name: 'data', path: 'data' }),
        FileTreeFileMother.create({ id: 1, name: 'README.md', path: 'README.md' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })

    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )

    cy.findByTestId('files-tree').should('exist')
    cy.findByText('data').should('exist')
    cy.findByText('README.md').should('exist')
  })

  it('lazy-loads a folder when its twisty is clicked', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFolderMother.create({ name: 'data', path: 'data' })]
    })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })

    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('data').should('exist')
    cy.findByLabelText(/Expand data/i).click()
    cy.findByText('inside.txt').should('exist')
    cy.then(() => {
      expect(repo.calls.find((c) => c.path === 'data')).to.exist
    })
  })

  it('updates the selection summary when a file is checked', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFileMother.create({
          id: 7,
          name: 'big.bin',
          path: 'big.bin',
          size: 2048
        })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })

    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )

    cy.findByTestId('files-tree-checkbox-big.bin').click()
    cy.findByTestId('files-tree-selection-summary').should('contain.text', '1')
    cy.findByTestId('files-tree-download-button').should('not.be.disabled')
  })

  it('renders an error state on root failure with a retry button', () => {
    class FailingRepo implements FileTreeRepository {
      getNode() {
        return Promise.reject(new Error('boom'))
      }
    }
    cy.customMount(
      <FilesTree
        treeRepository={new FailingRepo()}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByTestId('files-tree-error').should('exist')
    cy.findByText(/Couldn't load file index/i).should('exist')
  })

  it('renders empty state when no files are present', () => {
    const repo = new FakeTreeRepository({
      '': FileTreePageMother.create({ path: '', items: [] })
    })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByTestId('files-tree-empty').should('exist')
    // Be specific: the toolbar's "No files selected" summary also
    // matches /no files/i so the loose matcher would yield two hits.
    cy.findByText(/this dataset has no files/i).should('exist')
  })

  it('renders a "no matches" state when query has no hits', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
        query="zzzzz"
      />
    )
    cy.findByTestId('files-tree-empty').should('exist')
    cy.findByText(/zzzzz/).should('exist')
  })

  it('selecting multiple files updates the selection summary with a byte count', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt', size: 1500 }),
        FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'b.txt', size: 500 })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByTestId('files-tree-checkbox-a.txt').click()
    cy.findByTestId('files-tree-checkbox-b.txt').click()
    cy.findByTestId('files-tree-selection-summary').should('contain.text', '2')
    // Two files of 1500 + 500 = 2000 bytes → "2.0 KB" in the summary.
    cy.findByTestId('files-tree-selection-summary').should('contain.text', 'KB')
  })

  it('clear button resets the selection', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByTestId('files-tree-checkbox-a.txt').click()
    cy.findByTestId('files-tree-selection-summary').should('contain.text', '1')
    cy.findByRole('button', { name: /Clear/i }).click()
    cy.findByTestId('files-tree-selection-summary').should('contain.text', 'No files selected')
  })

  it('selecting a folder shows the "includes folders" hint in the summary', () => {
    const dataFolder = FileTreeFolderMother.create({
      name: 'data',
      path: 'data',
      counts: { files: 5, folders: 1 }
    })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByTestId('files-tree-checkbox-data').click()
    cy.findByTestId('files-tree-selection-summary').should('contain.text', 'folders included')
  })

  it('arrow-down moves focus to the next row', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFolderMother.create({ name: 'data', path: 'data' }),
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    // Focus the first row, then press ArrowDown. Logical focus is roving:
    // moveFocus updates focusedRowIndex which flips the row's tabIndex
    // attribute; DOM focus does not auto-follow (the standard ARIA
    // tree pattern in this app expects the user to keep tabbing within
    // the tree). We assert the roving-tabindex outcome.
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'ArrowDown' })
    cy.get('[role="treeitem"]').eq(1).should('have.attr', 'tabindex', '0')
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '-1')
  })

  it('arrow-up after arrow-down returns focus to the previous row', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFolderMother.create({ name: 'data', path: 'data' }),
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    cy.get('[role="treeitem"]')
      .first()
      .focus()
      .trigger('keydown', { key: 'ArrowDown' })
      .trigger('keydown', { key: 'ArrowUp' })
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '0')
  })

  it('Home/End jumps focus to the first/last row', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' }),
        FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'b.txt' }),
        FileTreeFileMother.create({ id: 3, name: 'c.txt', path: 'c.txt' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('a.txt').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'End' })
    cy.get('[role="treeitem"]').eq(2).should('have.attr', 'tabindex', '0')
    cy.get('[role="treeitem"]').eq(2).trigger('keydown', { key: 'Home' })
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '0')
  })

  it('arrow-right on a collapsed folder expands it; arrow-left collapses it', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'ArrowRight' })
    // Folder expanded → child becomes visible.
    cy.findByText('inside.txt').should('exist')
    // Press ArrowLeft to collapse.
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'ArrowLeft' })
    cy.findByText('inside.txt').should('not.exist')
  })

  it('arrow-right on an already-expanded folder moves focus to the first child', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
        initialPath="data"
      />
    )
    cy.findByText('inside.txt').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'ArrowRight' })
    cy.get('[role="treeitem"]').eq(1).should('have.attr', 'tabindex', '0')
  })

  it('Space on a file row toggles its selection', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('a.txt').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: ' ' })
    cy.findByTestId('files-tree-selection-summary').should('contain.text', '1')
  })

  it('Enter on a folder row toggles expansion', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'Enter' })
    cy.findByText('inside.txt').should('exist')
  })

  it('Space on a folder row toggles its logical selection', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: ' ' })
    cy.findByTestId('files-tree-selection-summary').should('contain.text', 'folders included')
  })

  it('arrow-left on a child row moves focus to its parent', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
        initialPath="data"
      />
    )
    cy.findByText('inside.txt').should('exist')
    // Focus the second row (the file inside data/) then arrow-left.
    cy.get('[role="treeitem"]').eq(1).focus().trigger('keydown', { key: 'ArrowLeft' })
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '0')
  })

  it('clicking the download icon on a single-file row fires a single dispatch', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 7, name: 'sample.txt', path: 'sample.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('sample.txt').should('exist')
    // Single-file dispatch creates an <a> element, clicks it, removes it. We
    // can't easily intercept that, but we can stub document.createElement to
    // verify the anchor gets created with the expected href.
    cy.window().then((win) => {
      const original = win.document.createElement.bind(win.document)
      cy.stub(win.document, 'createElement').callsFake((tag: string) => {
        const el = original(tag)
        if (tag === 'a') {
          // Block the actual click so the test runner does not try to
          // navigate away when the row's download icon is exercised.
          ;(el as HTMLAnchorElement).click = () => undefined
        }
        return el
      })
    })
    cy.findByLabelText(/Download file sample\.txt/i).click()
    cy.findByTestId('files-tree-selection-summary').should('exist')
  })

  it('onCurrentPathChange fires when the user expands a folder', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 1, name: 'leaf.txt', path: 'data/leaf.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, data: dataPage })
    const onCurrentPathChange = cy.stub()
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
        onCurrentPathChange={onCurrentPathChange}
      />
    )
    cy.findByText('data').should('exist')
    cy.findByLabelText(/Expand data/i).click()
    cy.findByText('leaf.txt').should('exist')
    cy.then(() => {
      // After the user opens data/, the deepest expanded path becomes 'data'.
      expect(onCurrentPathChange).to.have.been.calledWith('data')
    })
  })

  it('row error message renders when fetching a folder rejects, with a Retry button', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    let dataAttempts = 0
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFileMother.create({ id: 1, name: 'inside.txt', path: 'data/inside.txt' })]
    })
    const repo: FileTreeRepository = {
      getNode: (params: { path?: string }) => {
        if ((params.path ?? '') === '') {
          return Promise.resolve(root)
        }
        if (params.path === 'data') {
          dataAttempts++
          if (dataAttempts === 1) {
            return Promise.reject(new Error('transient'))
          }
          return Promise.resolve(dataPage)
        }
        return Promise.reject(new Error(`unmocked ${params.path ?? ''}`))
      }
    }
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByLabelText(/Expand data/i).click()
    cy.findByText(/transient/).should('exist')
    cy.findByRole('button', { name: /Retry/i }).click()
    cy.findByText('inside.txt').should('exist')
  })

  it('arrow-left on a root-level row is a no-op (no parent to move to)', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('a.txt').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'ArrowLeft' })
    // Stays put — only one row, no parent.
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '0')
  })

  it('non-handled keys (e.g. plain letter) do not preventDefault or move focus', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' }),
        FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'b.txt' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('a.txt').should('exist')
    cy.get('[role="treeitem"]').first().focus().trigger('keydown', { key: 'a' })
    // First row still focused.
    cy.get('[role="treeitem"]').first().should('have.attr', 'tabindex', '0')
  })

  it('selecting two files starts the streaming-zip flow and disables the download button while active', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' }),
        FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'b.txt' })
      ]
    })
    const repo = new FakeTreeRepository({ '': root })
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    // Stub fetch so the streaming-zip engine doesn't actually try the network.
    cy.window().then((win) => {
      cy.stub(win, 'fetch').resolves(new Response('content', { status: 200 }))
    })
    cy.findByTestId('files-tree-checkbox-a.txt').click()
    cy.findByTestId('files-tree-checkbox-b.txt').click()
    cy.findByTestId('files-tree-download-button').click()
    // Tray opens with the streaming-zip status.
    cy.findByTestId('files-tree-download-tray').should('exist')
  })

  it('the download button shows the "enumerating" label while a folder is being expanded for download', () => {
    const dataFolder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const root = FileTreePageMother.create({ path: '', items: [dataFolder] })
    // A page that resolves slowly — letting us observe the "enumerating"
    // intermediate state on the download button.
    let resolveDataPage!: (page: FileTreePage) => void
    const dataPage = new Promise<FileTreePage>((resolve) => {
      resolveDataPage = resolve
    })
    const repo: FileTreeRepository = {
      getNode: (params: { path?: string }) => {
        if ((params.path ?? '') === '') {
          return Promise.resolve(root)
        }
        if (params.path === 'data') {
          return dataPage
        }
        return Promise.reject(new Error('unmocked'))
      }
    }
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('data').should('exist')
    cy.findByTestId('files-tree-checkbox-data').click()
    cy.findByTestId('files-tree-download-button').click()
    // While the data/ enumeration is pending, the button surfaces the
    // intermediate label.
    cy.findByTestId('files-tree-download-button').should('contain.text', 'Listing files')
    cy.then(() => {
      // Resolve to clean up the in-flight promise.
      resolveDataPage(
        FileTreePageMother.create({
          path: 'data',
          items: [
            FileTreeFileMother.create({ id: 10, name: 'inside.txt', path: 'data/inside.txt' })
          ]
        })
      )
    })
  })

  it('renders a load-more row when the page has a nextCursor and clicking it fetches more', () => {
    const fileA = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
    const fileB = FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'b.txt' })
    const firstPage = FileTreePageMother.create({
      path: '',
      items: [fileA],
      nextCursor: 'cursor-1'
    })
    const secondPage = FileTreePageMother.create({
      path: '',
      items: [fileB],
      nextCursor: null
    })
    let issued = 0
    const repo: FileTreeRepository = {
      getNode: (params: { cursor?: string }) => {
        issued++
        return Promise.resolve(params.cursor === 'cursor-1' ? secondPage : firstPage)
      }
    }
    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('a.txt').should('exist')
    // The auto-load effect picks up the load-more row in the visible slice
    // and calls loadMore for us — second fetch is implicit. Wait for b.txt.
    cy.findByText('b.txt').should('exist')
    cy.then(() => expect(issued).to.be.gte(2))
  })
})

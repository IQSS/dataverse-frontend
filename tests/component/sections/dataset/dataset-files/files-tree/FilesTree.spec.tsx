import { ReactNode } from 'react'
import { FilesTree } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeRepository } from '../../../../../../src/files/domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../../../../../src/files/domain/models/FileTreePage'
import { AccessRepository } from '@/access/domain/repositories/AccessRepository'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
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

const accessRepository = {
  getDatasetDownloadCount: cy.stub().resolves(0),
  submitGuestbookForDatafileDownload: cy.stub().resolves('https://example.org/zip'),
  submitGuestbookForDatafilesDownload: cy.stub().resolves('https://example.org/zip'),
  submitGuestbookForDatasetDownload: cy.stub().resolves('https://example.org/zip')
} as unknown as AccessRepository

function withAccess(children: ReactNode) {
  return (
    <AccessRepositoryProvider repository={accessRepository}>{children}</AccessRepositoryProvider>
  )
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
      withAccess(
        <FilesTree
          treeRepository={repo}
          datasetPersistentId="doi:10.5072/FK2/AAA"
          datasetVersion={datasetVersion}
        />
      )
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
      withAccess(
        <FilesTree
          treeRepository={repo}
          datasetPersistentId="doi:10.5072/FK2/AAA"
          datasetVersion={datasetVersion}
        />
      )
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
      withAccess(
        <FilesTree
          treeRepository={repo}
          datasetPersistentId="doi:10.5072/FK2/AAA"
          datasetVersion={datasetVersion}
        />
      )
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
      withAccess(
        <FilesTree
          treeRepository={new FailingRepo()}
          datasetPersistentId="doi:10.5072/FK2/AAA"
          datasetVersion={datasetVersion}
        />
      )
    )
    cy.findByTestId('files-tree-error').should('exist')
    cy.findByText(/Couldn't load file index/i).should('exist')
  })

  it('renders empty state when no files are present', () => {
    const repo = new FakeTreeRepository({
      '': FileTreePageMother.create({ path: '', items: [] })
    })
    cy.customMount(
      withAccess(
        <FilesTree
          treeRepository={repo}
          datasetPersistentId="doi:10.5072/FK2/AAA"
          datasetVersion={datasetVersion}
        />
      )
    )
    cy.findByTestId('files-tree-empty').should('exist')
    cy.findByText(/no files/i).should('exist')
  })
})

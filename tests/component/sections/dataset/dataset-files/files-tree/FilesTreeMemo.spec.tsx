import { FilesTree } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTree'
import { knownChildrenAggregation } from '../../../../../../src/sections/dataset/dataset-files/files-tree/knownChildren'
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
  constructor(pages: Record<string, FileTreePage>) {
    this.pages = new Map(Object.entries(pages))
  }
  getNode(params: { path?: string }): Promise<FileTreePage> {
    const path = params.path ?? ''
    const page = this.pages.get(path)
    return page ? Promise.resolve(page) : Promise.reject(new Error(`No mock page for "${path}"`))
  }
}

describe('FilesTree folder state memoisation', () => {
  it('does not aggregate on renders without a data or selection change, and only for the loaded folder and its ancestors on load', () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [
        FileTreeFolderMother.create({ name: 'a', path: 'a' }),
        FileTreeFolderMother.create({ name: 'b', path: 'b' }),
        FileTreeFileMother.create({ id: 1, name: 'root.txt', path: 'root.txt' })
      ]
    })
    const a = FileTreePageMother.create({
      path: 'a',
      items: [
        FileTreeFolderMother.create({ name: 'sub', path: 'a/sub' }),
        FileTreeFileMother.create({ id: 2, name: 'a.txt', path: 'a/a.txt' })
      ]
    })
    const sub = FileTreePageMother.create({
      path: 'a/sub',
      items: [FileTreeFileMother.create({ id: 3, name: 'deep.txt', path: 'a/sub/deep.txt' })]
    })
    const repo = new FakeTreeRepository({ '': root, a, 'a/sub': sub })
    const spy = cy.spy(knownChildrenAggregation, 'concat').as('concat')

    cy.customMount(
      <FilesTree
        treeRepository={repo}
        datasetPersistentId="doi:10.5072/FK2/AAA"
        datasetVersion={datasetVersion}
      />
    )
    cy.findByText('root.txt').should('exist')

    // Renders without a data or selection change: scrolling and a hover.
    cy.then(() => spy.resetHistory())
    cy.findByTestId('files-tree-row-root.txt').trigger('mouseover', { force: true })
    cy.findByRole('tree').trigger('scroll')
    cy.wait(100)
    cy.get('@concat').should('have.callCount', 0)

    // Loading `a` aggregates for `a` (while loading and when loaded) and for the newly
    // discovered `a/sub`; `b` is untouched.
    cy.then(() => spy.resetHistory())
    cy.findByLabelText(/Expand a$/i).click()
    cy.findByText('a.txt').should('exist')
    cy.then(() => {
      const paths = spy.getCalls().map((c) => c.args[0] as string)
      expect(new Set(paths), 'paths aggregated after loading a').to.deep.equal(
        new Set(['a', 'a/sub'])
      )
    })

    // Loading `a/sub` aggregates for `a/sub` and its ancestor `a`, never for `b`.
    cy.then(() => spy.resetHistory())
    cy.findByLabelText(/Expand sub$/i).click({ force: true })
    cy.findByText('deep.txt').should('exist')
    cy.then(() => {
      const paths = spy.getCalls().map((c) => c.args[0] as string)
      expect(new Set(paths), 'paths aggregated after loading a/sub').to.deep.equal(
        new Set(['a', 'a/sub'])
      )
    })

    // A selection change recomputes states but from cached children: no aggregation.
    cy.then(() => spy.resetHistory())
    cy.findByTestId('files-tree-checkbox-b').click()
    cy.get('@concat').should('have.callCount', 0)
  })
})

import { renderHook, act, waitFor } from '@testing-library/react'
import { useFileTree } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTree'
import { FileTreeRepository } from '../../../../../../src/files/domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../../../../../src/files/domain/models/FileTreePage'
import { DatasetVersionMother } from '../../../../dataset/domain/models/DatasetMother'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'
import { FileTreePageMother } from '../../../../files/domain/models/FileTreePageMother'

const datasetVersion = DatasetVersionMother.create()

class FakeRepo implements FileTreeRepository {
  public calls: { path: string; cursor?: string }[] = []
  constructor(private readonly pages: Record<string, FileTreePage[]>) {}

  getNode(params: { path?: string; cursor?: string }): Promise<FileTreePage> {
    const path = params.path ?? ''
    this.calls.push({ path, cursor: params.cursor })
    const variants = this.pages[path]
    if (!variants || variants.length === 0) {
      return Promise.reject(new Error(`No mock for "${path}"`))
    }
    // Return the variant whose cursor matches; otherwise the first.
    const match = variants.find((p) => p.path === path) ?? variants[0]
    return Promise.resolve(match)
  }
}

describe('useFileTree', () => {
  it('does not refetch a folder once loaded (in-flight + loaded cache hits)', async () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeRepo({ '': [root] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    const firstCallCount = repo.calls.length

    // expand on already-expanded ROOT — early-return branch.
    await act(async () => {
      await result.current.expand('')
    })
    expect(repo.calls.length, 'expand cache hit must not refetch').to.equal(firstCallCount)
  })

  it('collapse is a no-op when the folder is not expanded', () => {
    const root = FileTreePageMother.create({ path: '', items: [] })
    const repo = new FakeRepo({ '': [root] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    const beforeExpanded = new Set(result.current.expanded)
    act(() => {
      result.current.collapse('not-expanded-folder')
    })
    expect(Array.from(result.current.expanded)).to.deep.equal(Array.from(beforeExpanded))
  })

  it('toggleExpanded calls collapse when the folder is already expanded', async () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFolderMother.create({ name: 'data', path: 'data' })]
    })
    const dataPage = FileTreePageMother.create({ path: 'data', items: [] })
    const repo = new FakeRepo({ '': [root], data: [dataPage] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))

    await act(async () => {
      await result.current.toggleExpanded('data')
    })
    expect(result.current.expanded.has('data')).to.equal(true)

    await act(async () => {
      await result.current.toggleExpanded('data')
    })
    expect(result.current.expanded.has('data')).to.equal(false)
  })

  it('loadMore is a no-op when the folder has no nextCursor', async () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [],
      nextCursor: null
    })
    const repo = new FakeRepo({ '': [root] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    const before = repo.calls.length

    await act(async () => {
      await result.current.loadMore('')
    })
    // nextCursor is null → loadMore returns early.
    expect(repo.calls.length, 'no extra fetch when nextCursor is null').to.equal(before)
  })

  it('loadMore fetches the next cursor when one is set', async () => {
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

    let callIndex = 0
    const repo: FileTreeRepository = {
      getNode: (params) => {
        const cursor = params.cursor
        callIndex++
        return Promise.resolve(cursor === 'cursor-1' ? secondPage : firstPage)
      }
    }

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    await act(async () => {
      await result.current.loadMore('')
    })

    expect(callIndex, 'loadMore should issue exactly one extra fetch').to.equal(2)
    expect(result.current.rootNode.items.map((i) => i.path)).to.deep.equal(['a.txt', 'b.txt'])
  })

  it('refresh clears the cached node and refetches', async () => {
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })]
    })
    const repo = new FakeRepo({ '': [root] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    const before = repo.calls.length

    await act(async () => {
      await result.current.refresh()
    })

    expect(repo.calls.length).to.be.greaterThan(before)
  })

  it('records an error on the node when fetchPage rejects', async () => {
    const repo: FileTreeRepository = {
      getNode: () => Promise.reject(new Error('repo boom'))
    }

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.error).to.equal('repo boom'))
    expect(result.current.rootNode.loading).to.equal(false)
  })

  it('registerKnownFile populates knownFiles', () => {
    const root = FileTreePageMother.create({ path: '', items: [] })
    const repo = new FakeRepo({ '': [root] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    const file = FileTreeFileMother.create({ id: 99, name: 'side.txt', path: 'aux/side.txt' })
    act(() => {
      result.current.registerKnownFile(file)
    })
    expect(result.current.knownFiles.get('aux/side.txt')).to.deep.equal(file)
  })

  it('initialPath expands every ancestor', async () => {
    const rootPage = FileTreePageMother.create({
      path: '',
      items: [FileTreeFolderMother.create({ name: 'data', path: 'data' })]
    })
    const dataPage = FileTreePageMother.create({
      path: 'data',
      items: [FileTreeFolderMother.create({ name: 'sub', path: 'data/sub' })]
    })
    const subPage = FileTreePageMother.create({
      path: 'data/sub',
      items: []
    })
    const repo = new FakeRepo({ '': [rootPage], data: [dataPage], 'data/sub': [subPage] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        initialPath: 'data/sub'
      })
    )

    await waitFor(() => {
      expect(result.current.expanded.has('data')).to.equal(true)
      expect(result.current.expanded.has('data/sub')).to.equal(true)
    })
    expect(result.current.currentPath).to.equal('data/sub')
  })

  it('visibleKnownChildren returns items at and under the target path', async () => {
    const fileTop = FileTreeFileMother.create({ id: 1, name: 'top.txt', path: 'top.txt' })
    const fileNested = FileTreeFileMother.create({
      id: 2,
      name: 'nested.txt',
      path: 'data/nested.txt'
    })
    const root = FileTreePageMother.create({
      path: '',
      items: [FileTreeFolderMother.create({ name: 'data', path: 'data' }), fileTop]
    })
    const dataPage = FileTreePageMother.create({ path: 'data', items: [fileNested] })
    const repo = new FakeRepo({ '': [root], data: [dataPage] })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    await act(async () => {
      await result.current.expand('data')
    })
    await waitFor(() => expect(result.current.nodes.get('data')?.loaded).to.equal(true))

    const dataChildren = result.current.visibleKnownChildren('data').map((i) => i.path)
    expect(dataChildren).to.include('data/nested.txt')

    const allChildren = result.current.visibleKnownChildren('').map((i) => i.path)
    expect(allChildren).to.include.members(['top.txt', 'data/nested.txt', 'data'])
  })
})

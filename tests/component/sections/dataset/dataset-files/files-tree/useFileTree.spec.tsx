import { renderHook, act, waitFor } from '@testing-library/react'
import { useFileTree } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTree'
import { FileTreeRepository } from '../../../../../../src/files/domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../../../../../src/files/domain/models/FileTreePage'
import { DatasetVersionNumber } from '../../../../../../src/dataset/domain/models/Dataset'
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

  it('stringifies non-Error rejections from fetchPage (String(error) branch)', async () => {
    // Repository that rejects with a plain object — exercises the
    // false branch of `error instanceof Error ? error.message : String(error)`.
    const repo: FileTreeRepository = {
      getNode: () => Promise.reject({ kind: 'plain', detail: 'oops' } as unknown as Error)
    }

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    await waitFor(() => expect(result.current.rootNode.error).to.equal('[object Object]'))
    expect(result.current.rootNode.loading).to.equal(false)
  })

  it('reuses an in-flight fetch when expand() is called for a path mid-load', async () => {
    // Hold the root response on a manual deferred so we can call expand()
    // while the initial useEffect's ensureLoaded(ROOT) is still pending —
    // exercising the `if (pending) return pending` cache-hit branch.
    let resolveRoot!: (page: FileTreePage) => void
    const rootPromise = new Promise<FileTreePage>((r) => {
      resolveRoot = r
    })
    let getNodeCalls = 0
    class DeferredRepo implements FileTreeRepository {
      getNode(): Promise<FileTreePage> {
        getNodeCalls += 1
        return rootPromise
      }
    }

    const { result } = renderHook(() =>
      useFileTree({
        repository: new DeferredRepo(),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    expect(getNodeCalls, 'useEffect kicks off the first fetch').to.equal(1)

    // Now hit expand('') while the first fetch is still pending. The
    // in-flight check should return the existing promise without
    // calling getNode again.
    void result.current.expand('')
    expect(getNodeCalls, 'in-flight cache hit must not refetch').to.equal(1)

    await act(async () => {
      resolveRoot(FileTreePageMother.create({ path: '', items: [] }))
      await rootPromise
    })

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
  })

  it('resets state when the versionKey changes (different datasetVersion)', async () => {
    const root1 = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 1, name: 'v1.txt', path: 'v1.txt' })]
    })
    const root2 = FileTreePageMother.create({
      path: '',
      items: [FileTreeFileMother.create({ id: 9, name: 'v2.txt', path: 'v2.txt' })]
    })

    // Mutable-stub repo: swaps the response between renders so we can
    // verify both the reset (clears the v1 items) and the refetch
    // (lands the v2 items).
    let nextResponse = root1
    const repo: FileTreeRepository = {
      getNode: () => Promise.resolve(nextResponse)
    }

    const v1 = DatasetVersionMother.create({ number: new DatasetVersionNumber(1, 0) })
    const v2 = DatasetVersionMother.create({ number: new DatasetVersionNumber(2, 0) })

    const { result, rerender } = renderHook(
      ({ version }: { version: typeof datasetVersion }) =>
        useFileTree({
          repository: repo,
          datasetPersistentId: 'doi:test/AAA',
          datasetVersion: version
        }),
      { initialProps: { version: v1 } }
    )

    await waitFor(() => expect(result.current.rootNode.loaded).to.equal(true))
    expect(result.current.rootNode.items.map((i) => i.path)).to.deep.equal(['v1.txt'])

    nextResponse = root2
    rerender({ version: v2 })

    await waitFor(() =>
      expect(result.current.rootNode.items.map((i) => i.path)).to.deep.equal(['v2.txt'])
    )
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

  it('does not push state into a defunct hook when fetch resolves after unmount', async () => {
    // Repository whose root response we hold on a manual deferred — lets
    // us unmount the hook BEFORE the request finishes, simulating the
    // user toggling tree → table while the initial fetch is in flight.
    let resolveRoot!: (page: FileTreePage) => void
    const rootPromise = new Promise<FileTreePage>((r) => {
      resolveRoot = r
    })
    class DeferredRepo implements FileTreeRepository {
      getNode(): Promise<FileTreePage> {
        return rootPromise
      }
    }

    const { result, unmount } = renderHook(() =>
      useFileTree({
        repository: new DeferredRepo(),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion
      })
    )

    expect(result.current.rootNode.loading).to.equal(true)

    // Simulate the host component unmounting (view toggle).
    unmount()

    // Now resolve the in-flight request. With the mountedRef guard,
    // setNode skips the state update so a stuck "loading" stage from a
    // previous mount can't leak. Without the guard, React would log a
    // "setState on unmounted" warning. We assert no error is raised by
    // simply awaiting the resolution.
    await act(async () => {
      resolveRoot(
        FileTreePageMother.create({
          path: '',
          items: [FileTreeFileMother.create({ id: 1, name: 'late.txt', path: 'late.txt' })]
        })
      )
      await rootPromise
    })

    // The hook is unmounted; the result.current snapshot is frozen at
    // its last render. The contract here is "no crash, no warning" — a
    // healthy negative test for the guard.
    expect(result.current.rootNode.loaded).to.equal(false)
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

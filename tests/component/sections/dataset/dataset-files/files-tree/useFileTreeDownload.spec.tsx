import { renderHook, act, waitFor } from '@testing-library/react'
import { useFileTreeDownload } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTreeDownload'
import {
  FileTreeSelection,
  FileTreeSelectionTotals
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/useFileTreeSelection'
import { FileTreeRepository } from '../../../../../../src/files/domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../../../../../src/files/domain/models/FileTreePage'
import { FileTreeFile } from '../../../../../../src/files/domain/models/FileTreeItem'
import { DatasetVersionMother } from '../../../../dataset/domain/models/DatasetMother'
import {
  FileTreeFileMother,
  FileTreeFolderMother
} from '../../../../files/domain/models/FileTreeItemMother'
import { FileTreePageMother } from '../../../../files/domain/models/FileTreePageMother'

const datasetVersion = DatasetVersionMother.create()

class FakeRepo implements FileTreeRepository {
  public calls: string[] = []
  constructor(private readonly pages: Record<string, FileTreePage>) {}
  getNode(params: { path?: string }): Promise<FileTreePage> {
    const key = params.path ?? ''
    this.calls.push(key)
    const page = this.pages[key]
    if (!page) {
      return Promise.reject(new Error(`No mock for "${key}"`))
    }
    return Promise.resolve(page)
  }
}

/**
 * Build a FileTreeSelection literal for the hook's input. The hook only
 * reads `selectedFilePaths`, `selectedFolderPaths`, `deselectedFilePaths`,
 * and `filesById` from selection, so the rest can be no-ops.
 */
function selectionFixture(
  files: FileTreeFile[],
  args: {
    selectedFilePaths?: string[]
    selectedFolderPaths?: string[]
    deselectedFilePaths?: string[]
  } = {}
): FileTreeSelection {
  const filesById = new Map(files.map((f) => [f.id, f]))
  const totals: FileTreeSelectionTotals = {
    count: 0,
    bytes: 0,
    hasLogicalFolders: false
  }
  return {
    selectedFilePaths: new Set(args.selectedFilePaths ?? []),
    selectedFolderPaths: new Set(args.selectedFolderPaths ?? []),
    deselectedFilePaths: new Set(args.deselectedFilePaths ?? []),
    totals,
    fileState: () => 'none',
    folderState: () => 'none',
    toggleFile: () => undefined,
    toggleFolder: () => undefined,
    clear: () => undefined,
    filesById,
    registerFile: () => undefined
  }
}

describe('useFileTreeDownload', () => {
  it('downloads a single file via downloadNode and reports success', async () => {
    const file = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
    const onDownloadFiles = cy.stub().resolves()
    const repo = new FakeRepo({})
    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([file]),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(file)
    })

    expect(onDownloadFiles.callCount, 'onDownloadFiles called').to.equal(1)
    expect(onDownloadFiles.firstCall.args[0]).to.deep.equal([file])
    expect(result.current.progress.status).to.equal('success')
    expect(result.current.progress.enumeratedCount).to.equal(1)
  })

  it('enumerates a folder via downloadNode and dispatches the resolved files', async () => {
    const childA = FileTreeFileMother.create({ id: 10, name: 'a.txt', path: 'data/a.txt' })
    const childB = FileTreeFileMother.create({ id: 11, name: 'b.txt', path: 'data/b.txt' })
    const folder = FileTreeFolderMother.create({ name: 'data', path: 'data' })

    const repo = new FakeRepo({
      data: FileTreePageMother.create({ path: 'data', items: [childA, childB] })
    })
    const onDownloadFiles = cy.stub().resolves()

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([childA, childB]),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(folder)
    })

    expect(onDownloadFiles.callCount).to.equal(1)
    const dispatched = onDownloadFiles.firstCall.args[0] as FileTreeFile[]
    expect(dispatched.map((f) => f.id)).to.deep.equal([10, 11])
    expect(repo.calls).to.include('data')
  })

  it('downloadSelection merges explicit files with enumerated folders and honours deselected paths', async () => {
    const explicit = FileTreeFileMother.create({ id: 1, name: 'top.txt', path: 'top.txt' })
    const enumeratedKept = FileTreeFileMother.create({ id: 10, name: 'a.txt', path: 'data/a.txt' })
    const enumeratedDeselected = FileTreeFileMother.create({
      id: 11,
      name: 'b.txt',
      path: 'data/b.txt'
    })

    const repo = new FakeRepo({
      data: FileTreePageMother.create({
        path: 'data',
        items: [enumeratedKept, enumeratedDeselected]
      })
    })
    const onDownloadFiles = cy.stub().resolves()

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([explicit, enumeratedKept, enumeratedDeselected], {
          selectedFilePaths: ['top.txt'],
          selectedFolderPaths: ['data'],
          deselectedFilePaths: ['data/b.txt']
        }),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadSelection()
    })

    expect(onDownloadFiles.callCount).to.equal(1)
    const dispatched = onDownloadFiles.firstCall.args[0] as FileTreeFile[]
    // 'top.txt' (explicit) + 'data/a.txt' (enumerated, kept).
    // 'data/b.txt' is filtered out by deselectedFilePaths.
    expect(dispatched.map((f) => f.id).sort()).to.deep.equal([1, 10])
  })

  it('downloadSelection is a no-op when nothing is selected', async () => {
    const onDownloadFiles = cy.stub().resolves()
    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: new FakeRepo({}),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([]),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadSelection()
    })

    expect(onDownloadFiles.callCount).to.equal(0)
    expect(result.current.progress.status).to.equal('idle')
  })

  it('records error and calls onError when onDownloadFiles rejects', async () => {
    const file = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
    const onDownloadFiles = cy.stub().rejects(new Error('dispatch boom'))
    const onError = cy.stub()
    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: new FakeRepo({}),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([file]),
        onError,
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(file)
    })

    await waitFor(() => expect(result.current.progress.status).to.equal('error'))
    expect(result.current.progress.message).to.equal('dispatch boom')
    expect(onError.callCount).to.equal(1)
  })

  it('records error and calls onError when folder enumeration rejects', async () => {
    const folder = FileTreeFolderMother.create({ name: 'data', path: 'data' })
    const onDownloadFiles = cy.stub().resolves()
    const onError = cy.stub()
    const repo = new FakeRepo({}) // missing 'data' page → getNode rejects

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([]),
        onError,
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(folder)
    })

    await waitFor(() => expect(result.current.progress.status).to.equal('error'))
    expect(onError.callCount).to.equal(1)
    expect(onDownloadFiles.callCount).to.equal(0)
  })

  it('records error and calls onError when downloadSelection enumerates and the repo rejects', async () => {
    const onDownloadFiles = cy.stub().resolves()
    const onError = cy.stub()
    const repo = new FakeRepo({}) // missing 'data' → getNode rejects

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([], {
          selectedFolderPaths: ['data']
        }),
        onError,
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadSelection()
    })

    await waitFor(() => expect(result.current.progress.status).to.equal('error'))
    expect(onError.callCount).to.equal(1)
  })

  it('reset() returns progress to idle', async () => {
    const file = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
    const onDownloadFiles = cy.stub().resolves()
    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: new FakeRepo({}),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([file]),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(file)
    })
    expect(result.current.progress.status).to.equal('success')

    act(() => {
      result.current.reset()
    })
    expect(result.current.progress.status).to.equal('idle')
    expect(result.current.progress.enumeratedCount).to.equal(0)
  })

  it('downloadNode on an empty folder is a no-op (no dispatch, progress stays in enumerating)', async () => {
    const folder = FileTreeFolderMother.create({ name: 'empty', path: 'empty' })
    const repo = new FakeRepo({
      empty: FileTreePageMother.create({ path: 'empty', items: [] })
    })
    const onDownloadFiles = cy.stub().resolves()

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: repo,
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([]),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadNode(folder)
    })

    expect(onDownloadFiles.callCount, 'no dispatch when enumeration is empty').to.equal(0)
  })

  it('skips selectedFilePaths that are not present in filesById', async () => {
    const known = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'a.txt' })
    const onDownloadFiles = cy.stub().resolves()

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: new FakeRepo({}),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        // Selection references a path that is missing from filesById,
        // exercising lookupFile's `return undefined` fallback.
        selection: selectionFixture([known], {
          selectedFilePaths: ['ghost.txt']
        }),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadSelection()
    })

    expect(onDownloadFiles.callCount, 'no real files to dispatch').to.equal(0)
  })

  it('skips an explicitly selected file when its path is also in deselectedFilePaths', async () => {
    const f1 = FileTreeFileMother.create({ id: 1, name: 'keep.txt', path: 'keep.txt' })
    const f2 = FileTreeFileMother.create({ id: 2, name: 'drop.txt', path: 'drop.txt' })
    const onDownloadFiles = cy.stub().resolves()

    const { result } = renderHook(() =>
      useFileTreeDownload({
        treeRepository: new FakeRepo({}),
        datasetPersistentId: 'doi:test/AAA',
        datasetVersion,
        selection: selectionFixture([f1, f2], {
          selectedFilePaths: ['keep.txt', 'drop.txt'],
          deselectedFilePaths: ['drop.txt']
        }),
        onDownloadFiles
      })
    )

    await act(async () => {
      await result.current.downloadSelection()
    })

    expect(onDownloadFiles.callCount).to.equal(1)
    const dispatched = onDownloadFiles.firstCall.args[0] as FileTreeFile[]
    expect(dispatched.map((f) => f.id)).to.deep.equal([1])
  })
})

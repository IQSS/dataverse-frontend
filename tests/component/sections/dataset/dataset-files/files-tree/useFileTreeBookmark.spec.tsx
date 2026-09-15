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

describe('useFileTree bookmarkability', () => {
  it('expands every ancestor of initialPath on mount and pre-fetches them', async () => {
    const repo = new FakeRepo({
      '': FileTreePageMother.create({
        path: '',
        items: [FileTreeFolderMother.create({ name: 'data', path: 'data' })]
      }),
      data: FileTreePageMother.create({
        path: 'data',
        items: [FileTreeFolderMother.create({ name: 'raw', path: 'data/raw' })]
      }),
      'data/raw': FileTreePageMother.create({
        path: 'data/raw',
        items: [FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'data/raw/a.txt' })]
      })
    })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:10.5072/FK2/AAA',
        datasetVersion,
        initialPath: 'data/raw'
      })
    )

    await waitFor(() => {
      expect(result.current.expanded.has('data')).to.equal(true)
      expect(result.current.expanded.has('data/raw')).to.equal(true)
    })
    await waitFor(() => {
      expect(repo.calls).to.include('')
      expect(repo.calls).to.include('data')
      expect(repo.calls).to.include('data/raw')
    })
    expect(result.current.currentPath).to.equal('data/raw')
  })

  it('updates currentPath as folders are expanded and collapsed', async () => {
    const repo = new FakeRepo({
      '': FileTreePageMother.create({
        path: '',
        items: [FileTreeFolderMother.create({ name: 'data', path: 'data' })]
      }),
      data: FileTreePageMother.create({
        path: 'data',
        items: [FileTreeFolderMother.create({ name: 'raw', path: 'data/raw' })]
      }),
      'data/raw': FileTreePageMother.create({
        path: 'data/raw',
        items: []
      })
    })

    const { result } = renderHook(() =>
      useFileTree({
        repository: repo,
        datasetPersistentId: 'doi:10.5072/FK2/AAA',
        datasetVersion
      })
    )

    expect(result.current.currentPath).to.equal('')
    await act(async () => {
      await result.current.expand('data')
    })
    expect(result.current.currentPath).to.equal('data')
    await act(async () => {
      await result.current.expand('data/raw')
    })
    expect(result.current.currentPath).to.equal('data/raw')
    act(() => {
      result.current.collapse('data/raw')
    })
    expect(result.current.currentPath).to.equal('data')
  })
})

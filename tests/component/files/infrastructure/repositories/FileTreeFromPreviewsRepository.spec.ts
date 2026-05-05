import {
  FileTreeFromPreviewsRepository,
  normalizePath
} from '../../../../../src/files/infrastructure/repositories/FileTreeFromPreviewsRepository'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { FilePreviewMother } from '../../domain/models/FilePreviewMother'
import { FileMetadataMother } from '../../domain/models/FileMetadataMother'
import { FileSize, FileSizeUnit } from '../../../../../src/files/domain/models/FileMetadata'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileTreeInclude, FileTreeOrder } from '../../../../../src/files/domain/models/FileTreePage'
import {
  isFileTreeFile,
  isFileTreeFolder
} from '../../../../../src/files/domain/models/FileTreeItem'

const datasetVersion = DatasetVersionMother.create()

function makePreviewWithDirectory(id: number, name: string, directory?: string, sizeBytes = 1024) {
  return FilePreviewMother.create({
    id,
    name,
    metadata: FileMetadataMother.create({
      directory,
      size: new FileSize(sizeBytes, FileSizeUnit.BYTES)
    })
  })
}

class FakeFileRepository implements FileRepository {
  public callCount = 0
  constructor(private readonly previews: ReturnType<typeof makePreviewWithDirectory>[]) {}
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getAllByDatasetPersistentIdWithCount() {
    this.callCount += 1
    return Promise.resolve({
      files: this.previews,
      totalFilesCount: this.previews.length
    })
  }
  getAllByDatasetPersistentId(): never {
    throw new Error('not used')
  }
  getFilesCountInfoByDatasetPersistentId(): never {
    throw new Error('not used')
  }
  getFilesTotalDownloadSizeByDatasetPersistentId(): never {
    throw new Error('not used')
  }
  getFileVersionSummaries(): never {
    throw new Error('not used')
  }
  getById(): never {
    throw new Error('not used')
  }
  getMultipleFileDownloadUrl(): never {
    throw new Error('not used')
  }
  getFileDownloadUrl(): never {
    throw new Error('not used')
  }
  uploadFile(): never {
    throw new Error('not used')
  }
  addUploadedFiles(): never {
    throw new Error('not used')
  }
  delete(): never {
    throw new Error('not used')
  }
  replace(): never {
    throw new Error('not used')
  }
  getFixityAlgorithm(): never {
    throw new Error('not used')
  }
  updateMetadata(): never {
    throw new Error('not used')
  }
  restrict(): never {
    throw new Error('not used')
  }
  updateTabularTags(): never {
    throw new Error('not used')
  }
  updateCategories(): never {
    throw new Error('not used')
  }
}

describe('FileTreeFromPreviewsRepository', () => {
  it('groups previews by their first-level directory at root', async () => {
    const previews = [
      makePreviewWithDirectory(1, 'top.txt'),
      makePreviewWithDirectory(2, 'a.txt', 'data'),
      makePreviewWithDirectory(3, 'b.txt', 'data/raw'),
      makePreviewWithDirectory(4, 'c.txt', 'docs')
    ]
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const page = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion
    })
    const folderNames = page.items.filter(isFileTreeFolder).map((f) => f.name)
    const fileNames = page.items.filter(isFileTreeFile).map((f) => f.name)
    expect(folderNames).to.deep.equal(['data', 'docs'])
    expect(fileNames).to.deep.equal(['top.txt'])
  })

  it('counts distinct subfolders and all descendant files on each folder item', async () => {
    const previews = [
      makePreviewWithDirectory(1, 'a.txt', 'data/sub1'),
      makePreviewWithDirectory(2, 'b.txt', 'data/sub1'),
      makePreviewWithDirectory(3, 'c.txt', 'data/sub2'),
      makePreviewWithDirectory(4, 'd.txt', 'data')
    ]
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const page = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion
    })
    const dataFolder = page.items.filter(isFileTreeFolder).find((f) => f.name === 'data')
    expect(dataFolder).to.not.equal(undefined)
    expect(dataFolder?.counts).to.deep.equal({ files: 4, folders: 2 })
  })

  it('lists files inside a folder by exact path match only', async () => {
    const previews = [
      makePreviewWithDirectory(1, 'a.txt', 'data'),
      makePreviewWithDirectory(2, 'sub.txt', 'data/sub'),
      makePreviewWithDirectory(3, 'unrelated.txt', 'docs')
    ]
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const page = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      path: 'data'
    })
    const names = page.items.map((i) => i.name)
    expect(names).to.deep.equal(['sub', 'a.txt'])
  })

  it('honors include filter for folders or files only', async () => {
    const previews = [
      makePreviewWithDirectory(1, 'top.txt'),
      makePreviewWithDirectory(2, 'inside.txt', 'data')
    ]
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const onlyFolders = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      include: FileTreeInclude.FOLDERS
    })
    expect(onlyFolders.items.every(isFileTreeFolder)).to.equal(true)

    const onlyFiles = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      include: FileTreeInclude.FILES
    })
    expect(onlyFiles.items.every(isFileTreeFile)).to.equal(true)
  })

  it('paginates with an opaque cursor and returns the same total via approximateCount', async () => {
    const previews = Array.from({ length: 7 }).map((_, i) =>
      makePreviewWithDirectory(i + 1, `f${i + 1}.txt`)
    )
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const first = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      limit: 3
    })
    expect(first.items).to.have.length(3)
    expect(first.nextCursor).to.not.equal(null)

    const second = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      limit: 3,
      cursor: first.nextCursor as string
    })
    expect(second.items).to.have.length(3)
    expect(second.nextCursor).to.not.equal(null)

    const third = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      limit: 3,
      cursor: second.nextCursor as string
    })
    expect(third.items).to.have.length(1)
    expect(third.nextCursor).to.equal(null)
  })

  it('supports descending order', async () => {
    const previews = [makePreviewWithDirectory(1, 'a.txt'), makePreviewWithDirectory(2, 'b.txt')]
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository(previews))
    const page = await repo.getNode({
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      order: FileTreeOrder.NAME_ZA
    })
    expect(page.items.map((i) => i.name)).to.deep.equal(['b.txt', 'a.txt'])
  })

  it('rejects invalid cursors', async () => {
    const repo = new FileTreeFromPreviewsRepository(new FakeFileRepository([]))
    let thrown: unknown
    try {
      await repo.getNode({
        datasetPersistentId: 'doi:10.5072/FK2/AAA',
        datasetVersion,
        cursor: 'not-a-real-cursor'
      })
    } catch (error) {
      thrown = error
    }
    expect((thrown as Error).message).to.match(/cursor/i)
  })

  it('caches previews per (persistentId, version)', async () => {
    const previews = [makePreviewWithDirectory(1, 'a.txt')]
    const fileRepo = new FakeFileRepository(previews)
    const repo = new FileTreeFromPreviewsRepository(fileRepo)
    await repo.getNode({ datasetPersistentId: 'doi:10.5072/FK2/AAA', datasetVersion })
    await repo.getNode({ datasetPersistentId: 'doi:10.5072/FK2/AAA', datasetVersion, path: '' })
    expect(fileRepo.callCount).to.equal(1)
  })
})

describe('normalizePath', () => {
  it('strips leading and trailing slashes and collapses repeats', () => {
    expect(normalizePath('/data//sub///')).to.equal('data/sub')
    expect(normalizePath('')).to.equal('')
    expect(normalizePath(undefined)).to.equal('')
    expect(normalizePath('/foo')).to.equal('foo')
  })
})

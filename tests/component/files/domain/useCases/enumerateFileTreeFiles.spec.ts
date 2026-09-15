import { enumerateFileTreeFiles } from '../../../../../src/files/domain/useCases/enumerateFileTreeFiles'
import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '../../../../../src/files/domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../../../../src/files/domain/models/FileTreePage'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileTreeFileMother, FileTreeFolderMother } from '../models/FileTreeItemMother'
import { FileTreePageMother } from '../models/FileTreePageMother'

class FakeRepo implements FileTreeRepository {
  constructor(private readonly pages: Map<string, FileTreePage[]>) {}
  getNode(params: GetFileTreeNodeParams): Promise<FileTreePage> {
    const queue = this.pages.get(params.path ?? '')
    if (!queue || queue.length === 0) {
      return Promise.reject(new Error(`No mock for path "${params.path ?? ''}"`))
    }
    if (params.cursor) {
      const idx = queue.findIndex((p, i) => i > 0 && queue[i - 1].nextCursor === params.cursor)
      if (idx === -1) {
        return Promise.reject(new Error('Bad cursor'))
      }
      return Promise.resolve(queue[idx])
    }
    return Promise.resolve(queue[0])
  }
}

const datasetVersion = DatasetVersionMother.create()

describe('enumerateFileTreeFiles', () => {
  it('walks paginated children and recursive folders to produce a flat file list', async () => {
    const sub = FileTreeFolderMother.create({ name: 'sub', path: 'data/sub' })
    const fileA = FileTreeFileMother.create({ id: 1, name: 'a.txt', path: 'data/a.txt' })
    const fileB = FileTreeFileMother.create({ id: 2, name: 'b.txt', path: 'data/b.txt' })
    const fileC = FileTreeFileMother.create({ id: 3, name: 'c.txt', path: 'data/sub/c.txt' })

    const dataPages = [
      FileTreePageMother.create({ path: 'data', items: [sub, fileA], nextCursor: 'p2' }),
      FileTreePageMother.create({ path: 'data', items: [fileB], nextCursor: null })
    ]
    const subPages = [FileTreePageMother.create({ path: 'data/sub', items: [fileC] })]

    const repo = new FakeRepo(
      new Map<string, FileTreePage[]>([
        ['data', dataPages],
        ['data/sub', subPages]
      ])
    )

    const files = await enumerateFileTreeFiles(repo, {
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      paths: ['data']
    })

    expect(files.map((f) => f.id).sort()).to.deep.equal([1, 2, 3])
  })

  it('deduplicates files reachable via overlapping starting paths', async () => {
    const fileA = FileTreeFileMother.create({ id: 9, name: 'a.txt', path: 'data/a.txt' })
    const fileB = FileTreeFileMother.create({ id: 10, name: 'b.txt', path: 'shared/b.txt' })
    const repo = new FakeRepo(
      new Map([
        ['data', [FileTreePageMother.create({ path: 'data', items: [fileA] })]],
        ['shared', [FileTreePageMother.create({ path: 'shared', items: [fileA, fileB] })]]
      ])
    )
    const files = await enumerateFileTreeFiles(repo, {
      datasetPersistentId: 'doi:10.5072/FK2/AAA',
      datasetVersion,
      paths: ['data', 'shared']
    })
    expect(files.length).to.equal(2)
  })
})

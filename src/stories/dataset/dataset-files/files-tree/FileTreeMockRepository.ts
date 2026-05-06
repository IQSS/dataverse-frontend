import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '../../../../files/domain/repositories/FileTreeRepository'
import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeItem,
  FileTreeItemType
} from '../../../../files/domain/models/FileTreeItem'
import {
  FileTreePage,
  FileTreeInclude,
  FileTreeOrder
} from '../../../../files/domain/models/FileTreePage'

const folder = (name: string, path: string, files = 0, folders = 0): FileTreeFolder => ({
  type: FileTreeItemType.FOLDER,
  name,
  path,
  counts: { files, folders }
})

const file = (id: number, name: string, path: string, size: number): FileTreeFile => ({
  type: FileTreeItemType.FILE,
  id,
  name,
  path,
  size,
  contentType: 'application/octet-stream',
  access: {
    restricted: false,
    latestVersionRestricted: false,
    canBeRequested: false,
    requested: false
  },
  downloadUrl: `/api/access/datafile/${id}`
})

const TREE: Record<string, FileTreeItem[]> = {
  '': [
    folder('data', 'data', 12, 2),
    folder('docs', 'docs', 3, 0),
    file(1, 'README.md', 'README.md', 1024),
    file(2, 'LICENSE.txt', 'LICENSE.txt', 2048)
  ],
  data: [
    folder('raw', 'data/raw', 8, 1),
    folder('processed', 'data/processed', 4, 0),
    file(10, 'manifest.json', 'data/manifest.json', 512)
  ],
  'data/raw': [
    folder('2024', 'data/raw/2024', 8, 0),
    file(100, 'codebook.csv', 'data/raw/codebook.csv', 4096)
  ],
  'data/raw/2024': [
    file(200, 'sample-001.tsv', 'data/raw/2024/sample-001.tsv', 8192),
    file(201, 'sample-002.tsv', 'data/raw/2024/sample-002.tsv', 8192),
    file(202, 'sample-003.tsv', 'data/raw/2024/sample-003.tsv', 8192)
  ],
  'data/processed': [file(300, 'aggregate.parquet', 'data/processed/aggregate.parquet', 16384)],
  docs: [
    file(400, 'protocol.pdf', 'docs/protocol.pdf', 32768),
    file(401, 'changelog.md', 'docs/changelog.md', 1024),
    file(402, 'glossary.md', 'docs/glossary.md', 2048)
  ]
}

/**
 * Tiny in-memory repository for Storybook / Chromatic snapshots of the
 * lazy file tree. The tree shape exercises folders, sub-folders, mixed
 * file types, and the "Load more" path is intentionally not triggered
 * (page size larger than the largest mock folder).
 */
export class FileTreeMockRepository implements FileTreeRepository {
  getNode(params: GetFileTreeNodeParams): Promise<FileTreePage> {
    const path = params.path ?? ''
    const items = TREE[path] ?? []
    return Promise.resolve({
      path,
      items,
      nextCursor: null,
      limit: params.limit ?? 100,
      order: params.order ?? FileTreeOrder.NAME_AZ,
      include: params.include ?? FileTreeInclude.ALL,
      approximateCount: items.length
    })
  }
}

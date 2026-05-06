import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeItem,
  FileTreeItemType
} from '../../domain/models/FileTreeItem'
import { FileTreeInclude, FileTreeOrder, FileTreePage } from '../../domain/models/FileTreePage'
import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '../../domain/repositories/FileTreeRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { FilePreview } from '../../domain/models/FilePreview'
import { FilePaginationInfo } from '../../domain/models/FilePaginationInfo'
import { FileCriteria } from '../../domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

const PAGE_SIZE = 1000

/**
 * Tree-shaped view of an existing dataset file listing.
 *
 * This adapter is used while the dedicated paginated tree endpoint
 * (`GET /api/datasets/{id}/versions/{versionId}/tree`) is not deployed yet
 * on the target Dataverse instance. It pulls the dataset file previews via
 * the existing `FileRepository` (paginating internally), groups them by
 * `directoryLabel`, and exposes the same `FileTreeRepository` contract that
 * the new endpoint will satisfy.
 *
 * Once the endpoint and SDK helper land, the SPA can swap this for a thin
 * `FileTreeJSDataverseRepository` that calls the SDK directly. The UI does
 * not need to change.
 */
export class FileTreeFromPreviewsRepository implements FileTreeRepository {
  private cache = new Map<string, FilePreview[]>()

  constructor(
    private readonly fileRepository: FileRepository,
    private readonly accessApiBase: string = '/api/access/datafile'
  ) {}

  async getNode(params: GetFileTreeNodeParams): Promise<FileTreePage> {
    const path = normalizePath(params.path)
    const order = params.order ?? FileTreeOrder.NAME_AZ
    const include = params.include ?? FileTreeInclude.ALL
    const limit = clampLimit(params.limit)
    const previews = await this.loadAllPreviews(params.datasetPersistentId, params.datasetVersion)
    const items = collectImmediateChildren(previews, path, order, include, this.accessApiBase)
    const offset = parseCursor(params.cursor)
    const slice = items.slice(offset, offset + limit)
    const nextCursor = offset + limit < items.length ? encodeCursor(offset + limit) : null
    return {
      path,
      items: slice,
      nextCursor,
      limit,
      order,
      include,
      approximateCount: items.length
    }
  }

  private async loadAllPreviews(
    persistentId: string,
    datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    const key = `${persistentId}::${datasetVersion.number.toString()}`
    const cached = this.cache.get(key)
    if (cached) {
      return cached
    }
    const all: FilePreview[] = []
    let page = 1
    let total = Number.POSITIVE_INFINITY
    const criteria = new FileCriteria()
    while (all.length < total) {
      const pageInfo = new FilePaginationInfo(page, PAGE_SIZE, total === Infinity ? 0 : total)
      const result = await this.fileRepository.getAllByDatasetPersistentIdWithCount(
        persistentId,
        datasetVersion,
        pageInfo,
        criteria
      )
      total = result.totalFilesCount
      all.push(...result.files)
      if (result.files.length < PAGE_SIZE) {
        break
      }
      page += 1
    }
    this.cache.set(key, all)
    return all
  }
}

const CURSOR_PREFIX = 'mem:'

function clampLimit(limit?: number): number {
  if (!limit || limit <= 0) {
    return 100
  }
  if (limit > 1000) {
    return 1000
  }
  return Math.floor(limit)
}

function parseCursor(cursor?: string): number {
  if (!cursor) {
    return 0
  }
  if (!cursor.startsWith(CURSOR_PREFIX)) {
    throw new Error('Invalid cursor')
  }
  const offset = Number.parseInt(cursor.slice(CURSOR_PREFIX.length), 10)
  if (!Number.isFinite(offset) || offset < 0) {
    throw new Error('Invalid cursor')
  }
  return offset
}

function encodeCursor(offset: number): string {
  return `${CURSOR_PREFIX}${offset}`
}

export function normalizePath(input?: string): string {
  if (!input) {
    return ''
  }
  return input.replace(/\/+/g, '/').replace(/^\/+/, '').replace(/\/+$/, '')
}

interface FolderAccumulator {
  name: string
  path: string
  fileCount: number
  subfolderNames: Set<string>
}

function collectImmediateChildren(
  previews: FilePreview[],
  path: string,
  order: FileTreeOrder,
  include: FileTreeInclude,
  accessApiBase: string
): FileTreeItem[] {
  const folders = new Map<string, FolderAccumulator>()
  const files: FileTreeFile[] = []
  const prefix = path === '' ? '' : `${path}/`
  for (const preview of previews) {
    const directory = (preview.metadata.directory ?? '').replace(/^\/+|\/+$/g, '')
    if (path !== '' && directory !== path && !directory.startsWith(prefix)) {
      continue
    }
    if (directory === path) {
      files.push(buildFile(preview, path, accessApiBase))
      continue
    }
    const remainder = directory.slice(prefix.length)
    const segment = remainder.split('/')[0]
    if (!segment) {
      continue
    }
    const folderPath = prefix + segment
    let entry = folders.get(folderPath)
    if (!entry) {
      entry = {
        name: segment,
        path: folderPath,
        fileCount: 0,
        subfolderNames: new Set<string>()
      }
      folders.set(folderPath, entry)
    }
    entry.fileCount += 1
    if (directory !== folderPath) {
      // Track distinct subfolder names (the next path segment after this folder).
      const sub = directory.slice(folderPath.length + 1).split('/')[0]
      if (sub) {
        entry.subfolderNames.add(sub)
      }
    }
  }

  const folderItems: FileTreeFolder[] = Array.from(folders.values()).map((f) => ({
    type: FileTreeItemType.FOLDER,
    name: f.name,
    path: f.path,
    counts: { files: f.fileCount, folders: f.subfolderNames.size }
  }))

  sortByName(folderItems, order)
  sortByName(files, order)

  if (include === FileTreeInclude.FOLDERS) {
    return folderItems
  }
  if (include === FileTreeInclude.FILES) {
    return files
  }
  return [...folderItems, ...files]
}

function buildFile(preview: FilePreview, parentPath: string, accessApiBase: string): FileTreeFile {
  return {
    type: FileTreeItemType.FILE,
    id: preview.id,
    name: preview.name,
    path: parentPath === '' ? preview.name : `${parentPath}/${preview.name}`,
    size: preview.metadata.size.toBytes(),
    contentType: preview.metadata.type.value,
    access: preview.access,
    checksum: preview.metadata.checksum
      ? {
          type: preview.metadata.checksum.algorithm,
          value: preview.metadata.checksum.value
        }
      : undefined,
    downloadUrl: `${accessApiBase}/${preview.id}`
  }
}

function sortByName<T extends { name: string }>(items: T[], order: FileTreeOrder): void {
  const dir = order === FileTreeOrder.NAME_ZA ? -1 : 1
  items.sort((a, b) => dir * a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
}

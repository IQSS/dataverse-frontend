import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '../../domain/repositories/FileTreeRepository'
import { FileTreeInclude, FileTreeOrder, FileTreePage } from '../../domain/models/FileTreePage'
import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeItem,
  FileTreeItemType
} from '../../domain/models/FileTreeItem'
import {
  FileTreeFileNode as SDKFileTreeFileNode,
  FileTreeFolderNode as SDKFileTreeFolderNode,
  FileTreeInclude as SDKFileTreeInclude,
  FileTreeNode as SDKFileTreeNode,
  FileTreeOrder as SDKFileTreeOrder,
  FileTreePage as SDKFileTreePage,
  ReadError,
  isFileTreeFileNode,
  isFileTreeFolderNode,
  listDatasetTreeNode
} from '@iqss/dataverse-client-javascript'
import { FileTreeFromPreviewsRepository } from './FileTreeFromPreviewsRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'

/**
 * Calls the dedicated tree endpoint via the SDK helper
 * `listDatasetTreeNode`, which wraps
 * `GET /api/datasets/{id}/versions/{versionId}/tree`.
 *
 * When the endpoint is not available on the target instance the
 * repository falls back to the in-memory `FileTreeFromPreviewsRepository`
 * so the SPA stays usable in mixed-version deployments.
 */
export class FileTreeJSDataverseRepository implements FileTreeRepository {
  private fallback?: FileTreeFromPreviewsRepository
  private endpointUnavailable = false

  constructor(private readonly fileRepository?: FileRepository) {}

  async getNode(params: GetFileTreeNodeParams): Promise<FileTreePage> {
    if (this.endpointUnavailable && this.fallback) {
      return this.fallback.getNode(params)
    }
    try {
      const sdkPage = await listDatasetTreeNode.execute({
        datasetId: params.datasetPersistentId,
        datasetVersionId: params.datasetVersion.number.toString(),
        path: params.path,
        limit: params.limit,
        cursor: params.cursor,
        include: toSDKInclude(params.include),
        order: toSDKOrder(params.order),
        includeDeaccessioned: params.includeDeaccessioned,
        originals: params.originals
      })
      return mapPage(sdkPage, params)
    } catch (error) {
      if (this.fileRepository && isEndpointMissing(error)) {
        this.endpointUnavailable = true
        if (!this.fallback) {
          this.fallback = new FileTreeFromPreviewsRepository(this.fileRepository)
        }
        return this.fallback.getNode(params)
      }
      throw error
    }
  }
}

function mapPage(page: SDKFileTreePage, params: GetFileTreeNodeParams): FileTreePage {
  const items: FileTreeItem[] = page.items.map(mapItem)
  return {
    path: page.path,
    items,
    nextCursor: page.nextCursor,
    limit: page.limit,
    order: fromSDKOrder(page.order, params.order),
    include: fromSDKInclude(page.include, params.include),
    approximateCount: page.approximateCount
  }
}

function mapItem(item: SDKFileTreeNode): FileTreeItem {
  if (isFileTreeFolderNode(item)) {
    return mapFolder(item)
  }
  if (isFileTreeFileNode(item)) {
    return mapFile(item)
  }
  // The SDK's union is exhaustive; this is a defensive fallthrough so
  // a future server-side type addition doesn't crash the SPA.
  /* istanbul ignore next */
  throw new Error(`Unknown file tree node type: ${(item as { type: string }).type}`)
}

function mapFolder(item: SDKFileTreeFolderNode): FileTreeFolder {
  return {
    type: FileTreeItemType.FOLDER,
    name: item.name,
    path: item.path,
    counts: item.counts
  }
}

function mapFile(item: SDKFileTreeFileNode): FileTreeFile {
  return {
    type: FileTreeItemType.FILE,
    id: item.id,
    name: item.name,
    path: item.path,
    size: item.size,
    contentType: item.contentType,
    access: item.access
      ? {
          restricted: item.access !== 'public',
          latestVersionRestricted: item.access !== 'public',
          canBeRequested: item.access === 'restricted',
          requested: false
        }
      : undefined,
    checksum: item.checksum,
    downloadUrl: item.downloadUrl
  }
}

function toSDKOrder(value?: FileTreeOrder): SDKFileTreeOrder | undefined {
  if (value === undefined) return undefined
  return value === FileTreeOrder.NAME_ZA ? SDKFileTreeOrder.NAME_ZA : SDKFileTreeOrder.NAME_AZ
}

function toSDKInclude(value?: FileTreeInclude): SDKFileTreeInclude | undefined {
  if (value === undefined) return undefined
  switch (value) {
    case FileTreeInclude.FOLDERS:
      return SDKFileTreeInclude.FOLDERS
    case FileTreeInclude.FILES:
      return SDKFileTreeInclude.FILES
    case FileTreeInclude.ALL:
    default:
      return SDKFileTreeInclude.ALL
  }
}

function fromSDKOrder(value: SDKFileTreeOrder, fallback?: FileTreeOrder): FileTreeOrder {
  return value === SDKFileTreeOrder.NAME_ZA
    ? FileTreeOrder.NAME_ZA
    : (value as unknown as FileTreeOrder) ?? fallback ?? FileTreeOrder.NAME_AZ
}

function fromSDKInclude(value: SDKFileTreeInclude, fallback?: FileTreeInclude): FileTreeInclude {
  switch (value) {
    case SDKFileTreeInclude.FOLDERS:
      return FileTreeInclude.FOLDERS
    case SDKFileTreeInclude.FILES:
      return FileTreeInclude.FILES
    case SDKFileTreeInclude.ALL:
      return FileTreeInclude.ALL
    default:
      return fallback ?? FileTreeInclude.ALL
  }
}

function isEndpointMissing(error: unknown): boolean {
  if (error instanceof ReadError) {
    return /\[(404|405|501)\]/.test(error.message)
  }
  // Defensive: pre-SDK-wrapped axios errors used by the previous
  // implementation. Kept so a transitional state (older browsers /
  // cached SDK build) doesn't regress.
  /* istanbul ignore next */
  const status = (error as { response?: { status?: number } })?.response?.status
  /* istanbul ignore next */
  return status === 404 || status === 405 || status === 501
}

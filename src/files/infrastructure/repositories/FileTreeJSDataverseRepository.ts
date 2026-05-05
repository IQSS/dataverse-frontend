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
import { axiosInstance } from '@/axiosInstance'
import { requireAppConfig } from '../../../config'
import { FileTreeFromPreviewsRepository } from './FileTreeFromPreviewsRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'

interface RawFolder {
  type: 'folder'
  name: string
  path: string
  counts?: { files: number; folders: number }
}

interface RawFile {
  type: 'file'
  id: number
  name: string
  path: string
  size: number
  contentType?: string
  access?: 'public' | 'restricted' | 'embargoed'
  checksum?: { type: string; value: string }
  downloadUrl: string
}

interface RawTreeResponse {
  path: string
  items: (RawFolder | RawFile)[]
  nextCursor: string | null
  limit: number
  order: string
  include: string
  approximateCount?: number
}

/**
 * Calls the dedicated tree endpoint
 * `GET /api/datasets/{id}/versions/{versionId}/tree`. When the endpoint is not
 * available on the target instance the repository falls back to the in-memory
 * `FileTreeFromPreviewsRepository` so the SPA stays usable in mixed-version
 * deployments.
 *
 * TODO: replace the inline `axiosInstance.get` call with
 * `listDatasetTreeNode` from `@iqss/dataverse-client-javascript` once the
 * SDK prerelease that ships those helpers is published. The wire format is
 * already aligned with the SDK's `transformTreeResponseToFileTreePage`.
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
      const versionId = encodeURIComponent(params.datasetVersion.number.toString())
      const persistentId = encodeURIComponent(params.datasetPersistentId)
      const search = buildQuery(params)
      const url = `${
        FileTreeJSDataverseRepository.baseUrl
      }/api/datasets/:persistentId/versions/${versionId}/tree?persistentId=${persistentId}${
        search ? `&${search}` : ''
      }`
      const response = await axiosInstance.get<{ data: RawTreeResponse } | RawTreeResponse>(url, {
        withCredentials: true
      })
      const payload = unwrap(response.data)
      return mapResponse(payload, params)
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

  static get baseUrl(): string {
    return requireAppConfig().backendUrl
  }
}

function buildQuery(params: GetFileTreeNodeParams): string {
  const out: string[] = []
  if (params.path) out.push(`path=${encodeURIComponent(params.path)}`)
  if (params.limit !== undefined) out.push(`limit=${params.limit}`)
  if (params.cursor) out.push(`cursor=${encodeURIComponent(params.cursor)}`)
  if (params.include) out.push(`include=${params.include}`)
  if (params.order) out.push(`order=${params.order}`)
  if (params.includeDeaccessioned) out.push('includeDeaccessioned=true')
  if (params.originals) out.push('originals=true')
  return out.join('&')
}

function unwrap<T>(value: { data: T } | T): T {
  if (value && typeof value === 'object' && 'data' in (value as Record<string, unknown>)) {
    return (value as { data: T }).data
  }
  return value as T
}

function mapResponse(raw: RawTreeResponse, params: GetFileTreeNodeParams): FileTreePage {
  const items: FileTreeItem[] = raw.items.map((item) =>
    item.type === 'folder' ? mapFolder(item) : mapFile(item)
  )
  return {
    path: raw.path,
    items,
    nextCursor: raw.nextCursor,
    limit: raw.limit,
    order: parseOrder(raw.order, params.order),
    include: parseInclude(raw.include, params.include),
    approximateCount: raw.approximateCount
  }
}

function mapFolder(item: RawFolder): FileTreeFolder {
  return {
    type: FileTreeItemType.FOLDER,
    name: item.name,
    path: item.path,
    counts: item.counts
  }
}

function mapFile(item: RawFile): FileTreeFile {
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

function parseOrder(value: string, fallback?: FileTreeOrder): FileTreeOrder {
  if (value === FileTreeOrder.NAME_AZ || value === FileTreeOrder.NAME_ZA) {
    return value
  }
  return fallback ?? FileTreeOrder.NAME_AZ
}

function parseInclude(value: string, fallback?: FileTreeInclude): FileTreeInclude {
  if (
    value === FileTreeInclude.ALL ||
    value === FileTreeInclude.FOLDERS ||
    value === FileTreeInclude.FILES
  ) {
    return value
  }
  return fallback ?? FileTreeInclude.ALL
}

function isEndpointMissing(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status
  return status === 404 || status === 405 || status === 501
}

import {
  FileTreeRepository,
  GetFileTreeNodeParams
} from '../../domain/repositories/FileTreeRepository'
import { FileTreePage } from '../../domain/models/FileTreePage'
import { listDatasetTreeNode } from '@iqss/dataverse-client-javascript'
import { FileTreeFromPreviewsRepository } from './FileTreeFromPreviewsRepository'
import { FileRepository } from '../../domain/repositories/FileRepository'
import { JSFileTreeMapper } from '../mappers/JSFileTreeMapper'

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
        include: JSFileTreeMapper.toSDKFileTreeInclude(params.include),
        order: JSFileTreeMapper.toSDKFileTreeOrder(params.order),
        includeDeaccessioned: params.includeDeaccessioned,
        originals: params.originals
      })
      return JSFileTreeMapper.toFileTreePage(sdkPage, params.order, params.include)
    } catch (error) {
      if (this.fileRepository && JSFileTreeMapper.isEndpointMissing(error)) {
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

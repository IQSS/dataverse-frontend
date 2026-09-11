import { getDatasetFiles } from '@iqss/dataverse-client-javascript'
import { DatasetVersion } from '@/dataset/domain/models/Dataset'
import { FileCriteria } from '@/files/domain/models/FileCriteria'
import { FilePaginationInfo } from '@/files/domain/models/FilePaginationInfo'
import { FilePermissions } from '@/files/domain/models/FilePermissions'
import { FilesWithCount } from '@/files/domain/models/FilesWithCount'
import { DomainFileMapper } from '@/files/infrastructure/mappers/DomainFileMapper'
import { JSFileMapper } from '@/files/infrastructure/mappers/JSFileMapper'
import { FilePreviewSource } from '@/files/infrastructure/repositories/FileTreeFromPreviewsRepository'

const noPermissions: FilePermissions = {
  canDownloadFile: false,
  canManageFilePermissions: false,
  canEditOwnerDataset: false
}

export class StandaloneFilePreviewSource implements FilePreviewSource {
  async getAllByDatasetPersistentIdWithCount(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo: FilePaginationInfo = new FilePaginationInfo(),
    criteria: FileCriteria = new FileCriteria(),
    includeDeaccessioned?: boolean
  ): Promise<FilesWithCount> {
    const subset = await getDatasetFiles.execute(
      datasetPersistentId,
      datasetVersion.number.toString(),
      includeDeaccessioned,
      paginationInfo.pageSize,
      paginationInfo.offset,
      DomainFileMapper.toJSFileSearchCriteria(criteria),
      DomainFileMapper.toJSFileOrderCriteria(criteria.sortBy)
    )
    return {
      files: subset.files.map((jsFile) =>
        JSFileMapper.toFilePreview(jsFile, datasetVersion, 0, noPermissions)
      ),
      totalFilesCount: subset.totalFilesCount
    }
  }
}

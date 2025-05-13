import {
  File as JSFile,
  Dataset as JSDataset,
  DvObjectOwnerNode as JSUpwardHierarchyNode
} from '@iqss/dataverse-client-javascript'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../domain/models/FilePreview'
import { JSFileMetadataMapper } from './JSFileMetadataMapper'
import { JSFileAccessMapper } from './JSFileAccessMapper'
import { JSFileIngestMapper } from './JSFileIngestMapper'
import { File } from '../../domain/models/File'
import { FileTabularData } from '../../domain/models/FileMetadata'
import { FilePermissions } from '../../domain/models/FilePermissions'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { JSDatasetVersionMapper } from '../../../dataset/infrastructure/mappers/JSDatasetVersionMapper'
import { JSDatasetMapper } from '../../../dataset/infrastructure/mappers/JSDatasetMapper'
import { JSUpwardHierarchyNodeMapper } from '../../../shared/hierarchy/infrastructure/mappers/JSUpwardHierarchyNodeMapper'
import { FileVersionSummaryInfo } from '@/files/domain/models/FileVersionSummaryInfo'

export class JSFileMapper {
  static toFilePreview(
    jsFile: JSFile,
    datasetVersion: DatasetVersion,
    downloadsCount: number,
    permissions: FilePermissions,
    thumbnail?: string,
    tabularData?: FileTabularData
  ): FilePreview {
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      datasetPublishingStatus: datasetVersion.publishingStatus,
      datasetVersionNumber: datasetVersion.number,
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted, jsFile.fileAccessRequest || false),
      ingest: JSFileIngestMapper.toFileIngest(),
      metadata: JSFileMetadataMapper.toFileMetadata(jsFile, downloadsCount, thumbnail, tabularData),
      permissions: permissions
    }
  }

  static toFile(
    jsFile: JSFile,
    jsDataset: JSDataset,
    datasetCitation: string,
    citation: string,
    downloadsCount: number,
    permissions: FilePermissions,
    jsFileVersionSummaries: FileVersionSummaryInfo[],
    thumbnail?: string,
    tabularData?: FileTabularData
  ): File {
    const datasetVersion = JSDatasetVersionMapper.toVersion(
      jsDataset.versionId,
      jsDataset.versionInfo,
      JSDatasetMapper.toDatasetTitle(jsDataset.metadataBlocks),
      datasetCitation,
      jsDataset.publicationDate,
      jsDataset.termsOfUse?.termsOfAccess
    )
    return {
      id: this.toFileId(jsFile.id),
      datasetPersistentId: jsDataset.persistentId,
      name: this.toFileName(jsFile.name),
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted, jsFile.fileAccessRequest || false),
      datasetVersion: datasetVersion,
      citation: citation,
      metadata: JSFileMetadataMapper.toFileMetadata(jsFile, downloadsCount, thumbnail, tabularData),
      ingest: JSFileIngestMapper.toFileIngest(),
      permissions: permissions,
      hierarchy: JSFileMapper.toHierarchy(jsFile.name, jsFile.id, jsFile.isPartOf),
      fileVersionSummaries: jsFileVersionSummaries
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
  }

  static toFileName(jsFileName: string): string {
    return jsFileName
  }

  static toHierarchy(
    name: string,
    id: number,
    jsUpwardHierarchyNode: JSUpwardHierarchyNode | undefined
  ): UpwardHierarchyNode {
    return new UpwardHierarchyNode(
      name,
      DvObjectType.FILE,
      id.toString(),
      undefined,
      undefined,
      undefined,
      JSUpwardHierarchyNodeMapper.toUpwardHierarchyNode(jsUpwardHierarchyNode)
    )
  }
}

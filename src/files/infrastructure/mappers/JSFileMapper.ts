import { File as JSFile, Dataset as JSDataset } from '@iqss/dataverse-client-javascript'
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
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
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
    thumbnail?: string,
    tabularData?: FileTabularData
  ): File {
    const datasetVersion = JSDatasetVersionMapper.toVersion(
      jsDataset.versionId,
      jsDataset.versionInfo,
      JSDatasetMapper.toDatasetTitle(jsDataset.metadataBlocks),
      datasetCitation
    )
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
      datasetVersion: datasetVersion,
      citation: citation,
      metadata: JSFileMetadataMapper.toFileMetadata(jsFile, downloadsCount, thumbnail, tabularData),
      ingest: JSFileIngestMapper.toFileIngest(),
      permissions: permissions,
      hierarchy: JSFileMapper.toHierarchyNode(jsFile.name, jsFile.id, datasetVersion) // TODO: get hierarchy from js-dataverse https://github.com/IQSS/dataverse-client-javascript/issues/122
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
  }

  static toFileName(jsFileName: string): string {
    return jsFileName
  }

  static toHierarchyNode(
    name: string,
    id: number,
    datasetVersion: DatasetVersion
  ): UpwardHierarchyNode {
    const rootNode = new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root')
    const datasetNode = new UpwardHierarchyNode(
      datasetVersion.title,
      DvObjectType.DATASET,
      datasetVersion.number.toString(),
      undefined,
      undefined,
      rootNode
    )
    return new UpwardHierarchyNode(
      name,
      DvObjectType.FILE,
      id.toString(),
      undefined,
      undefined,
      datasetNode
    )
  }
}

import { File as JSFile } from '@iqss/dataverse-client-javascript'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../domain/models/FilePreview'
import { JSFileMetadataMapper } from './JSFileMetadataMapper'
import { JSFileAccessMapper } from './JSFileAccessMapper'
import { JSFileIngestMapper } from './JSFileIngestMapper'
import { File } from '../../domain/models/File'
import { FileUserPermissions } from '../../domain/models/FileUserPermissions'
import { FileTabularData } from '../../domain/models/FileMetadata'

export class JSFileMapper {
  static toFilePreview(
    jsFile: JSFile,
    datasetVersion: DatasetVersion,
    downloadsCount: number,
    thumbnail?: string,
    tabularData?: FileTabularData
  ): FilePreview {
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      datasetPublishingStatus: datasetVersion.publishingStatus,
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
      ingest: JSFileIngestMapper.toFileIngest(),
      metadata: JSFileMetadataMapper.toFileMetadata(jsFile, downloadsCount, thumbnail, tabularData)
    }
  }

  static toFile(
    jsFile: JSFile,
    datasetVersion: DatasetVersion,
    citation: string,
    downloadsCount: number,
    userPermissions: FileUserPermissions,
    thumbnail?: string,
    tabularData?: FileTabularData
  ): File {
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
      datasetVersion: datasetVersion,
      citation: citation,
      permissions: userPermissions,
      metadata: JSFileMetadataMapper.toFileMetadata(jsFile, downloadsCount, thumbnail, tabularData),
      ingest: JSFileIngestMapper.toFileIngest()
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
  }

  static toFileName(jsFileName: string): string {
    return jsFileName
  }
}

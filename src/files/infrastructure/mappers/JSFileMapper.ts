import {
  File as JSFile,
  FileDataTable as JSFileTabularData
} from '@iqss/dataverse-client-javascript'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../domain/models/FilePreview'
import { JSFileMetadataMapper } from './JSFileMetadataMapper'
import { JSFileVersionMapper } from './JSFileVersionMapper'
import { JSFileAccessMapper } from './JSFileAccessMapper'
import { JSFileIngestMapper } from './JSFileIngestMapper'
import { FilePermissions } from '../../domain/models/FilePermissions'

export class JSFileMapper {
  static toFile(
    jsFile: JSFile,
    datasetVersion: DatasetVersion,
    downloadsCount: number,
    permissions: FilePermissions,
    thumbnail?: string,
    jsTabularData?: JSFileTabularData[]
  ): FilePreview {
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      version: JSFileVersionMapper.toFileVersion(
        jsFile.version,
        datasetVersion,
        jsFile.publicationDate
      ),
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
      ingest: JSFileIngestMapper.toFileIngest(),
      metadata: JSFileMetadataMapper.toFileMetadata(
        jsFile,
        downloadsCount,
        thumbnail,
        jsTabularData
      ),
      permissions: permissions
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
  }

  static toFileName(jsFileName: string): string {
    return jsFileName
  }
}

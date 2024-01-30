import {
  File as JSFile,
  FileDataTable as JSFileTabularData
} from '@iqss/dataverse-client-javascript'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePreview } from '../../domain/models/FilePreview'
import { JSFileMetadataMapper } from './JSFileMetadataMapper'
import { JSFileAccessMapper } from './JSFileAccessMapper'
import { JSFileIngestMapper } from './JSFileIngestMapper'

export class JSFileMapper {
  static toFilePreview(
    jsFile: JSFile,
    datasetVersion: DatasetVersion,
    downloadsCount: number,
    thumbnail?: string,
    jsTabularData?: JSFileTabularData[]
  ): FilePreview {
    return {
      id: this.toFileId(jsFile.id),
      name: this.toFileName(jsFile.name),
      datasetPublishingStatus: datasetVersion.publishingStatus,
      access: JSFileAccessMapper.toFileAccess(jsFile.restricted),
      ingest: JSFileIngestMapper.toFileIngest(),
      metadata: JSFileMetadataMapper.toFileMetadata(
        jsFile,
        downloadsCount,
        thumbnail,
        jsTabularData
      )
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
  }

  static toFileName(jsFileName: string): string {
    return jsFileName
  }
}

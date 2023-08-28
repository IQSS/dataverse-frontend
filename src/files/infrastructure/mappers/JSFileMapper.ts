import {
  File,
  FileAccess,
  FileDate,
  FileDateType,
  FilePublishingStatus,
  FileSize,
  FileSizeUnit,
  FileType,
  FileVersion
} from '../../domain/models/File'
import { File as JSFile, FileEmbargo as JSFileEmbargo } from '@iqss/dataverse-client-javascript'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'

export class JSFileMapper {
  static toFile(jsFile: JSFile, datasetVersion: DatasetVersion): File {
    console.log(jsFile)
    return new File(
      jsFile.id,
      this.toFileVersion(jsFile.version, datasetVersion, jsFile.publicationDate),
      jsFile.name,
      this.toFileAccess(jsFile.restricted),
      this.toFileType(jsFile.contentType),
      this.toFileSize(jsFile.sizeBytes),
      this.toFileDate(jsFile.creationDate, jsFile.publicationDate, jsFile.embargo),
      0,
      []
    )
  }

  static toFileVersion(
    jsVersion: number,
    datasetVersion: DatasetVersion,
    jsPublicationDate?: Date
  ): FileVersion {
    const fileVersion = { number: jsVersion, publishingStatus: FilePublishingStatus.DRAFT }

    if (datasetVersion.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
      fileVersion.publishingStatus = FilePublishingStatus.DEACCESSIONED
    }

    if (jsPublicationDate) {
      fileVersion.publishingStatus = FilePublishingStatus.RELEASED
    }

    return fileVersion
  }

  static toFileAccess(jsFileRestricted: boolean): FileAccess {
    return {
      restricted: jsFileRestricted,
      // TODO - Implement the rest of the properties when they are added to js-dataverse
      latestVersionRestricted: false,
      canBeRequested: false,
      requested: false
    }
  }

  static toFileType(jsFileContentType: string): FileType {
    return new FileType(jsFileContentType)
  }

  static toFileSize(jsFileSize: number): FileSize {
    return new FileSize(jsFileSize, FileSizeUnit.BYTES)
  }

  static toFileDate(
    jsFileCreationDate?: Date,
    jsFilePublicationDate?: Date,
    jsFileEmbargo?: JSFileEmbargo
  ): FileDate {
    if (jsFilePublicationDate) {
      if (jsFileEmbargo) {
        return { type: FileDateType.METADATA_RELEASED, date: jsFilePublicationDate }
      }
      return { type: FileDateType.PUBLISHED, date: jsFilePublicationDate }
    }
    if (jsFileCreationDate) {
      return { type: FileDateType.DEPOSITED, date: jsFileCreationDate }
    }
    throw new Error('File date not found')
  }
}

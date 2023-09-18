import {
  File,
  FileAccess,
  FileChecksum,
  FileDate,
  FileDateType,
  FileEmbargo,
  FileLabel,
  FileLabelType,
  FilePublishingStatus,
  FileSize,
  FileSizeUnit,
  FileType,
  FileVersion
} from '../../domain/models/File'
import {
  File as JSFile,
  FileEmbargo as JSFileEmbargo,
  FileChecksum as JSFileChecksum
} from '@iqss/dataverse-client-javascript'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileUserPermissions } from '../../domain/models/FileUserPermissions'

export class JSFileMapper {
  static toFile(jsFile: JSFile, datasetVersion: DatasetVersion): File {
    return new File(
      this.toFileId(jsFile.id),
      this.toFileVersion(jsFile.version, datasetVersion, jsFile.publicationDate),
      this.toFileName(jsFile.name),
      this.toFileAccess(jsFile.restricted),
      this.toFileType(jsFile.contentType),
      this.toFileSize(jsFile.sizeBytes),
      this.toFileDate(jsFile.creationDate, jsFile.publicationDate, jsFile.embargo),
      this.toFileDownloads(),
      this.toFileLabels(jsFile.categories, jsFile.tabularTags),
      this.toFileChecksum(jsFile.checksum),
      this.toFileThumbnail(),
      this.toFileDirectory(jsFile.directoryLabel),
      this.toFileEmbargo(jsFile.embargo),
      this.toFileTabularData(),
      this.toFileDescription(jsFile.description)
    )
  }

  static toFileUserPermissions(
    jsFileId: number,
    jsFileUserPermissions: {
      canDownloadFile: boolean
      canEditOwnerDataset: boolean
    }
  ): FileUserPermissions {
    return {
      fileId: jsFileId,
      canDownloadFile: jsFileUserPermissions.canDownloadFile,
      canEditDataset: jsFileUserPermissions.canEditOwnerDataset
    }
  }

  static toFileId(jsFileId: number): number {
    return jsFileId
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

  static toFileName(jsFileName: string): string {
    return jsFileName
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

  static toFileDownloads(): number {
    return 0 // This is always 0 because the downloads come from a different endpoint
  }

  static toFileLabels(jsFileCategories?: string[], jsFileTabularTags?: string[]): FileLabel[] {
    const fileLabels: FileLabel[] = []
    if (jsFileCategories) {
      jsFileCategories.forEach((category) => {
        fileLabels.push({ value: category, type: FileLabelType.CATEGORY })
      })
    }
    if (jsFileTabularTags) {
      jsFileTabularTags.forEach((tabularTag) => {
        fileLabels.push({ value: tabularTag, type: FileLabelType.TAG })
      })
    }

    return fileLabels
  }

  static toFileChecksum(jsFileChecksum?: JSFileChecksum): FileChecksum | undefined {
    if (jsFileChecksum) {
      return { algorithm: jsFileChecksum.type, value: jsFileChecksum.value }
    }
    return undefined
  }

  static toFileThumbnail(): undefined {
    return undefined // This is always undefined because the thumbnails come from a different endpoint
  }

  static toFileDirectory(jsFileDirectory: string | undefined): string | undefined {
    return jsFileDirectory
  }

  static toFileEmbargo(jsFileEmbargo?: JSFileEmbargo): FileEmbargo | undefined {
    if (jsFileEmbargo) {
      return new FileEmbargo(jsFileEmbargo.dateAvailable)
    }
    return undefined
  }

  static toFileTabularData(): undefined {
    return undefined // This is always undefined because the tabular data comes from a different endpoint
  }

  static toFileDescription(jsFileDescription?: string): string | undefined {
    return jsFileDescription
  }
}

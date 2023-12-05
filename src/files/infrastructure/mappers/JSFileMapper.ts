import {
  File,
  FileAccess,
  FileChecksum,
  FileDate,
  FileDateType,
  FileEmbargo,
  FileIngestStatus,
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
  FileChecksum as JSFileChecksum,
  FileCounts as JSFilesCountInfo,
  FileContentTypeCount as JSFileContentTypeCount,
  FileCategoryNameCount as JSFileCategoryNameCount,
  FileAccessStatusCount as JSFileAccessStatusCount,
  FileAccessStatus as JSFileAccessStatus
} from '@iqss/dataverse-client-javascript'
import { DatasetPublishingStatus, DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileUserPermissions } from '../../domain/models/FileUserPermissions'
import {
  FileAccessCount,
  FilesCountInfo,
  FileTagCount,
  FileTypeCount
} from '../../domain/models/FilesCountInfo'
import { FileAccessOption, FileTag } from '../../domain/models/FileCriteria'

export class JSFileMapper {
  static toFile(jsFile: JSFile, datasetVersion: DatasetVersion): File {
    return new File(
      this.toFileId(jsFile.id),
      this.toFileVersion(jsFile.version, datasetVersion, jsFile.publicationDate),
      this.toFileName(jsFile.name),
      this.toFileAccess(jsFile.restricted),
      this.toFileType(jsFile.contentType, jsFile.originalFormatLabel),
      this.toFileSize(jsFile.sizeBytes),
      this.toFileDate(jsFile.creationDate, jsFile.publicationDate, jsFile.embargo),
      this.toFileDownloads(),
      this.toFileLabels(jsFile.categories, jsFile.tabularTags),
      false, // TODO - Implement this when it is added to js-dataverse
      { status: FileIngestStatus.NONE }, // TODO - Implement this when it is added to js-dataverse
      undefined, // TODO - revisit this, do I need to have a method here?
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

    if (jsPublicationDate) {
      fileVersion.publishingStatus = FilePublishingStatus.RELEASED
    }

    if (datasetVersion.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
      fileVersion.publishingStatus = FilePublishingStatus.DEACCESSIONED
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

  static toFileType(jsFileContentType: string, jsOriginalFormatLabel?: string): FileType {
    return new FileType(jsFileContentType, jsOriginalFormatLabel)
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

  static toFilesCountInfo(jsFilesCountInfo: JSFilesCountInfo): FilesCountInfo {
    return {
      total: jsFilesCountInfo.total,
      perFileType: jsFilesCountInfo.perContentType.map((jsFileContentTypeCount) =>
        JSFileMapper.toFileTypeCount(jsFileContentTypeCount)
      ),
      perFileTag: jsFilesCountInfo.perCategoryName.map((jsFileCategoryNameCount) =>
        JSFileMapper.toFileTagCount(jsFileCategoryNameCount)
      ),
      perAccess: jsFilesCountInfo.perAccessStatus.map((jsFileAccessStatusCount) =>
        JSFileMapper.toFileAccessCount(jsFileAccessStatusCount)
      )
    }
  }

  static toFileTypeCount(jsFileContentTypeCount: JSFileContentTypeCount): FileTypeCount {
    return {
      type: new FileType(jsFileContentTypeCount.contentType),
      count: jsFileContentTypeCount.count
    }
  }

  static toFileTagCount(jsFileCategoryNameCount: JSFileCategoryNameCount): FileTagCount {
    return {
      tag: new FileTag(jsFileCategoryNameCount.categoryName),
      count: jsFileCategoryNameCount.count
    }
  }

  static toFileAccessCount(jsFileAccessStatusCount: JSFileAccessStatusCount): FileAccessCount {
    return {
      access: JSFileMapper.toFileAccessOption(jsFileAccessStatusCount.accessStatus),
      count: jsFileAccessStatusCount.count
    }
  }

  static toFileAccessOption(jsFileAccessStatus: JSFileAccessStatus): FileAccessOption {
    switch (jsFileAccessStatus) {
      case JSFileAccessStatus.RESTRICTED:
        return FileAccessOption.RESTRICTED
      case JSFileAccessStatus.PUBLIC:
        return FileAccessOption.PUBLIC
      case JSFileAccessStatus.EMBARGOED:
        return FileAccessOption.EMBARGOED
      case JSFileAccessStatus.EMBARGOED_RESTRICTED:
        return FileAccessOption.EMBARGOED_RESTRICTED
    }
  }
}

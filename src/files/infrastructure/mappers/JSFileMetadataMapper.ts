import {
  FileChecksum,
  FileDate,
  FileDateType,
  FileDownloadUrls,
  FileEmbargo,
  FileLabel,
  FileLabelType,
  FileMetadata,
  FileSize,
  FileSizeUnit,
  FileTabularData,
  FileType
} from '../../domain/models/FileMetadata'
import {
  File as JSFile,
  FileEmbargo as JSFileEmbargo,
  FileChecksum as JSFileChecksum,
  FileDataTable as JSFileTabularData
} from '@iqss/dataverse-client-javascript'

export class JSFileMetadataMapper {
  static toFileMetadata(
    jsFile: JSFile,
    downloadsCount: number,
    thumbnail?: string,
    tabularData?: FileTabularData
  ): FileMetadata {
    return new FileMetadata(
      this.toFileType(jsFile.contentType, jsFile.originalFormatLabel),
      this.toFileSize(jsFile.sizeBytes),
      this.toFileDate(jsFile.creationDate, jsFile.publicationDate, jsFile.embargo),
      this.toFileDownloads(downloadsCount),
      this.toFileLabels(jsFile.categories, jsFile.tabularTags),
      this.toFileIsDeleted(jsFile.deleted),
      this.toFileOriginalFileDownloadUrl(jsFile.id),
      jsFile.creationDate,
      jsFile.publicationDate,
      this.toFileThumbnail(thumbnail),
      this.toFileDirectory(jsFile.directoryLabel),
      this.toFileEmbargo(jsFile.embargo),
      tabularData,
      this.toFileDescription(jsFile.description),
      this.toFileChecksum(jsFile.checksum),
      jsFile.persistentId,
      jsFile.storageIdentifier
    )
  }

  static toFileType(jsFileContentType: string, jsOriginalFormatLabel?: string): FileType {
    return new FileType(jsFileContentType, jsOriginalFormatLabel)
  }

  static toFileSize(jsFileSize: number): FileSize {
    return new FileSize(jsFileSize, FileSizeUnit.BYTES)
  }

  static toFileDate(
    jsFileCreationDate?: string,
    jsFilePublicationDate?: string,
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

  static toFileDownloads(downloadsCount: number): number {
    return downloadsCount
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

  static toFileOriginalFileDownloadUrl(id: number): FileDownloadUrls {
    return {
      original: `/api/access/datafile/${id}?format=original`,
      tabular: `/api/access/datafile/${id}`,
      rData: `/api/access/datafile/${id}?format=RData`
    }
  }

  static toFileThumbnail(thumbnail?: string): string | undefined {
    return thumbnail
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

  static toFileTabularData(jsTabularData: JSFileTabularData[]): FileTabularData {
    return {
      variables: jsTabularData[0].varQuantity ?? 0,
      observations: jsTabularData[0].caseQuantity ?? 0,
      unf: jsTabularData[0].UNF
    }
  }

  static toFileDescription(jsFileDescription?: string): string | undefined {
    return jsFileDescription
  }

  static toFileIsDeleted(jsFileIsDeleted: boolean | undefined): boolean {
    return jsFileIsDeleted ?? false
  }
}

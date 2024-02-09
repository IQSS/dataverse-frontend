import {
  FileAccessCount,
  FilesCountInfo,
  FileTagCount,
  FileTypeCount
} from '../../domain/models/FilesCountInfo'
import {
  FileAccessStatusCount as JSFileAccessStatusCount,
  FileCategoryNameCount as JSFileCategoryNameCount,
  FileContentTypeCount as JSFileContentTypeCount,
  FileCounts as JSFilesCountInfo
} from '@iqss/dataverse-client-javascript'
import { FileType } from '../../domain/models/FileMetadata'
import { FileAccessOption, FileTag } from '../../domain/models/FileCriteria'
import { FileAccessStatus as JSFileAccessStatus } from '@iqss/dataverse-client-javascript/dist/files/domain/models/FileCriteria'

export class JSFilesCountInfoMapper {
  static toFilesCountInfo(jsFilesCountInfo: JSFilesCountInfo): FilesCountInfo {
    return {
      total: jsFilesCountInfo.total,
      perFileType: jsFilesCountInfo.perContentType.map((jsFileContentTypeCount) =>
        this.toFileTypeCount(jsFileContentTypeCount)
      ),
      perFileTag: jsFilesCountInfo.perCategoryName.map((jsFileCategoryNameCount) =>
        this.toFileTagCount(jsFileCategoryNameCount)
      ),
      perAccess: jsFilesCountInfo.perAccessStatus.map((jsFileAccessStatusCount) =>
        this.toFileAccessCount(jsFileAccessStatusCount)
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
      access: this.toFileAccessOption(jsFileAccessStatusCount.accessStatus),
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

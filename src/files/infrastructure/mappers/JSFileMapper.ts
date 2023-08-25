import {
  File,
  FileDateType,
  FilePublishingStatus,
  FileSize,
  FileSizeUnit,
  FileType
} from '../../domain/models/File'
import { File as JSFile } from '@iqss/dataverse-client-javascript'

export class JSFileMapper {
  static toFile(jsFile: JSFile): File {
    return new File(
      jsFile.id,
      { number: jsFile.version, publishingStatus: FilePublishingStatus.DRAFT },
      jsFile.name,
      {
        restricted: false,
        latestVersionRestricted: false,
        canBeRequested: true,
        requested: true
      },
      new FileType('text/plain'),
      new FileSize(25, FileSizeUnit.BYTES),
      { type: FileDateType.DEPOSITED, date: 'Thu Aug 24 2023' },
      0,
      []
    )
  }
}

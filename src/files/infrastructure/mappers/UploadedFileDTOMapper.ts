import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'

export class UploadedFileDTOMapper {
  static toUploadedFileDTO(
    fileName: string,
    description: string | undefined,
    fileDir: string,
    tags: string[],
    restricted: boolean,
    storageId: string,
    checksumValue: string,
    checksumType: FixityAlgorithm,
    fileType: string,
    forceReplace?: boolean
  ): UploadedFileDTO {
    return {
      fileName: fileName,
      description: description,
      directoryLabel: fileDir,
      categories: tags,
      restrict: restricted,
      storageId: storageId,
      checksumValue: checksumValue,
      checksumType: checksumType,
      mimeType: fileType === '' ? 'application/octet-stream' : fileType, // some browsers (e.g., chromium for .java files) fail to detect the mime type for some files and leave the fileType as an empty string, we use the default value 'application/octet-stream' in that case,
      ...(forceReplace && { forceReplace: true })
    }
  }
}

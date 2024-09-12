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
    fileType: string
  ): UploadedFileDTO {
    return {
      fileName: fileName,
      description: description,
      directoryLabel: fileDir,
      categories: tags,
      restrict: restricted,
      storageId: storageId,
      checksumValue: checksumValue,
      checksumType: 'md5',
      mimeType: fileType
    }
  }
}

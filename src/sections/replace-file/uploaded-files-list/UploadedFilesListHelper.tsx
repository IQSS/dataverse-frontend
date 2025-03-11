import { FileUploadState } from '@/sections/shared/file-uploader/fileUploaderReducer'
import { UploadedFileInfo } from './UploadedFileInfo'

export class UploadedFilesListHelper {
  /**
   * To map the uploaded files retrieved from the file uploader to the uploaded file info interface model.
   * FileUploadState is the model the File Uploader uses to store the uploaded files.
   * UploadedFileInfo is the model used to display the uploaded files in the uploaded files list.
   */
  public static mapUploadedFilesToUploadedFileInfo(files: FileUploadState[]): UploadedFileInfo[] {
    return files.map((file) => ({
      key: file.key,
      storageId: file.storageId as string, // Casted to string because at this point we know it is not undefined as it was already uploaded
      checksumValue: file.checksumValue as string, // Casted to string because at this point we know it is not undefined as it was already uploaded
      checksumAlgorithm: file.checksumAlgorithm,
      fileName: file.fileName,
      fileDir: file.fileDir ?? '',
      fileType: file.fileType,
      fileSize: file.fileSize,
      fileSizeString: file.fileSizeString,
      fileLastModified: file.fileLastModified
    }))
  }

  public static isUniqueCombinationOfFilepathAndFilename({
    fileName,
    filePath,
    fileKey,
    allFiles
  }: {
    fileName: string
    filePath: string
    fileKey: string
    allFiles: UploadedFileInfo[]
  }): boolean {
    return !allFiles
      .filter((f) => f.key !== fileKey)
      .some((file) => `${file.fileDir}/${file.fileName}` === `${filePath}/${fileName}`)
  }

  public static isValidFilePath(filePath: string): boolean {
    const FILE_PATH_REGEX = /^[\w.\-\\/ ]*$/

    return FILE_PATH_REGEX.test(filePath)
  }

  public static isValidFileName(fileName: string): boolean {
    const FILE_NAME_REGEX = /^[^:<>;#/"*|?\\]+$/

    return FILE_NAME_REGEX.test(fileName)
  }
}

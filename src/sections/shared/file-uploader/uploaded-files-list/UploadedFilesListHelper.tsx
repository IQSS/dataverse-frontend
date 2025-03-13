import { UploadedFile } from '../context/fileUploaderReducer'

export class UploadedFilesListHelper {
  public static isUniqueCombinationOfFilepathAndFilename({
    fileName,
    filePath,
    fileKey,
    allFiles
  }: {
    fileName: string
    filePath: string
    fileKey: string
    allFiles: UploadedFile[]
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

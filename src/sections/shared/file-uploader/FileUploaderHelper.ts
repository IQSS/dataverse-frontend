export class FileUploaderHelper {
  public static getFileKey = (file: File): string => file.webkitRelativePath || file.name

  public static isDS_StoreFile = (file: File): boolean => file.name === '.DS_Store'

  public static originalFileAndReplacementFileHaveDifferentTypes = (
    originalFileType: string,
    replacementFileType: string
  ): boolean => originalFileType !== replacementFileType
}

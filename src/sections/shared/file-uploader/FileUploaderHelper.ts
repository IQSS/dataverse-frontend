export class FileUploaderHelper {
  public static getFileKey = (file: File): string => file.webkitRelativePath || file.name

  public static isDS_StoreFile = (file: File): boolean => file.name === '.DS_Store'

  public static sanitizeFileName(fileName: string) {
    // Replace all invalid characters with underscore
    return fileName.replace(/[:<>;#/"*|?\\]/g, '_')
  }

  public static sanitizeFilePath(filePath: string) {
    // Replace all invalid characters with underscore
    return filePath.replace(/[^\w.\-\\/ ]/g, '_')
  }
}

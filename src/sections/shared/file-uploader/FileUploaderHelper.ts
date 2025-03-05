// TODO:ME - This might not be needed, this method could live in userFileUploadReducer function

export class FileUploaderHelper {
  public static getFileKey = (file: File): string => file.webkitRelativePath || file.name
}

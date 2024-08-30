import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileSize, FileSizeUnit } from './FileMetadata'
import { UploadedFileDTOMapper } from '../../infrastructure/mappers/UploadedFileDTOMapper'

export interface FileUploadState {
  progress: number
  storageId?: string
  progressHidden: boolean
  fileSizeString: string
  fileSize: number
  fileLastModified: number
  failed: boolean
  done: boolean
  removed: boolean
  fileName: string
  fileDir: string
  fileType: string
  key: string
  description?: string
  tags: string[]
  restricted: boolean
  checksumValue?: string
}

export interface FileUploaderState {
  state: Map<string, FileUploadState>
  uploaded: FileUploadState[]
}

export class FileUploadTools {
  static createNewState(files: File[]): FileUploaderState {
    const newState = new Map<string, FileUploadState>()
    files.forEach((file) => {
      const key = this.key(file)
      const newValue: FileUploadState = {
        progress: 0,
        storageId: undefined,
        progressHidden: true,
        fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
        fileSize: file.size,
        fileLastModified: file.lastModified,
        failed: false,
        done: false,
        removed: false,
        fileName: file.name,
        fileDir: this.toDir(file.webkitRelativePath),
        fileType: file.type,
        key: key,
        tags: [],
        restricted: false
      }
      newState.set(key, newValue)
    })
    return { state: newState, uploaded: this.toUploaded(newState) }
  }

  static key(file: File): string {
    return file.webkitRelativePath ? file.webkitRelativePath : file.name
  }

  static get(file: File, state: FileUploaderState): FileUploadState {
    const oldValue = state.state.get(this.key(file))
    if (oldValue) {
      return oldValue
    }
    return {
      progress: 0,
      progressHidden: true,
      fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
      fileSize: file.size,
      fileLastModified: file.lastModified,
      failed: false,
      done: false,
      removed: false,
      fileName: file.name,
      fileDir: this.toDir(file.webkitRelativePath),
      fileType: file.type,
      key: this.key(file),
      tags: [],
      restricted: false
    }
  }

  static progress(file: File, now: number, oldState: FileUploaderState): FileUploaderState {
    const fileUploadState = oldState.state.get(this.key(file))
    if (fileUploadState) {
      fileUploadState.progress = now
    }
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static storageId(file: File, id: string, oldState: FileUploaderState): FileUploaderState {
    const fileUploadState = oldState.state.get(this.key(file))
    if (fileUploadState) {
      fileUploadState.storageId = id
    }
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static checksum(
    file: File,
    checksumValue: string,
    oldState: FileUploaderState
  ): FileUploaderState {
    const fileUploadState = oldState.state.get(this.key(file))
    if (fileUploadState) {
      fileUploadState.checksumValue = checksumValue
    }
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static failed(file: File, oldState: FileUploaderState): FileUploaderState {
    const fileUploadState = oldState.state.get(this.key(file))
    if (fileUploadState) {
      fileUploadState.failed = true
    }
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static done(file: File, oldState: FileUploaderState): FileUploaderState {
    const fileUploadState = oldState.state.get(this.key(file))
    if (fileUploadState) {
      fileUploadState.done = true
    }
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static removed(file: File, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.removed = true
    return newState
  }

  static showProgressBar(file: File, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.progressHidden = false
    return newState
  }

  static delete(file: File, oldState: FileUploaderState): FileUploaderState {
    oldState.state.delete(this.key(file))
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
  }

  static mapToUploadedFilesDTOs(state: FileUploadState[]): UploadedFileDTO[] {
    return state.map((uploadedFile) =>
      UploadedFileDTOMapper.toUploadedFileDTO(
        uploadedFile.fileName,
        uploadedFile.description,
        uploadedFile.fileDir,
        uploadedFile.tags,
        uploadedFile.restricted,
        uploadedFile.storageId as string,
        uploadedFile.checksumValue as string,
        uploadedFile.fileType === '' ? 'application/octet-stream' : uploadedFile.fileType // some browsers (e.g., chromium for .java files) fail to detect the mime type for some files and leave the fileType as an empty string, we use the default value 'application/octet-stream' in that case
      )
    )
  }

  private static toNewState(
    file: File,
    oldState: FileUploaderState
  ): [FileUploaderState, FileUploadState] {
    const newValue = this.get(file, oldState)
    oldState.state.set(this.key(file), newValue)
    return [{ state: oldState.state, uploaded: this.toUploaded(oldState.state) }, newValue]
  }

  private static toUploaded(state: Map<string, FileUploadState>): FileUploadState[] {
    return Array.from(state.values())
      .filter((x) => !x.removed && x.done)
      .sort((a, b) => (a.fileDir + a.fileName).localeCompare(b.fileDir + b.fileName))
  }

  private static toDir(relativePath: string): string {
    const parts = relativePath.split('/')
    if (parts.length > 0) {
      return parts.slice(0, parts.length - 1).join('/')
    }
    return relativePath
  }
}

import { FileSize, FileSizeUnit } from './FileMetadata'

export interface FileUploadState {
  progress: number
  storageId?: string
  progressHidden: boolean
  fileSizeString: string
  failed: boolean
  done: boolean
  removed: boolean
  fileName: string
  fileDir: string
  fileType: string
  key: string
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
        failed: false,
        done: false,
        removed: false,
        fileName: file.name,
        fileDir: file.webkitRelativePath,
        fileType: file.type,
        key: this.key(file)
      }
      newState.set(key, newValue)
    })
    return { state: newState, uploaded: this.toUploaded(newState) }
  }

  static key(file: File): string {
    return file.webkitRelativePath + file.name
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
      failed: false,
      done: false,
      removed: false,
      fileName: file.name,
      fileDir: file.webkitRelativePath,
      fileType: file.type,
      key: this.key(file)
    }
  }

  static progress(file: File, now: number, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.progress = now
    return newState
  }

  static storageId(file: File, id: string, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.storageId = id
    return newState
  }

  static failed(file: File, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.failed = true
    return newState
  }

  static done(file: File, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.done = true
    return newState
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

  static fileName(file: File, name: string, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.fileName = name
    return newState
  }

  static fileDir(file: File, dir: string, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.fileDir = dir
    return newState
  }

  static delete(fileUploadState: FileUploadState, oldState: FileUploaderState): FileUploaderState {
    fileUploadState.removed = true
    return { state: oldState.state, uploaded: this.toUploaded(oldState.state) }
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
      .filter((x) => x.done)
      .sort((a, b) => (a.fileDir + a.fileName).localeCompare(b.fileDir + b.fileName))
  }
}

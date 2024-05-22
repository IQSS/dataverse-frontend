import { FileSize, FileSizeUnit } from './FileMetadata'

export interface FileUploadState {
  progress: number
  fileSizeString: string
  failed: boolean
  done: boolean
  removed: boolean
}

export interface FileUploaderState {
  state: Map<string, FileUploadState>
}

export class FileUploadTools {
  static createNewState(files: File[]): FileUploaderState {
    const newState = new Map<string, FileUploadState>()
    files.forEach((file) => {
      const key = this.key(file)
      const newValue: FileUploadState = {
        progress: 0,
        fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
        failed: false,
        done: false,
        removed: false
      }
      newState.set(key, newValue)
    })
    return { state: newState }
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
      fileSizeString: new FileSize(file.size, FileSizeUnit.BYTES).toString(),
      failed: false,
      done: false,
      removed: false
    }
  }

  static progress(file: File, now: number, oldState: FileUploaderState): FileUploaderState {
    const [newState, newValue] = this.toNewState(file, oldState)
    newValue.progress = now
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

  private static toNewState(
    file: File,
    oldState: FileUploaderState
  ): [FileUploaderState, FileUploadState] {
    const newValue = this.get(file, oldState)
    oldState.state.set(this.key(file), newValue)
    return [{ state: oldState.state }, newValue]
  }
}

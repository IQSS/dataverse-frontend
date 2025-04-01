import {
  fileUploaderReducer,
  FileUploaderState,
  FileUploadState,
  FileUploadStatus
} from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { OperationType } from '@/sections/shared/file-uploader/FileUploader'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import {
  FileLabelMother,
  FileMetadataMother
} from '@tests/component/files/domain/models/FileMetadataMother'

const initialStateAddFiles: FileUploaderState = {
  config: {
    checksumAlgorithm: FixityAlgorithm.SHA256,
    operationType: OperationType.ADD_FILES_TO_DATASET,
    storageType: 'S3'
  },
  files: {},
  uploadingToCancelMap: new Map(),
  isSaving: false,
  replaceOperationInfo: { success: false, newFileIdentifier: null },
  addFilesToDatasetOperationInfo: { success: false }
}

const originalFile = FileMother.create({
  metadata: FileMetadataMother.createWithDescription({
    labels: FileLabelMother.createMany(2),
    directory: 'path/to'
  })
})

const initialStateReplaceFile: FileUploaderState = {
  config: {
    checksumAlgorithm: FixityAlgorithm.SHA256,
    operationType: OperationType.REPLACE_FILE,
    storageType: 'S3',
    originalFile: originalFile
  },
  files: {},
  uploadingToCancelMap: new Map(),
  isSaving: false,
  replaceOperationInfo: { success: false, newFileIdentifier: null },
  addFilesToDatasetOperationInfo: { success: false }
}

const testUploadingFile: FileUploadState = {
  key: 'file.txt',
  progress: 0,
  status: FileUploadStatus.UPLOADING,
  fileName: 'file.txt',
  fileDir: '',
  fileType: 'text/plain',
  fileSizeString: '0 B',
  fileSize: 0,
  fileLastModified: 0,
  description: '',
  tags: [],
  restricted: false,
  checksumAlgorithm: FixityAlgorithm.SHA256
}

describe('fileUploaderReducer', () => {
  it('should return state if bad action type is passed', () => {
    const state = fileUploaderReducer(initialStateAddFiles, {
      // @ts-expect-error - Testing bad action type
      type: 'BAD_ACTION'
    })

    expect(state).deep.equal(initialStateAddFiles)
  })

  describe('ADD_FILE', () => {
    it('should add a file', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'ADD_FILE',
        file: new File([], 'file.txt')
      })

      expect(state.files).to.have.property('file.txt')
    })

    it('should add a file and inherit original file description, labels and directory', () => {
      const state = fileUploaderReducer(initialStateReplaceFile, {
        type: 'ADD_FILE',
        file: new File([], 'file.txt')
      })

      expect(state.files['file.txt']).to.have.property(
        'description',
        originalFile.metadata.description
      )
      expect(state.files['file.txt']).to.have.property('tags').to.have.length(2)
      expect(state.files['file.txt']).to.have.property('fileDir', originalFile.metadata.directory)
    })

    it('adds a file with webkitRelativePath', () => {
      const fileWithPath = new File([], 'file.txt')
      Object.defineProperty(fileWithPath, 'webkitRelativePath', {
        value: 'path/to/file.txt',
        writable: true
      })

      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'ADD_FILE',
        file: fileWithPath
      })

      expect(state.files['path/to/file.txt']).to.have.property('fileName', 'file.txt')
    })

    it('should not add a file if it already exists', () => {
      const state = fileUploaderReducer(
        { ...initialStateAddFiles, files: { 'file.txt': testUploadingFile } },
        {
          type: 'ADD_FILE',
          file: new File([], 'file.txt')
        }
      )

      expect(Object.keys(state.files)).to.have.length(1)
    })
  })

  describe('UPDATE_FILE', () => {
    it('should update a file', () => {
      const state = fileUploaderReducer(
        { ...initialStateAddFiles, files: { 'file.txt': testUploadingFile } },
        {
          type: 'UPDATE_FILE',
          key: 'file.txt',
          updates: { status: FileUploadStatus.DONE }
        }
      )

      expect(state.files['file.txt'].status).to.equal(FileUploadStatus.DONE)
    })

    it('should not update a file if it does not exist', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'UPDATE_FILE',
        key: 'file.txt',
        updates: { status: FileUploadStatus.DONE }
      })

      expect(state).deep.equal(initialStateAddFiles)
    })
  })

  describe('REMOVE_FILE', () => {
    it('should remove a file', () => {
      const state = fileUploaderReducer(
        { ...initialStateAddFiles, files: { 'file.txt': testUploadingFile } },
        {
          type: 'REMOVE_FILE',
          key: 'file.txt'
        }
      )

      expect(state.files).to.not.have.property('file.txt')
    })

    it('should not remove a file if it does not exist', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'REMOVE_FILE',
        key: 'file.txt'
      })

      expect(state).deep.equal(initialStateAddFiles)
    })
  })

  describe('REMOVE_ALL_FILES', () => {
    it('should remove all files', () => {
      const state = fileUploaderReducer(
        { ...initialStateAddFiles, files: { 'file.txt': testUploadingFile } },
        {
          type: 'REMOVE_ALL_FILES'
        }
      )

      expect(state.files).to.be.empty
    })
  })

  describe('SET_IS_SAVING', () => {
    it('should set isSaving', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'SET_IS_SAVING',
        isSaving: true
      })

      expect(state.isSaving).to.be.true
    })
  })

  describe('ADD_UPLOADING_TO_CANCEL', () => {
    it('should add a cancel function', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'ADD_UPLOADING_TO_CANCEL',
        key: 'file.txt',
        cancel: () => {}
      })

      expect(state.uploadingToCancelMap.size).to.equal(1)
    })
  })

  describe('REMOVE_UPLOADING_TO_CANCEL', () => {
    it('should remove a cancel function', () => {
      const state = fileUploaderReducer(
        { ...initialStateAddFiles, uploadingToCancelMap: new Map([['file.txt', () => {}]]) },
        {
          type: 'REMOVE_UPLOADING_TO_CANCEL',
          key: 'file.txt'
        }
      )

      expect(state.uploadingToCancelMap).to.not.have.property('file.txt')
    })
  })

  describe('SET_REPLACE_OPERATION_INFO', () => {
    it('should set replaceOperationInfo', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'SET_REPLACE_OPERATION_INFO',
        replaceOperationInfo: { success: true, newFileIdentifier: 3 }
      })

      expect(state.replaceOperationInfo).to.deep.equal({
        success: true,
        newFileIdentifier: 3
      })
    })
  })

  describe('SET_ADD_FILES_TO_DATASET_OPERATION_INFO', () => {
    it('should set addFilesToDatasetOperationInfo', () => {
      const state = fileUploaderReducer(initialStateAddFiles, {
        type: 'SET_ADD_FILES_TO_DATASET_OPERATION_INFO',
        addFilesToDatasetOperationInfo: { success: true }
      })

      expect(state.addFilesToDatasetOperationInfo).to.deep.equal({ success: true })
    })
  })
})

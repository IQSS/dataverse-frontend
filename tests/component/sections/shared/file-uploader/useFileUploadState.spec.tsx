import { act, renderHook } from '@testing-library/react'
import {
  useFileUploadState,
  FileUploadStatus,
  formatFileSize
} from '@/sections/shared/file-uploader/useFileUploadState'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'

describe('useFileUploadState', () => {
  const createMockFile = (name: string, size = 1024): File => {
    const content = new Array(size).fill('x').join('')
    return new File([content], name, { type: 'text/plain', lastModified: Date.now() })
  }

  describe('formatFileSize', () => {
    it('should format 0 bytes correctly', () => {
      expect(formatFileSize(0)).to.equal('0 Bytes')
    })

    it('should format bytes correctly', () => {
      expect(formatFileSize(500)).to.equal('500 Bytes')
    })

    it('should format KB correctly', () => {
      expect(formatFileSize(1024)).to.equal('1 KB')
      expect(formatFileSize(2048)).to.equal('2 KB')
    })

    it('should format MB correctly', () => {
      expect(formatFileSize(1024 * 1024)).to.equal('1 MB')
      expect(formatFileSize(1.5 * 1024 * 1024)).to.equal('1.5 MB')
    })

    it('should format GB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024)).to.equal('1 GB')
    })

    it('should format TB correctly', () => {
      expect(formatFileSize(1024 * 1024 * 1024 * 1024)).to.equal('1 TB')
    })
  })

  describe('initial state', () => {
    it('should return empty files initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.files).to.deep.equal({})
    })

    it('should return empty uploadedFiles initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.uploadedFiles).to.deep.equal([])
    })

    it('should return empty uploadingFilesInProgress initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.uploadingFilesInProgress).to.deep.equal([])
    })

    it('should return false for anyFileUploading initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.anyFileUploading).to.equal(false)
    })

    it('should return empty uploadingToCancelMap initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.uploadingToCancelMap.size).to.equal(0)
    })

    it('should return false for isSaving initially', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.isSaving).to.equal(false)
    })
  })

  describe('addFile', () => {
    it('should add a file to the state', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const filesKeys = Object.keys(result.current.files)
      expect(filesKeys).to.have.length(1)

      const addedFile = Object.values(result.current.files)[0]
      expect(addedFile.fileName).to.equal('test.txt')
      expect(addedFile.status).to.equal(FileUploadStatus.UPLOADING)
      expect(addedFile.progress).to.equal(0)
      expect(addedFile.checksumAlgorithm).to.equal(FixityAlgorithm.MD5)
    })

    it('should set anyFileUploading to true after adding a file', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      expect(result.current.anyFileUploading).to.equal(true)
    })

    it('should not add duplicate files with the same key', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const filesKeys = Object.keys(result.current.files)
      expect(filesKeys).to.have.length(1)
    })

    it('should use custom defaults when provided', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5, {
          description: 'Custom description',
          tags: ['tag1', 'tag2'],
          restricted: true,
          fileDir: 'custom/path'
        })
      })

      const addedFile = Object.values(result.current.files)[0]
      expect(addedFile.description).to.equal('Custom description')
      expect(addedFile.tags).to.deep.equal(['tag1', 'tag2'])
      expect(addedFile.restricted).to.equal(true)
      expect(addedFile.fileDir).to.equal('custom/path')
    })
  })

  describe('updateFile', () => {
    it('should update file properties', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, { progress: 50 })
      })

      expect(result.current.files[fileKey].progress).to.equal(50)
    })

    it('should update status to DONE', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, {
          status: FileUploadStatus.DONE,
          storageId: 'storage-123',
          checksumValue: 'abc123'
        })
      })

      expect(result.current.files[fileKey].status).to.equal(FileUploadStatus.DONE)
      expect(result.current.anyFileUploading).to.equal(false)
    })

    it('should not update non-existent file', () => {
      const { result } = renderHook(() => useFileUploadState())

      const initialFiles = { ...result.current.files }

      act(() => {
        result.current.updateFile('non-existent-key', { progress: 50 })
      })

      expect(result.current.files).to.deep.equal(initialFiles)
    })

    it('should add file to uploadedFiles when status is DONE with storageId and checksumValue', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, {
          status: FileUploadStatus.DONE,
          storageId: 'storage-123',
          checksumValue: 'abc123'
        })
      })

      expect(result.current.uploadedFiles).to.have.length(1)
      expect(result.current.uploadedFiles[0].storageId).to.equal('storage-123')
      expect(result.current.uploadedFiles[0].checksumValue).to.equal('abc123')
    })

    it('should add file to uploadedFiles when checksum calculation is disabled', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.NONE)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, {
          status: FileUploadStatus.DONE,
          storageId: 'storage-123',
          checksumValue: ''
        })
      })

      expect(result.current.uploadedFiles).to.have.length(1)
    })
  })

  describe('removeFile', () => {
    it('should remove a file from the state', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.removeFile(fileKey)
      })

      expect(Object.keys(result.current.files)).to.have.length(0)
    })
  })

  describe('removeAllFiles', () => {
    it('should remove all files from the state', () => {
      const { result } = renderHook(() => useFileUploadState())

      act(() => {
        result.current.addFile(createMockFile('test1.txt'), FixityAlgorithm.MD5)
        result.current.addFile(createMockFile('test2.txt'), FixityAlgorithm.MD5)
      })

      expect(Object.keys(result.current.files)).to.have.length(2)

      act(() => {
        result.current.removeAllFiles()
      })

      expect(Object.keys(result.current.files)).to.have.length(0)
    })
  })

  describe('getFileByKey', () => {
    it('should return file by key', () => {
      const { result } = renderHook(() => useFileUploadState())
      const mockFile = createMockFile('test.txt')

      act(() => {
        result.current.addFile(mockFile, FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]
      const file = result.current.getFileByKey(fileKey)

      expect(file?.fileName).to.equal('test.txt')
    })

    it('should return undefined for non-existent key', () => {
      const { result } = renderHook(() => useFileUploadState())

      const file = result.current.getFileByKey('non-existent-key')

      expect(file).to.be.undefined
    })
  })

  describe('uploadingToCancelMap', () => {
    it('should add cancel function to map', () => {
      const { result } = renderHook(() => useFileUploadState())
      const cancelFn = cy.stub()

      act(() => {
        result.current.addUploadingToCancel('file-key', cancelFn)
      })

      expect(result.current.uploadingToCancelMap.size).to.equal(1)
      expect(result.current.uploadingToCancelMap.get('file-key')).to.equal(cancelFn)
    })

    it('should remove cancel function from map', () => {
      const { result } = renderHook(() => useFileUploadState())
      const cancelFn = cy.stub()

      act(() => {
        result.current.addUploadingToCancel('file-key', cancelFn)
      })

      act(() => {
        result.current.removeUploadingToCancel('file-key')
      })

      expect(result.current.uploadingToCancelMap.size).to.equal(0)
    })
  })

  describe('isSaving', () => {
    it('should set isSaving state', () => {
      const { result } = renderHook(() => useFileUploadState())

      expect(result.current.isSaving).to.equal(false)

      act(() => {
        result.current.setIsSaving(true)
      })

      expect(result.current.isSaving).to.equal(true)

      act(() => {
        result.current.setIsSaving(false)
      })

      expect(result.current.isSaving).to.equal(false)
    })
  })

  describe('reset', () => {
    it('should reset all state to initial values', () => {
      const { result } = renderHook(() => useFileUploadState())
      const cancelFn = cy.stub()

      act(() => {
        result.current.addFile(createMockFile('test.txt'), FixityAlgorithm.MD5)
        result.current.addUploadingToCancel('file-key', cancelFn)
        result.current.setIsSaving(true)
      })

      expect(Object.keys(result.current.files)).to.have.length(1)
      expect(result.current.uploadingToCancelMap.size).to.equal(1)
      expect(result.current.isSaving).to.equal(true)

      act(() => {
        result.current.reset()
      })

      expect(Object.keys(result.current.files)).to.have.length(0)
      expect(result.current.uploadingToCancelMap.size).to.equal(0)
      expect(result.current.isSaving).to.equal(false)
    })

    it('should call cancel functions when resetting', () => {
      const { result } = renderHook(() => useFileUploadState())
      const cancelFn = cy.stub()

      act(() => {
        result.current.addUploadingToCancel('file-key', cancelFn)
      })

      act(() => {
        result.current.reset()
      })

      expect(cancelFn).to.have.been.called
    })
  })

  describe('uploadingFilesInProgress', () => {
    it('should include uploading files', () => {
      const { result } = renderHook(() => useFileUploadState())

      act(() => {
        result.current.addFile(createMockFile('test.txt'), FixityAlgorithm.MD5)
      })

      expect(result.current.uploadingFilesInProgress).to.have.length(1)
    })

    it('should include failed files', () => {
      const { result } = renderHook(() => useFileUploadState())

      act(() => {
        result.current.addFile(createMockFile('test.txt'), FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, { status: FileUploadStatus.FAILED })
      })

      expect(result.current.uploadingFilesInProgress).to.have.length(1)
      expect(result.current.uploadingFilesInProgress[0].status).to.equal(FileUploadStatus.FAILED)
    })

    it('should exclude completed files', () => {
      const { result } = renderHook(() => useFileUploadState())

      act(() => {
        result.current.addFile(createMockFile('test.txt'), FixityAlgorithm.MD5)
      })

      const fileKey = Object.keys(result.current.files)[0]

      act(() => {
        result.current.updateFile(fileKey, {
          status: FileUploadStatus.DONE,
          storageId: 'storage-123',
          checksumValue: 'abc123'
        })
      })

      expect(result.current.uploadingFilesInProgress).to.have.length(0)
    })
  })
})

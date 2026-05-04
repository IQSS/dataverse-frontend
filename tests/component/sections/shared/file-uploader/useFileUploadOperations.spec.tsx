import { act, renderHook } from '@testing-library/react'
import {
  useFileUploadOperations,
  FileUploadOperationsConfig,
  CONCURRENT_UPLOADS_LIMIT
} from '@/sections/shared/file-uploader/useFileUploadOperations'
import { FileUploadStatus } from '@/sections/shared/file-uploader/useFileUploadState'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileMockRepository } from '@/stories/file/FileMockRepository'

describe('useFileUploadOperations', () => {
  const createMockFile = (name: string, size = 1024): File => {
    const content = new Array(size).fill('x').join('')
    return new File([content], name, { type: 'text/plain', lastModified: Date.now() })
  }

  const createConfig = (
    overrides: Partial<FileUploadOperationsConfig> = {}
  ): FileUploadOperationsConfig => ({
    fileRepository: new FileMockRepository() as unknown as FileRepository,
    datasetPersistentId: 'doi:10.5072/FK2/TEST',
    checksumAlgorithm: FixityAlgorithm.MD5,
    addFile: cy.stub(),
    updateFile: cy.stub(),
    getFileByKey: cy.stub().returns(undefined),
    addUploadingToCancel: cy.stub(),
    removeUploadingToCancel: cy.stub(),
    ...overrides
  })

  describe('constants', () => {
    it('should have CONCURRENT_UPLOADS_LIMIT defined', () => {
      expect(CONCURRENT_UPLOADS_LIMIT).to.equal(6)
    })
  })

  describe('uploadOneFile', () => {
    it('should skip .DS_Store files', async () => {
      const onFileSkipped = cy.stub()
      const addFile = cy.stub()
      const config = createConfig({ onFileSkipped, addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const dsStoreFile = createMockFile('.DS_Store')

      await act(async () => {
        await result.current.uploadOneFile(dsStoreFile)
      })

      expect(onFileSkipped).to.have.been.calledWith('ds_store', dsStoreFile)
      expect(addFile).to.not.have.been.called
    })

    it('should skip already uploaded files', async () => {
      const onFileSkipped = cy.stub()
      const addFile = cy.stub()
      const getFileByKey = cy.stub().returns({ status: FileUploadStatus.DONE })
      const config = createConfig({ onFileSkipped, addFile, getFileByKey })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.uploadOneFile(mockFile)
      })

      expect(onFileSkipped).to.have.been.calledWith('already_uploaded', mockFile)
      expect(addFile).to.not.have.been.called
    })

    it('should call addFile for new files', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.uploadOneFile(mockFile)
      })

      expect(addFile).to.have.been.calledWith(mockFile)
    })

    it('should call addUploadingToCancel with cancel function', async () => {
      const addUploadingToCancel = cy.stub()
      const config = createConfig({ addUploadingToCancel })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.uploadOneFile(mockFile)
      })

      expect(addUploadingToCancel).to.have.been.called
      const [key, cancelFn] = addUploadingToCancel.firstCall.args as [string, () => void]
      expect(key).to.be.a('string')
      expect(cancelFn).to.be.a('function')
    })

    it('should run validateBeforeUpload if provided', async () => {
      const validateBeforeUpload = cy.stub().resolves(true)
      const addFile = cy.stub()
      const config = createConfig({ validateBeforeUpload, addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.uploadOneFile(mockFile)
      })

      expect(validateBeforeUpload).to.have.been.calledWith(mockFile)
      expect(addFile).to.have.been.called
    })

    it('should not upload if validateBeforeUpload returns false', async () => {
      const validateBeforeUpload = cy.stub().resolves(false)
      const addFile = cy.stub()
      const config = createConfig({ validateBeforeUpload, addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.uploadOneFile(mockFile)
      })

      expect(validateBeforeUpload).to.have.been.calledWith(mockFile)
      expect(addFile).to.not.have.been.called
    })
  })

  describe('semaphore', () => {
    it('should return a semaphore for concurrent upload control', () => {
      const config = createConfig()
      const { result } = renderHook(() => useFileUploadOperations(config))

      const { semaphore } = result.current
      expect(semaphore).to.exist
      expect(typeof semaphore.acquire).to.equal('function')
      expect(typeof semaphore.release).to.equal('function')
    })
  })

  describe('retryUpload', () => {
    it('should reset file status to uploading before retry', async () => {
      const updateFile = cy.stub()
      const config = createConfig({ updateFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.retryUpload(mockFile)
      })

      // First call should be to reset status
      expect(updateFile.firstCall.args[1]).to.deep.include({
        status: FileUploadStatus.UPLOADING,
        progress: 0
      })
    })

    it('should register cancel function for retry', async () => {
      const addUploadingToCancel = cy.stub()
      const config = createConfig({ addUploadingToCancel })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const mockFile = createMockFile('test.txt')

      await act(async () => {
        await result.current.retryUpload(mockFile)
      })

      expect(addUploadingToCancel).to.have.been.called
    })
  })

  describe('handleDroppedItems', () => {
    it('should be a function', () => {
      const config = createConfig()
      const { result } = renderHook(() => useFileUploadOperations(config))

      expect(result.current.handleDroppedItems).to.be.a('function')
    })
  })

  describe('addFromDir', () => {
    it('should be a function', () => {
      const config = createConfig()
      const { result } = renderHook(() => useFileUploadOperations(config))

      expect(result.current.addFromDir).to.be.a('function')
    })
  })
})

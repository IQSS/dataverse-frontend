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

  const createFileEntry = (file: File, fullPath: string): FileSystemFileEntry =>
    ({
      isFile: true,
      isDirectory: false,
      fullPath,
      file: (successCallback: (file: File) => void) => successCallback(file)
    } as FileSystemFileEntry)

  const createDirectoryEntry = (
    batches: FileSystemEntry[][],
    extra: Partial<FileSystemDirectoryEntry> = {}
  ): FileSystemDirectoryEntry =>
    ({
      isFile: false,
      isDirectory: true,
      ...extra,
      createReader: () => ({
        readEntries: (successCallback: (entries: FileSystemEntry[]) => void) => {
          successCallback(batches.shift() ?? [])
        }
      })
    } as FileSystemDirectoryEntry)

  /** Build a DataTransferItemList-like object whose items return a fixed entry. */
  const createDroppedItems = (entries: Array<FileSystemEntry | null>): DataTransferItemList =>
    entries.map((entry) => ({
      webkitGetAsEntry: () => entry
    })) as unknown as DataTransferItemList

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

    it('should set an empty checksum when checksum calculation is disabled', async () => {
      const updateFile = cy.stub()
      const fileRepository = {
        uploadFile: cy
          .stub()
          .callsFake(
            (
              _datasetId: string,
              _fileHolder: { file: File },
              _progress: (now: number) => void,
              _abortController: AbortController,
              getStorageId: (storageId: string) => void
            ) => {
              getStorageId('storage-1')
              return Promise.resolve()
            }
          )
      } as unknown as FileRepository
      const config = createConfig({
        fileRepository,
        checksumAlgorithm: FixityAlgorithm.NONE,
        updateFile
      })

      const { result } = renderHook(() => useFileUploadOperations(config))

      await act(async () => {
        await result.current.uploadOneFile(createMockFile('test.txt'))
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(updateFile).to.have.been.calledWith('test.txt', { checksumValue: '' })
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

    it('uploads files dropped as direct file entries (entry?.isFile branch)', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      const file = createMockFile('dropped.txt')
      const items = createDroppedItems([createFileEntry(file, '/dropped.txt')])

      await act(async () => {
        result.current.handleDroppedItems(items)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.have.been.calledOnce
    })

    it('descends into a directory dropped as a directory entry (entry?.isDirectory branch)', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      const file = createMockFile('inside.txt')
      const dir = createDirectoryEntry([[createFileEntry(file, '/folder/inside.txt')], []])
      const items = createDroppedItems([dir])

      await act(async () => {
        result.current.handleDroppedItems(items)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.have.been.calledOnce
    })

    it('falls back to fallbackFiles when no entry is handled (no-entry + fallback branch)', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      // Items whose webkitGetAsEntry returns null — none of them is
      // handled via the entry path, so the fallback FileList is used.
      const items = createDroppedItems([null])
      const fallback = {
        length: 1,
        0: createMockFile('fallback.txt'),
        item(i: number) {
          return (this as unknown as { [k: number]: File })[i] ?? null
        }
      } as unknown as FileList

      await act(async () => {
        result.current.handleDroppedItems(items, fallback)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.have.been.calledOnce
    })

    it('does nothing when no entry is handled and no fallback is provided', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      const items = createDroppedItems([null])

      await act(async () => {
        result.current.handleDroppedItems(items)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.not.have.been.called
    })

    it('does nothing when no entry is handled and fallback is empty', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      const items = createDroppedItems([null])
      const fallback = {
        length: 0,
        item() {
          return null
        }
      } as unknown as FileList

      await act(async () => {
        result.current.handleDroppedItems(items, fallback)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.not.have.been.called
    })

    it('preserves webkitRelativePath stripped of the leading "/" for dropped file entries', async () => {
      const captured: File[] = []
      const addFile = cy.stub().callsFake((file: File) => {
        captured.push(file)
      })
      const config = createConfig({ addFile })
      const { result } = renderHook(() => useFileUploadOperations(config))

      const file = createMockFile('a.txt')
      const items = createDroppedItems([createFileEntry(file, '/folder/a.txt')])

      await act(async () => {
        result.current.handleDroppedItems(items)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(captured).to.have.length(1)
      // The wrapper File has the leading slash stripped from webkitRelativePath
      expect(
        (captured[0] as unknown as { webkitRelativePath: string }).webkitRelativePath
      ).to.equal('folder/a.txt')
    })
  })

  describe('addFromDir', () => {
    it('should be a function', () => {
      const config = createConfig()
      const { result } = renderHook(() => useFileUploadOperations(config))

      expect(result.current.addFromDir).to.be.a('function')
    })

    it('should read all directory entry batches', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const firstFile = createMockFile('first.txt')
      const secondFile = createMockFile('second.txt')
      const directory = createDirectoryEntry([
        [createFileEntry(firstFile, '/folder/first.txt')],
        [createFileEntry(secondFile, '/folder/second.txt')],
        []
      ])

      await act(async () => {
        result.current.addFromDir(directory)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(addFile).to.have.been.calledTwice
    })

    it('recurses into nested directory entries (entry.isDirectory branch in addFromDir)', async () => {
      const addFile = cy.stub()
      const config = createConfig({ addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const innerFile = createMockFile('deep.txt')
      const innerDir = createDirectoryEntry([
        [createFileEntry(innerFile, '/outer/inner/deep.txt')],
        []
      ])
      const outerDir = createDirectoryEntry([[innerDir], []])

      await act(async () => {
        result.current.addFromDir(outerDir)
        // Allow the recursive readNextBatch chain to drain.
        await new Promise((resolve) => setTimeout(resolve, 10))
      })

      expect(addFile).to.have.been.calledOnce
    })

    it('handles a file entry whose fullPath does NOT start with "/" (ternary else branch)', async () => {
      const captured: File[] = []
      const addFile = cy.stub().callsFake((file: File) => {
        captured.push(file)
      })
      const config = createConfig({ addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const file = createMockFile('weird.txt')
      // Some browser implementations omit the leading slash. The component
      // must fall through to use entry.fullPath as-is.
      const directory = createDirectoryEntry([[createFileEntry(file, 'folder/weird.txt')], []])

      await act(async () => {
        result.current.addFromDir(directory)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(captured).to.have.length(1)
      expect(
        (captured[0] as unknown as { webkitRelativePath: string }).webkitRelativePath
      ).to.equal('folder/weird.txt')
    })

    it('handles a file entry whose fullPath is undefined (?? "" branch)', async () => {
      const captured: File[] = []
      const addFile = cy.stub().callsFake((file: File) => {
        captured.push(file)
      })
      const config = createConfig({ addFile })

      const { result } = renderHook(() => useFileUploadOperations(config))

      const file = createMockFile('nameless.txt')
      const fileEntry = {
        isFile: true,
        isDirectory: false,
        // No fullPath — exercises the optional-chaining + nullish coalesce.
        file: (cb: (f: File) => void) => cb(file)
      } as unknown as FileSystemFileEntry
      const directory = createDirectoryEntry([[fileEntry], []])

      await act(async () => {
        result.current.addFromDir(directory)
        await new Promise((resolve) => setTimeout(resolve, 0))
      })

      expect(captured).to.have.length(1)
      expect(
        (captured[0] as unknown as { webkitRelativePath: string }).webkitRelativePath
      ).to.equal('')
    })
  })
})

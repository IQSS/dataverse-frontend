import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import {
  FileUploadStatus,
  UploadedFile
} from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { FileUploaderHelper } from '@/sections/shared/file-uploader/FileUploaderHelper'

describe('FileUploaderHelper', () => {
  describe('getFileKey', () => {
    it('returns file name if file does not have a webkitRelativePath', () => {
      const file = new File([], 'file.txt')
      expect(FileUploaderHelper.getFileKey(file)).to.equal('file.txt')
    })

    it('returns file webkitRelativePath if it has one', () => {
      const fileWithPath = new File([], 'file.txt')
      Object.defineProperty(fileWithPath, 'webkitRelativePath', {
        value: 'path/to/file.txt',
        writable: true
      })

      expect(FileUploaderHelper.getFileKey(fileWithPath)).to.equal('path/to/file.txt')
    })
  })

  describe('isDS_StoreFile', () => {
    it('returns true if file name is .DS_Store', () => {
      const file = new File([], '.DS_Store')
      expect(FileUploaderHelper.isDS_StoreFile(file)).to.be.true
    })
    it('returns false if file name is not .DS_Store', () => {
      const file = new File([], 'file.txt')
      expect(FileUploaderHelper.isDS_StoreFile(file)).to.be.false
    })
  })

  describe('isUniqueCombinationOfFilepathAndFilename', () => {
    const testFileOne: UploadedFile = {
      key: 'file.txt',
      progress: 100,
      status: FileUploadStatus.DONE,
      fileName: 'file.txt',
      fileDir: '',
      fileType: 'text/plain',
      fileSizeString: '0 B',
      fileSize: 0,
      fileLastModified: 0,
      description: '',
      tags: [],
      restricted: false,
      checksumAlgorithm: FixityAlgorithm.SHA256,
      checksumValue: '123456',
      storageId: '1'
    }

    const testFileTwo: UploadedFile = {
      key: 'file2.txt',
      progress: 100,
      status: FileUploadStatus.DONE,
      fileName: 'file2.txt',
      fileDir: '',
      fileType: 'text/plain',
      fileSizeString: '0 B',
      fileSize: 0,
      fileLastModified: 0,
      description: '',
      tags: [],
      restricted: false,
      checksumAlgorithm: FixityAlgorithm.SHA256,
      checksumValue: '123456',
      storageId: '2'
    }

    it('returns true if file is unique', () => {
      expect(
        FileUploaderHelper.isUniqueCombinationOfFilepathAndFilename({
          fileName: testFileOne.fileName,
          filePath: testFileOne.fileDir,
          fileKey: testFileOne.key,
          allFiles: [testFileOne, testFileTwo]
        })
      ).to.be.true
    })

    it('returns false if file is not unique', () => {
      const testFileTwoWithSameName = {
        ...testFileTwo,
        fileName: testFileOne.fileName,
        fileDir: testFileOne.fileDir
      }

      expect(
        FileUploaderHelper.isUniqueCombinationOfFilepathAndFilename({
          fileName: testFileOne.fileName,
          filePath: testFileOne.fileDir,
          fileKey: testFileOne.key,
          allFiles: [testFileOne, testFileTwoWithSameName]
        })
      ).to.be.false
    })
  })

  describe('isValidFilePath', () => {
    it('returns true if file path is valid', () => {
      expect(FileUploaderHelper.isValidFilePath('path/to/file.txt')).to.be.true
    })

    it('returns false if file path is invalid', () => {
      expect(FileUploaderHelper.isValidFilePath('path/to/file.txt:')).to.be.false
    })
  })

  describe('isValidFileName', () => {
    it('returns true if file name is valid', () => {
      expect(FileUploaderHelper.isValidFileName('file.txt')).to.be.true
    })

    it('returns false if file name is invalid', () => {
      expect(FileUploaderHelper.isValidFileName('file.txt:')).to.be.false
    })
  })

  describe('sanitizeFilePath', () => {
    it('replaces invalid characters with underscore', () => {
      expect(FileUploaderHelper.sanitizeFilePath('path/to/file.txt:')).to.equal('path/to/file.txt_')
    })

    it('does not replace valid characters', () => {
      expect(FileUploaderHelper.sanitizeFilePath('path/to/file.txt')).to.equal('path/to/file.txt')
    })
  })

  describe('sanitizeFileName', () => {
    it('replaces invalid characters with underscore', () => {
      expect(FileUploaderHelper.sanitizeFileName('file.txt:')).to.equal('file.txt_')
    })

    it('does not replace valid characters', () => {
      expect(FileUploaderHelper.sanitizeFileName('file.txt')).to.equal('file.txt')
    })
  })

  describe('ChecksumUtil.getChecksum', () => {
    const testText = 'Hello, world!'
    const testBlob = new Blob([testText], { type: 'text/plain' })

    // Expected results are from https://www.browserling.com/tools/all-hashes with input 'Hello, world!'

    it('returns correct MD5 checksum', async () => {
      const expectedMd5Hex = '6cd3556deb0da54bca060b4c39479839'

      const checksum = await FileUploaderHelper.getChecksum(testBlob, FixityAlgorithm.MD5)
      expect(checksum).to.eq(expectedMd5Hex)
    })

    it('returns correct SHA-1 checksum', async () => {
      const expectedSha1Hex = '943a702d06f34599aee1f8da8ef9f7296031d699'

      const checksum = await FileUploaderHelper.getChecksum(testBlob, FixityAlgorithm.SHA1)
      expect(checksum).to.eq(expectedSha1Hex)
    })

    it('returns correct SHA-256 checksum', async () => {
      const expectedSha256Hex = '315f5bdb76d078c43b8ac0064e4a0164612b1fce77c869345bfc94c75894edd3'

      const checksum = await FileUploaderHelper.getChecksum(testBlob, FixityAlgorithm.SHA256)
      expect(checksum).to.eq(expectedSha256Hex)
    })

    it('returns correct SHA-512 checksum', async () => {
      const expectedSha512Hex =
        'c1527cd893c124773d811911970c8fe6e857d6df5dc9226bd8a160614c0cd963a4ddea2b94bb7d36021ef9d865d5cea294a82dd49a0bb269f51f6e7a57f79421'

      const checksum = await FileUploaderHelper.getChecksum(testBlob, FixityAlgorithm.SHA512)
      expect(checksum).to.eq(expectedSha512Hex)
    })
  })
})

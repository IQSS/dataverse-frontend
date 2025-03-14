import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { FileUploadInputState, FileUploadStatus } from './context/fileUploaderReducer'

export const mockFileUploadState: FileUploadInputState = {
  'file1.jpg': {
    key: 'file1.jpg',
    progress: 100,
    storageId: 'storage1',
    fileSizeString: '2 MB',
    fileSize: 2000000,
    fileLastModified: 1700000000000,
    fileName: 'document.pdf',
    fileDir: '',
    fileType: 'application/pdf',
    checksumValue: 'abcd1234',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.DONE,
    description: ''
  },
  file2: {
    key: 'file2',
    progress: 50,
    fileSizeString: '5 MB',
    fileSize: 5000000,
    fileLastModified: 1700000005000,
    fileName: 'image.png',
    fileDir: '',
    fileType: 'image/png',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.UPLOADING,
    description: ''
  },
  file3: {
    key: 'file3',
    progress: 10,
    fileSizeString: '8 MB',
    fileSize: 8000000,
    fileLastModified: 1700000010000,
    fileName: 'video.mp4',
    fileDir: '',
    fileType: 'video/mp4',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.FAILED,
    description: ''
  },
  file4: {
    key: 'file4',
    progress: 100,
    fileSizeString: '1.5 MB',
    fileSize: 1500000,
    fileLastModified: 1700000015000,
    fileName: 'spreadsheet.xlsx',
    fileDir: 'documents',
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.DONE,
    description: ''
  },
  file5: {
    key: 'file5',
    progress: 0,
    fileSizeString: '3 MB',
    fileSize: 3000000,
    fileLastModified: 1700000020000,
    fileName: 'presentation.pptx',
    fileDir: 'slides',
    fileType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.UPLOADING,
    description: ''
  },
  file6: {
    key: 'file6',
    progress: 75,

    fileSizeString: '6 MB',
    fileSize: 6000000,
    fileLastModified: 1700000025000,
    fileName: 'audio_super_long_name_file.mp3',
    fileDir: '',
    fileType: 'audio/mpeg',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.UPLOADING,
    description: ''
  },
  file7: {
    key: 'file7',
    progress: 100,
    fileSizeString: '700 KB',
    fileSize: 700000,
    fileLastModified: 1700000030000,
    fileName: 'notes.txt',
    fileDir: 'documents',
    fileType: 'text/plain',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.DONE,
    description: ''
  },
  file8: {
    key: 'file8',
    progress: 20,
    fileSizeString: '15 MB',
    fileSize: 15000000,
    fileLastModified: 1700000035000,
    fileName: 'compressed.zip',
    fileDir: 'archives',
    fileType: 'application/zip',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.UPLOADING,
    description: ''
  },
  file9: {
    key: 'file9',
    progress: 100,
    fileSizeString: '10 MB',
    fileSize: 10000000,
    fileLastModified: 1700000040000,
    fileName: 'report.docx',
    fileDir: 'reports',
    fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.DONE,
    description: ''
  },
  file10: {
    key: 'file10',
    progress: 0,
    fileSizeString: '12 MB',
    fileSize: 12000000,
    fileLastModified: 1700000045000,
    fileName: 'corrupted-file.dat',
    fileDir: 'unknown',
    fileType: 'application/octet-stream',
    checksumAlgorithm: FixityAlgorithm.MD5,
    status: FileUploadStatus.UPLOADING,
    description: ''
  }
}

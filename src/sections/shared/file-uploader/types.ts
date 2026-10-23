import { FileRepository } from '@/files/domain/repositories/FileRepository'

export type UploaderFileRepository = Pick<
  FileRepository,
  'uploadFile' | 'addUploadedFiles' | 'getFixityAlgorithm'
>

export type FullUploaderFileRepository = UploaderFileRepository & Pick<FileRepository, 'replace'>

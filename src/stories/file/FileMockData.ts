import { FileSize, FileSizeUnit } from '../../files/domain/models/FileMetadata'
import { FileMetadataMother } from '../../../tests/component/files/domain/models/FileMetadataMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilePreviewMother } from '../../../tests/component/files/domain/models/FilePreviewMother'

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

export function makeFiles(paginationInfo: FilePaginationInfo): FilePreview[] {
  return range(paginationInfo.pageSize).map((value, index) => {
    return FilePreviewMother.create({
      id: (paginationInfo.page - 1) * paginationInfo.pageSize + index,
      metadata: FileMetadataMother.createDefault({
        size: new FileSize(
          (paginationInfo.page - 1) * paginationInfo.pageSize + index,
          FileSizeUnit.BYTES
        )
      })
    })
  })
}

export const FilesMockData = (
  paginationInfo: FilePaginationInfo = new FilePaginationInfo()
): FilePreview[] => makeFiles(paginationInfo)

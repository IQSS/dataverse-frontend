import { FilePreview, FileSize, FileSizeUnit } from '../../files/domain/models/FilePreview'
import { FilePreviewMother } from '../../../tests/component/files/domain/models/FilePreviewMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'

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
      size: new FileSize(
        (paginationInfo.page - 1) * paginationInfo.pageSize + index,
        FileSizeUnit.BYTES
      )
    })
  })
}

export const FilesMockData = (
  paginationInfo: FilePaginationInfo = new FilePaginationInfo()
): FilePreview[] => makeFiles(paginationInfo)

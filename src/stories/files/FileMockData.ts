import { File, FileSize, FileSizeUnit } from '../../files/domain/models/File'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

export function makeFiles(paginationInfo: FilePaginationInfo): File[] {
  return range(paginationInfo.pageSize).map((value, index) => {
    return FileMother.create({
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
): File[] => makeFiles(paginationInfo)

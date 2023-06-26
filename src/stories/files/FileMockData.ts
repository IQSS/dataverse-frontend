import { File } from '../../files/domain/models/File'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'

const range = (len: number) => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

export function makeFiles(len: number): File[] {
  return range(len).map(() => {
    return FileMother.create()
  })
}

export const FilesMockData = (): File[] => makeFiles(20)

import { FileRepository } from '../domain/repositories/FileRepository'
import { File } from '../domain/models/File'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { FileUserPermissions } from '../domain/models/FileUserPermissions'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'
import { getDatasetFiles, WriteError } from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'

export class FileJSDataverseRepository implements FileRepository {
  getAllByDatasetPersistentId(
    persistentId: string,
    version?: string,
    paginationInfo?: FilePaginationInfo,
    criteria?: FileCriteria
  ): Promise<File[]> {
    const jsPagination = DomainFileMapper.toJSPagination(paginationInfo)
    const jsFileOrderCriteria = DomainFileMapper.toJSFileOrderCriteria(criteria)

    return getDatasetFiles
      .execute(persistentId, version, jsPagination.limit, jsPagination.offset, jsFileOrderCriteria)
      .then((jsFiles) => jsFiles.map((jsFile) => JSFileMapper.toFile(jsFile)))
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string
  ): Promise<FilesCountInfo> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.create())
      }, 1000)
    })
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  getFileUserPermissionsById(id: number): Promise<FileUserPermissions> {
    // TODO - implement using js-dataverse
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileUserPermissionsMother.create())
      }, 1000)
    })
  }
}

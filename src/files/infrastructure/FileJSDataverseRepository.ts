import { FileRepository } from '../domain/repositories/FileRepository'
import { File, FilePublishingStatus } from '../domain/models/File'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { FileUserPermissions } from '../domain/models/FileUserPermissions'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'
import {
  getDatasetFiles,
  getFileDownloadCount,
  WriteError
} from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'

export class FileJSDataverseRepository implements FileRepository {
  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo: FilePaginationInfo = new FilePaginationInfo(),
    criteria?: FileCriteria
  ): Promise<File[]> {
    const jsPagination = DomainFileMapper.toJSPagination(paginationInfo)
    const jsFileOrderCriteria = DomainFileMapper.toJSFileOrderCriteria(criteria)

    return getDatasetFiles
      .execute(
        datasetPersistentId,
        datasetVersion.toString(),
        jsPagination.limit,
        jsPagination.offset,
        jsFileOrderCriteria
      )
      .then((jsFiles) => jsFiles.map((jsFile) => JSFileMapper.toFile(jsFile, datasetVersion)))
      .then((files) =>
        Promise.all(
          files.map((file) =>
            FileJSDataverseRepository.getFileDownloadCount(
              file.id,
              file.version.publishingStatus
            ).then((downloadCount) => {
              file.downloadCount = downloadCount
              return file
            })
          )
        )
      )
      .catch((error: WriteError) => {
        console.error('Error getting files from Dataverse', error)
        throw new Error(error.message)
      })
  }

  private static getFileDownloadCount(
    id: number,
    publishingStatus: FilePublishingStatus
  ): Promise<number> {
    if (publishingStatus === FilePublishingStatus.RELEASED) {
      return getFileDownloadCount.execute(id).then((downloadCount) => Number(downloadCount))
    }
    return Promise.resolve(0)
  }

  getCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
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

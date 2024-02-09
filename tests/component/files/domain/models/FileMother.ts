import { File } from '../../../../../src/files/domain/models/File'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileMetadataMother } from './FileMetadataMother'
import { FileVersionMother } from './FileVersionMother'
import { FileAccessMother } from './FileAccessMother'
import { faker } from '@faker-js/faker'
import { FileIngestMother } from './FileIngestMother'
import { FilePermissionsMother } from './FilePermissionsMother'

export class FileMother {
  static create(props?: Partial<File>): File {
    return {
      id: faker.datatype.number(),
      name: faker.system.fileName(),
      version: FileVersionMother.create(),
      datasetVersion: DatasetVersionMother.create(),
      citation: FileCitationMother.create('File Title'),
      access: FileAccessMother.create(),
      metadata: FileMetadataMother.create(),
      permissions: FilePermissionsMother.create(),
      ingest: FileIngestMother.create(),
      ...props
    }
  }

  static createRealistic(props?: Partial<File>): File {
    return this.create({
      name: 'File Title',
      datasetVersion: DatasetVersionMother.createRealistic(),
      citation: FileCitationMother.create('File Title'),
      access: FileAccessMother.createPublic(),
      permissions: FilePermissionsMother.createWithGrantedPermissions(),
      metadata: FileMetadataMother.createDefault(),
      ...props
    })
  }

  static createRestricted(props?: Partial<File>): File {
    return this.createRealistic({
      access: FileAccessMother.createRestricted(),
      permissions: FilePermissionsMother.createWithDeniedPermissions(),
      ...props
    })
  }

  static createRestrictedWithAccessGranted(props?: Partial<File>): File {
    return this.createRealistic({
      access: FileAccessMother.createRestricted(),
      permissions: FilePermissionsMother.createWithGrantedPermissions(),
      ...props
    })
  }

  static createWithThumbnail(props?: Partial<File>): File {
    return this.create({
      metadata: FileMetadataMother.createWithThumbnail(),
      ...props
    })
  }

  static createWithoutThumbnail(props?: Partial<File>): File {
    return this.create({
      metadata: FileMetadataMother.createWithoutThumbnail(),
      ...props
    })
  }

  static createWithDownloadPermissionGranted(props?: Partial<File>): File {
    return this.create({
      permissions: FilePermissionsMother.createWithDownloadFileGranted(),
      ...props
    })
  }

  static createWithDownloadPermissionDenied(props?: Partial<File>): File {
    return this.create({
      permissions: FilePermissionsMother.createWithDownloadFileDenied(),
      ...props
    })
  }
}

export class FileCitationMother {
  static create(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1; ${fileName} [fileName]`
  }

  static createDraft(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DRAFT; ${fileName} [fileName]`
  }

  static createDeaccessioned(fileName: string): string {
    return `Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, DEACCESSIONED; ${fileName} [fileName]`
  }
}

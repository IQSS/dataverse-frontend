import { File } from '../../../../../src/files/domain/models/File'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'
import { FileMetadataMother } from './FileMetadataMother'
import { FileAccessMother } from './FileAccessMother'
import { FileUserPermissionsMother } from './FileUserPermissionsMother'
import { faker } from '@faker-js/faker'
import { FileIngestMother } from './FileIngestMother'

export class FileMother {
  static create(props?: Partial<File>): File {
    return {
      id: faker.datatype.number(),
      name: faker.system.fileName(),
      datasetVersion: DatasetVersionMother.create(),
      citation: FileCitationMother.create('File Title'),
      access: FileAccessMother.create(),
      metadata: FileMetadataMother.create(),
      permissions: FileUserPermissionsMother.create(),
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
      permissions: FileUserPermissionsMother.createWithAllPermissionsGranted(),
      metadata: FileMetadataMother.createDefault(),
      ...props
    })
  }

  static createRestricted(props?: Partial<File>): File {
    return this.createRealistic({
      access: FileAccessMother.createRestricted(),
      permissions: FileUserPermissionsMother.createWithAllPermissionsDenied(),
      ...props
    })
  }

  static createRestrictedWithAccessGranted(props?: Partial<File>): File {
    return this.createRealistic({
      access: FileAccessMother.createRestricted(),
      permissions: FileUserPermissionsMother.createWithAllPermissionsGranted(),
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
      permissions: FileUserPermissionsMother.createWithDownloadFileGranted(),
      ...props
    })
  }

  static createWithDownloadPermissionDenied(props?: Partial<File>): File {
    return this.create({
      permissions: FileUserPermissionsMother.createWithDownloadFileDenied(),
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

import { FilePreview } from '../../../../../src/files/domain/models/FilePreview'
import { FileMetadataMother } from './FileMetadataMother'
import { faker } from '@faker-js/faker'
import { FileAccessMother } from './FileAccessMother'
import { FileVersionMother } from './FileVersionMother'
import { FileIngestMother } from './FileIngestMother'
import { FilePermissionsMother } from './FilePermissionsMother'

export class FilePreviewMother {
  static create(props?: Partial<FilePreview>): FilePreview {
    return {
      id: faker.datatype.number(),
      name: faker.system.fileName(),
      version: FileVersionMother.create(),
      access: FileAccessMother.create(),
      ingest: FileIngestMother.create(),
      metadata: FileMetadataMother.create(),
      permissions: FilePermissionsMother.create(),
      ...props
    }
  }

  static createMany(amount: number, props?: Partial<FilePreview>): FilePreview[] {
    return Array.from({ length: amount }).map(() => this.create(props))
  }

  static createDefault(props?: Partial<FilePreview>): FilePreview {
    return this.create({
      name: 'File Title',
      version: FileVersionMother.createReleased(),
      access: FileAccessMother.createPublic(),
      ingest: FileIngestMother.createIngestNone(),
      metadata: FileMetadataMother.createDefault(),
      permissions: FilePermissionsMother.createWithGrantedPermissions(),
      ...props
    })
  }

  static createWithEmbargo(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithEmbargo()
    })
  }

  static createWithEmbargoRestricted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createRestricted(),
      metadata: FileMetadataMother.createWithEmbargo()
    })
  }

  static createWithPublicAccess(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createPublic(),
      metadata: FileMetadataMother.createNotEmbargoed()
    })
  }

  static createWithPublicAccessButLatestVersionRestricted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createNotRestrictedButLatestVersionRestricted(),
      metadata: FileMetadataMother.createNotEmbargoed()
    })
  }

  static createRestricted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createRestricted(),
      metadata: FileMetadataMother.createNotEmbargoed(),
      permissions: FilePermissionsMother.createWithDeniedPermissions()
    })
  }

  static createRestrictedWithAccessGranted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createRestricted(),
      metadata: FileMetadataMother.createNotEmbargoed(),
      permissions: FilePermissionsMother.createWithGrantedPermissions()
    })
  }

  static createWithAccessRequestAllowed(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createWithAccessRequestAllowed(),
      metadata: FileMetadataMother.createNotEmbargoed()
    })
  }

  static createWithAccessRequestPending(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createWithAccessRequestPending(),
      metadata: FileMetadataMother.createNotEmbargoed()
    })
  }

  static createWithThumbnail(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithThumbnail(),
      access: FileAccessMother.createPublic()
    })
  }

  static createWithThumbnailRestricted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createRestricted(),
      metadata: FileMetadataMother.createWithThumbnail(),
      permissions: FilePermissionsMother.createWithDeniedPermissions()
    })
  }

  static createWithThumbnailRestrictedWithAccessGranted(): FilePreview {
    return this.createDefault({
      access: FileAccessMother.createRestricted(),
      metadata: FileMetadataMother.createWithThumbnail(),
      permissions: FilePermissionsMother.createWithGrantedPermissions()
    })
  }

  static createDeaccessioned(): FilePreview {
    return this.createDefault({
      version: FileVersionMother.createDeaccessioned()
    })
  }

  static createIngestInProgress(): FilePreview {
    return this.createDefault({
      ingest: FileIngestMother.createInProgress()
    })
  }

  static createIngestProblem(reportMessage?: string): FilePreview {
    return this.createDefault({
      ingest: FileIngestMother.createIngestProblem(reportMessage)
    })
  }

  static createTabular(props?: Partial<FilePreview>): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createTabular(),
      ...props
    })
  }

  static createNonTabular(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createNonTabular()
    })
  }

  static createDeleted(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createDeleted()
    })
  }

  static createWithLabels(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithLabels()
    })
  }

  static createWithDirectory(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithDirectory()
    })
  }

  static createWithDescription(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithDescription()
    })
  }

  static createWithChecksum(): FilePreview {
    return this.createDefault({
      metadata: FileMetadataMother.createWithChecksum()
    })
  }
}

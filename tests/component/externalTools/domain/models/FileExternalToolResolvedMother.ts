import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'

export class FileExternalToolResolvedMother {
  static create(props?: Partial<FileExternalToolResolved>): FileExternalToolResolved {
    return {
      displayName: 'File Explore Tool',
      fileId: 1,
      preview: false,
      toolUrlResolved: 'https://example.com/explore-tool?fileId=1',
      ...props
    }
  }
}

import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'

export class FileExternalToolResolvedMother {
  static create(props?: Partial<FileExternalToolResolved>): FileExternalToolResolved {
    return {
      displayName: 'File Explore Tool',
      fileId: 1,
      preview: false,
      toolUrlResolved: 'http://localhost:3000/external-tool',
      ...props
    }
  }
}

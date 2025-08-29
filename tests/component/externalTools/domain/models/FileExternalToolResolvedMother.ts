import { FileExternalToolResolved } from '@/externalTools/domain/models/FileExternalToolResolved'

export class FileExternalToolResolvedMother {
  static create(props?: Partial<FileExternalToolResolved>): FileExternalToolResolved {
    return {
      displayName: 'File Explore Tool',
      fileId: 1,
      preview: false,
      toolUrlResolved: 'https://www.youtube.com/embed/MPQ0Tpgaxt0?si=376kd6g0CVmCtIOi',
      ...props
    }
  }
}

import {
  FileTreeFile,
  FileTreeFolder,
  FileTreeItemType
} from '../../../../../src/files/domain/models/FileTreeItem'

export class FileTreeFolderMother {
  static create(props: Partial<FileTreeFolder> & { name: string; path: string }): FileTreeFolder {
    return {
      type: FileTreeItemType.FOLDER,
      name: props.name,
      path: props.path,
      counts: props.counts ?? { files: 0, folders: 0 }
    }
  }
}

export class FileTreeFileMother {
  static create(
    props: Partial<FileTreeFile> & { id: number; name: string; path: string }
  ): FileTreeFile {
    return {
      type: FileTreeItemType.FILE,
      id: props.id,
      name: props.name,
      path: props.path,
      size: props.size ?? 1024,
      contentType: props.contentType ?? 'text/plain',
      access: props.access,
      checksum: props.checksum,
      downloadUrl: props.downloadUrl ?? `/api/access/datafile/${props.id}`
    }
  }
}

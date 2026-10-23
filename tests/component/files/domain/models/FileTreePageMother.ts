import {
  FileTreeInclude,
  FileTreeOrder,
  FileTreePage
} from '../../../../../src/files/domain/models/FileTreePage'
import { FileTreeItem } from '../../../../../src/files/domain/models/FileTreeItem'

export class FileTreePageMother {
  static create(props: Partial<FileTreePage> & { items: FileTreeItem[] }): FileTreePage {
    return {
      path: props.path ?? '',
      items: props.items,
      nextCursor: props.nextCursor ?? null,
      limit: props.limit ?? 100,
      order: props.order ?? FileTreeOrder.NAME_AZ,
      include: props.include ?? FileTreeInclude.ALL,
      approximateCount: props.approximateCount ?? props.items.length
    }
  }
}

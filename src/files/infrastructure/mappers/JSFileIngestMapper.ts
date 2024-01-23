import { FileIngestStatus } from '../../domain/models/FileIngest'

export class JSFileIngestMapper {
  static toFileIngest() {
    return { status: FileIngestStatus.NONE } // TODO - Implement this when it is added to js-dataverse
  }
}

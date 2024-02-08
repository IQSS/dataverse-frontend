import { FileIngest, FileIngestStatus } from '../../domain/models/FileIngest'

export class JSFileIngestMapper {
  static toFileIngest() {
    return new FileIngest(FileIngestStatus.NONE) // TODO - Implement this when it is added to js-dataverse
  }
}

import { FilePreview as JSFilePreview } from '@iqss/dataverse-client-javascript'
import { FileItemTypePreview } from '../../domain/models/FileItemTypePreview'

export class JSFileItemTypePreviewMapper {
  static toFileItemTypePreview(jsFilePreview: JSFilePreview): FileItemTypePreview {
    return {
      type: jsFilePreview.type,
      id: jsFilePreview.fileId,
      name: jsFilePreview.name,
      persistentId: jsFilePreview.filePersistentId,
      url: jsFilePreview.url,
      thumbnail: jsFilePreview.imageUrl,
      description: jsFilePreview.description,
      fileType: jsFilePreview.fileType,
      fileContentType: jsFilePreview.fileContentType,
      sizeInBytes: jsFilePreview.sizeInBytes,
      md5: jsFilePreview.md5,
      checksum: jsFilePreview.checksum,
      unf: jsFilePreview.unf,
      datasetName: jsFilePreview.datasetName,
      datasetId: jsFilePreview.datasetId,
      datasetPersistentId: jsFilePreview.datasetPersistentId,
      datasetCitation: jsFilePreview.datasetCitation,
      publicationStatuses: jsFilePreview.publicationStatuses,
      releaseOrCreateDate: jsFilePreview.releaseOrCreateDate,
      restricted: jsFilePreview.restricted,
      canDownloadFile: jsFilePreview.canDownloadFile,
      categories: jsFilePreview.categories,
      tabularTags: jsFilePreview.tabularTags,
      observations: jsFilePreview.observations,
      variables: jsFilePreview.variables
    }
  }
}

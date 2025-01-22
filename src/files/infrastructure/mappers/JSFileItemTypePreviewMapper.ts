import { FilePreview as JSFilePreview } from '@iqss/dataverse-client-javascript'
import { FileItemTypePreview } from '../../domain/models/FileItemTypePreview'
import { FileLabelType } from '@/files/domain/models/FileMetadata'
import { FileLabel } from '@/files/domain/models/FileMetadata'

export class JSFileItemTypePreviewMapper {
  static toFileItemTypePreview(jsFilePreview: JSFilePreview): FileItemTypePreview {
    const tabularTagsAsLabels: FileLabel[] = (jsFilePreview.tabularTags || []).map((tag) => ({
      type: FileLabelType.TAG,
      value: tag
    }))

    const categoriesAsLabels: FileLabel[] = (jsFilePreview.categories || []).map((category) => ({
      type: FileLabelType.CATEGORY,
      value: category
    }))

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
      tags: [...categoriesAsLabels, ...tabularTagsAsLabels] as FileLabel[],
      variables: jsFilePreview.variables,
      observations: jsFilePreview.observations,
      restricted: jsFilePreview.restricted,
      canDownloadFile: jsFilePreview.canDownloadFile
    }
  }
}

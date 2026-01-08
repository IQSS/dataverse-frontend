import { getDatasetTemplates } from '@iqss/dataverse-client-javascript'
import { DatasetTemplate } from '@/dataset/domain/models/DatasetTemplate'
import { TemplateRepository } from '../../domain/repositories/TemplateRepository'

export class TemplateJSDataverseRepository implements TemplateRepository {
  getDatasetTemplates(collectionIdOrAlias: number | string): Promise<DatasetTemplate[]> {
    return getDatasetTemplates.execute(collectionIdOrAlias)
  }
}

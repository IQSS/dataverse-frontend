import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { DatasetTemplate } from '@/dataset/domain/models/DatasetTemplate'
import { DatasetTemplateMother } from '@tests/component/dataset/domain/models/DatasetTemplateMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class TemplateMockRepository implements TemplateRepository {
  getDatasetTemplates(_collectionIdOrAlias: number | string): Promise<DatasetTemplate[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetTemplateMother.createMany(3))
      }, FakerHelper.loadingTimout())
    })
  }
}

import { CreateTemplateDTO } from '@iqss/dataverse-client-javascript'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/dataset/domain/models/DatasetTemplate'
import { DatasetTemplateMother } from '@tests/component/dataset/domain/models/DatasetTemplateMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class TemplateMockRepository implements TemplateRepository {
  createTemplate(
    _template: CreateTemplateDTO,
    _collectionIdOrAlias: number | string
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  getTemplate(_templateId: number): Promise<Template> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetTemplateMother.create())
      }, FakerHelper.loadingTimout())
    })
  }

  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetTemplateMother.createMany(3))
      }, FakerHelper.loadingTimout())
    })
  }

  deleteTemplate(_templateId: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
}

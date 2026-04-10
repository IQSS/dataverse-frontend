import { TemplateInfo } from '@/templates/domain/models/TemplateInfo'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { Template } from '@/templates/domain/models/Template'
import { TemplateMother } from '@tests/component/sections/templates/TemplateMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class TemplateMockRepository implements TemplateRepository {
  createTemplate(_template: TemplateInfo, _collectionIdOrAlias: number | string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  getTemplate(_templateId: number): Promise<Template> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TemplateMother.create())
      }, FakerHelper.loadingTimout())
    })
  }

  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(TemplateMother.createMany(3))
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

  setTemplateAsDefault(_templateId: number, _collectionIdOrAlias: number | string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }

  unsetTemplateAsDefault(_collectionIdOrAlias: number | string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
}

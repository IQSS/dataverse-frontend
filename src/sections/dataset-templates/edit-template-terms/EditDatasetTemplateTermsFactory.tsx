import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { EditDatasetTemplateTerms } from './index'

const templateRepository = new TemplateJSDataverseRepository()

export class EditDatasetTemplateTermsFactory {
  static create(): ReactElement {
    return <EditDatasetTemplateTermsWithParams />
  }
}

function EditDatasetTemplateTermsWithParams() {
  const { collectionId, templateId } = useParams<{
    collectionId: string
    templateId: string
  }>() as {
    collectionId: string
    templateId: string
  }

  return (
    <EditDatasetTemplateTerms
      collectionId={collectionId}
      templateId={Number(templateId)}
      templateRepository={templateRepository}
    />
  )
}

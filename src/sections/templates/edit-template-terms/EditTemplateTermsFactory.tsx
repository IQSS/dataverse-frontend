import { ReactElement } from 'react'
import { useParams } from 'react-router-dom'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { EditTemplateTerms } from './index'

const templateRepository = new TemplateJSDataverseRepository()

export class EditTemplateTermsFactory {
  static create(): ReactElement {
    return <EditTemplateTermsWithParams />
  }
}

function EditTemplateTermsWithParams() {
  const { collectionId, templateId } = useParams<{
    collectionId: string
    templateId: string
  }>() as {
    collectionId: string
    templateId: string
  }

  return (
    <EditTemplateTerms
      collectionId={collectionId}
      templateId={Number(templateId)}
      templateRepository={templateRepository}
    />
  )
}

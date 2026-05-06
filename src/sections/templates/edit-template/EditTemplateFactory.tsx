import { ReactElement } from 'react'
import { useSearchParams, Navigate } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '@/metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { TemplateJSDataverseRepository } from '@/templates/infrastructure/repositories/TemplateJSDataverseRepository'
import { LicenseJSDataverseRepository } from '@/licenses/infrastructure/repositories/LicenseJSDataverseRepository'
import { QueryParamKey, Route, TemplateEditMode } from '@/sections/Route.enum'
import { EditTemplateMetadata } from '../edit-template-metadata/EditTemplateMetadata'
import { EditTemplateTerms } from '../edit-template-terms'

const collectionRepository = new CollectionJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const templateRepository = new TemplateJSDataverseRepository()
const licenseRepository = new LicenseJSDataverseRepository()

export class EditTemplateFactory {
  static create(): ReactElement {
    return <EditTemplateDispatcher />
  }
}

function EditTemplateDispatcher() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get(QueryParamKey.ID)
  const ownerId = searchParams.get(QueryParamKey.OWNER_ID)
  const editMode = searchParams.get(QueryParamKey.EDIT_MODE)

  if (!id || !ownerId || !editMode) {
    return <Navigate to={Route.HOME} replace />
  }

  const templateId = Number(id)

  if (editMode === TemplateEditMode.METADATA) {
    return (
      <EditTemplateMetadata
        collectionId={ownerId}
        templateId={templateId}
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    )
  }

  if (editMode === TemplateEditMode.LICENSE) {
    return (
      <EditTemplateTerms
        collectionId={ownerId}
        templateId={templateId}
        templateRepository={templateRepository}
        licenseRepository={licenseRepository}
      />
    )
  }

  return <Navigate to={Route.HOME} replace />
}

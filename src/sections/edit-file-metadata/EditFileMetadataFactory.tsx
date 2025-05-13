import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EditFileMetadata, EditFileMetadataReferrer } from './EditFileMetadata'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { QueryParamKey } from '@/sections/Route.enum'

const fileRepository = new FileJSDataverseRepository()

export class EditFileMetadataFactory {
  static create(): ReactElement {
    return <EditFileMetadataWithParams />
  }
}

function EditFileMetadataWithParams() {
  const [searchParams] = useSearchParams()
  const fileId = searchParams.get('id')
  const fileIdNumber = Number(fileId)
  const referrer = searchParams.get(QueryParamKey.REFERRER) as EditFileMetadataReferrer

  if (isNaN(fileIdNumber)) {
    throw new Error('Invalid file ID')
  }
  return (
    <EditFileMetadata fileId={fileIdNumber} fileRepository={fileRepository} referrer={referrer} />
  )
}

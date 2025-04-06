import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EditFileMetadata } from './EditFileMetadata'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'

const fileRepository = new FileJSDataverseRepository()

export class EditFileMetadataFactory {
  static create(): ReactElement {
    return <EditFileMetadataWithParams />
  }
}

function EditFileMetadataWithParams() {
  const [searchParams] = useSearchParams()
  const fileId = searchParams.get('fileId')
  const fileIdNumber = Number(fileId)

  console.log('fileId', fileId)
  if (isNaN(fileIdNumber)) {
    throw new Error('Invalid file ID')
  }
  return <EditFileMetadata fileId={fileIdNumber} fileRepository={fileRepository} />
}

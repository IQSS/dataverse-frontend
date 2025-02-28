import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { type ReferrerType, ReplaceFile } from './ReplaceFile'
import { QueryParamKey } from '../Route.enum'

const fileRepository = new FileJSDataverseRepository()

export class ReplaceFileFactory {
  static create(): ReactElement {
    return <ReplaceFileWithParams />
  }
}

function ReplaceFileWithParams() {
  const [searchParams] = useSearchParams()

  if (
    searchParams.get(QueryParamKey.FILE_ID) === null ||
    searchParams.get(QueryParamKey.PERSISTENT_ID) === null ||
    searchParams.get(QueryParamKey.REFERRER) === null
  ) {
    throw new Error('Missing required query parameters')
  }

  const fileId = Number(searchParams.get(QueryParamKey.FILE_ID) as string)
  const datasetId = searchParams.get(QueryParamKey.PERSISTENT_ID) as string
  const referrer = searchParams.get(QueryParamKey.REFERRER) as ReferrerType

  return (
    <ReplaceFile
      fileRepository={fileRepository}
      fileIdFromParams={fileId}
      datasetPidFromParams={datasetId}
      referrer={referrer}
    />
  )
}

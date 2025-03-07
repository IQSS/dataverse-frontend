import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { ReplaceFile } from './ReplaceFile'
import { QueryParamKey } from '../Route.enum'
import { searchParamVersionToDomainVersion } from '@/router'

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
    searchParams.get(QueryParamKey.DATASET_VERSION) === null
  ) {
    throw new Error('Missing required query parameters')
  }

  const fileId = Number(searchParams.get(QueryParamKey.FILE_ID) as string)
  const datasetId = searchParams.get(QueryParamKey.PERSISTENT_ID) as string
  const datasetVersionSearchParam = searchParams.get(QueryParamKey.DATASET_VERSION) as string
  const datasetVersionNumber = searchParamVersionToDomainVersion(
    datasetVersionSearchParam
  ) as string

  return (
    <ReplaceFile
      fileRepository={fileRepository}
      fileIdFromParams={fileId}
      datasetPidFromParams={datasetId}
      datasetVersionFromParams={datasetVersionNumber}
    />
  )
}

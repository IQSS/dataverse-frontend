import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { type ReferrerType, ReplaceFile } from './ReplaceFile'
import { QueryParamKey } from '../Route.enum'
import { searchParamVersionToDomainVersion } from '@/router'

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

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
    searchParams.get(QueryParamKey.REFERRER) === null ||
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
  const referrer = searchParams.get(QueryParamKey.REFERRER) as ReferrerType

  return (
    <ReplaceFile
      fileRepository={fileRepository}
      datasetRepository={datasetRepository}
      fileIdFromParams={fileId}
      datasetPidFromParams={datasetId}
      datasetVersionFromParams={datasetVersionNumber}
      referrer={referrer}
    />
  )
}

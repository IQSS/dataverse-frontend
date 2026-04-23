import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'
import { ReplaceFile, ReplaceFileReferrer } from './ReplaceFile'
import { QueryParamKey } from '../Route.enum'
import { searchParamVersionToDomainVersion } from '@/router'

const fileRepository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

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
    // TODO - show new Not Found Page here after is done.
    throw new Error('Missing required query parameters')
  }

  const fileId = Number(searchParams.get(QueryParamKey.FILE_ID) as string)
  const datasetId = searchParams.get(QueryParamKey.PERSISTENT_ID) as string
  const datasetVersionSearchParam = searchParams.get(QueryParamKey.DATASET_VERSION) as string
  const datasetVersionNumber = searchParamVersionToDomainVersion(
    datasetVersionSearchParam
  ) as string
  const referrer =
    (searchParams.get(QueryParamKey.REFERRER) as ReplaceFileReferrer | null) ?? undefined

  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <ReplaceFile
        fileRepository={fileRepository}
        fileIdFromParams={fileId}
        datasetPidFromParams={datasetId}
        datasetVersionFromParams={datasetVersionNumber}
        referrer={referrer}
      />
    </RepositoriesProvider>
  )
}

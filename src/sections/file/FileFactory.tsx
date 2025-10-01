import { ReactElement } from 'react'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { File } from './File'
import { useSearchParams } from 'react-router-dom'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { searchParamVersionToDomainVersion } from '../../router'
import { DataverseInfoJSDataverseRepository } from '@/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'

const repository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()

export class FileFactory {
  static create(): ReactElement {
    return <FileWithSearchParams />
  }
}

function FileWithSearchParams() {
  const [searchParams] = useSearchParams()
  const searchParamId = searchParams.get('id') ?? undefined
  const id = searchParamId ? parseInt(searchParamId) : undefined
  const datasetVersionSearchParam = searchParams.get('datasetVersion') ?? undefined
  const datasetVersionNumber = searchParamVersionToDomainVersion(datasetVersionSearchParam)

  if (!id) {
    return <NotFoundPage dvObjectNotFoundType="file" />
  }

  return (
    <File
      repository={repository}
      id={id}
      datasetVersionNumber={datasetVersionNumber}
      datasetRepository={datasetRepository}
      dataverseInfoRepository={dataverseInfoRepository}
    />
  )
}

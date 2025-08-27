import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { ExternalToolsJSDataverseRepository } from '@/externalTools/infrastructure/repositories/ExternalToolsJSDataverseRepository'
import { File } from './File'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { searchParamVersionToDomainVersion } from '../../router'
import { QueryParamKey } from '../Route.enum'

const repository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const externalToolsRepository = new ExternalToolsJSDataverseRepository()

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
  const toolTypeSelectedQueryParam: string | undefined =
    searchParams.get(QueryParamKey.TOOL_TYPE) ?? undefined

  if (!id) {
    return <NotFoundPage dvObjectNotFoundType="file" />
  }

  return (
    <File
      repository={repository}
      id={id}
      datasetVersionNumber={datasetVersionNumber}
      datasetRepository={datasetRepository}
      externalToolsRepository={externalToolsRepository}
      toolTypeSelectedQueryParam={toolTypeSelectedQueryParam}
    />
  )
}

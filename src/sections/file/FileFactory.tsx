import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { File } from './File'
import { NotFoundPage } from '../not-found-page/NotFoundPage'
import { searchParamVersionToDomainVersion } from '../../router'
import { QueryParamKey } from '../Route.enum'
import { DataverseInfoJSDataverseRepository } from '@/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'
import { AccessRepositoryProvider } from '../access/AccessRepositoryProvider'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { GuestbookRepositoryProvider } from '../guestbooks/GuestbookRepositoryProvider'

const repository = new FileJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
const contactRepository = new ContactJSDataverseRepository()
const accessRepository = new AccessJSDataverseRepository()
const guestbookRepository = new GuestbookJSDataverseRepository()

export class FileFactory {
  static create(): ReactElement {
    return (
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <AccessRepositoryProvider repository={accessRepository}>
          <FileWithSearchParams />
        </AccessRepositoryProvider>
      </GuestbookRepositoryProvider>
    )
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
      toolTypeSelectedQueryParam={toolTypeSelectedQueryParam}
      dataverseInfoRepository={dataverseInfoRepository}
      contactRepository={contactRepository}
    />
  )
}

import { ReactElement } from 'react'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { File } from './File'
import { useSearchParams } from 'react-router-dom'
import { PageNotFound } from '../page-not-found/PageNotFound'

const repository = new FileJSDataverseRepository()
export class FileFactory {
  static create(): ReactElement {
    return <FileWithSearchParams />
  }
}

function FileWithSearchParams() {
  const [searchParams] = useSearchParams()
  const searchParamId = searchParams.get('id') ?? undefined
  const id = searchParamId ? parseInt(searchParamId) : undefined

  if (!id) {
    return <PageNotFound />
  }

  return <File repository={repository} id={id} />
}

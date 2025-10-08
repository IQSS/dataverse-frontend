import { ReactElement } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { CollectionJSDataverseRepository } from '../../collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { Collection } from './Collection'
import { INFINITE_SCROLL_ENABLED } from './config'
import { useGetCollectionQueryParams } from './useGetCollectionQueryParams'
import { ACCOUNT_CREATED_SESSION_STORAGE_KEY } from './AccountCreatedAlert'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()
const contactRepository = new ContactJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class CollectionFactory {
  static create(): ReactElement {
    return <CollectionWithSearchParams />
  }
}

function CollectionWithSearchParams() {
  const collectionQueryParams = useGetCollectionQueryParams()
  const { collectionId } = useParams<{ collectionId: string }>()
  const location = useLocation()
  const state = location.state as
    | {
        created?: boolean
        accountCreated?: boolean
      }
    | undefined
  const created = state?.created ?? false
  const accountCreated =
    Boolean(sessionStorage.getItem(ACCOUNT_CREATED_SESSION_STORAGE_KEY)) ?? false

  return (
    <Collection
      collectionRepository={collectionRepository}
      collectionIdFromParams={collectionId}
      created={created}
      collectionQueryParams={collectionQueryParams}
      accountCreated={accountCreated}
      infiniteScrollEnabled={INFINITE_SCROLL_ENABLED}
      contactRepository={contactRepository}
      datasetRepository={datasetRepository}
    />
  )
}

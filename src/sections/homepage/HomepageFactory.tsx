import { ReactElement } from 'react'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { ApiDataverseHubRepository } from '@/dataverse-hub/infrastructure/repositories/ApiDataverseHubRepository'
import { SearchJSRepository } from '@/search/infrastructure/repositories/SearchJSRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'
import Homepage from './Homepage'

const collectionRepository = new CollectionJSDataverseRepository()
const dataverseHubRepository = new ApiDataverseHubRepository()
const searchRepository = new SearchJSRepository()

export class HomepageFactory {
  static create(): ReactElement {
    return (
      <RepositoriesProvider collectionRepository={collectionRepository}>
        <Homepage
          collectionRepository={collectionRepository}
          dataverseHubRepository={dataverseHubRepository}
          searchRepository={searchRepository}
        />
      </RepositoriesProvider>
    )
  }
}

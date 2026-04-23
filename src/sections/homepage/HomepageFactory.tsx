import { ReactElement } from 'react'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { ApiDataverseHubRepository } from '@/dataverse-hub/infrastructure/repositories/ApiDataverseHubRepository'
import { SearchJSRepository } from '@/search/infrastructure/repositories/SearchJSRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'
import Homepage from './Homepage'

const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const dataverseHubRepository = new ApiDataverseHubRepository()
const searchRepository = new SearchJSRepository()

export class HomepageFactory {
  static create(): ReactElement {
    return (
      <RepositoriesProvider
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}>
        <Homepage
          dataverseHubRepository={dataverseHubRepository}
          searchRepository={searchRepository}
        />
      </RepositoriesProvider>
    )
  }
}

import { ReactElement } from 'react'
import { ApiDataverseHubRepository } from '@/dataverse-hub/infrastructure/repositories/ApiDataverseHubRepository'
import { SearchJSRepository } from '@/search/infrastructure/repositories/SearchJSRepository'
import Homepage from './Homepage'

const dataverseHubRepository = new ApiDataverseHubRepository()
const searchRepository = new SearchJSRepository()

export class HomepageFactory {
  static create(): ReactElement {
    return (
      <Homepage
        dataverseHubRepository={dataverseHubRepository}
        searchRepository={searchRepository}
      />
    )
  }
}

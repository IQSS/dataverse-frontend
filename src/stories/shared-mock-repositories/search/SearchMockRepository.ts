import { SearchService } from '@/search/domain/models/SearchService'
import { SearchRepository } from '@/search/domain/repositories/SearchRepository'

export class SearchMockRepository implements SearchRepository {
  getServices(): Promise<SearchService[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            name: 'postExternalSearch',
            displayName: 'Natural Language Search'
          },
          {
            name: 'solr',
            displayName: 'Dataverse Standard Search'
          }
        ])
      }, 1_000)
    })
  }
}

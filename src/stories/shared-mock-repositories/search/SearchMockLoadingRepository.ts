import { SearchService } from '@/search/domain/models/SearchService'
import { SearchMockRepository } from './SearchMockRepository'

export class SearchMockLoadingRepository implements SearchMockRepository {
  getServices(): Promise<SearchService[]> {
    return new Promise(() => {})
  }
}

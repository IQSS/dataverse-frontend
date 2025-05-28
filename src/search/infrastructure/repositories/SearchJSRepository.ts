import { SearchService } from '@/search/domain/models/SearchService'
import { SearchRepository } from '@/search/domain/repositories/SearchRepository'
import { getSearchServices } from '@iqss/dataverse-client-javascript'

export class SearchJSRepository implements SearchRepository {
  getServices(): Promise<SearchService[]> {
    return getSearchServices.execute().then((searchServices) => searchServices)
  }
}

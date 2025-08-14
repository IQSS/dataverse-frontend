import { SearchService } from '../models/SearchService'

export interface SearchRepository {
  getServices: () => Promise<SearchService[]>
}

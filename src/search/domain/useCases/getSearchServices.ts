import { SearchService } from '../models/SearchService'
import { SearchRepository } from '../repositories/SearchRepository'

export async function getSearchServices(
  searchRepository: SearchRepository
): Promise<SearchService[]> {
  return searchRepository.getServices()
}

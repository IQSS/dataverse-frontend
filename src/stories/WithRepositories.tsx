import { StoryFn } from '@storybook/react'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'
import { CollectionLoadingMockRepository } from './collection/CollectionLoadingMockRepository'
import { SearchMockLoadingRepository } from './shared-mock-repositories/search/SearchMockLoadingRepository'

export const WithLoadingRepositories = (Story: StoryFn) => {
  return (
    <RepositoriesProvider
      collectionRepository={new CollectionLoadingMockRepository()}
      searchRepository={new SearchMockLoadingRepository()}
      contactRepository={{}}>
      <Story />
    </RepositoriesProvider>
  )
}

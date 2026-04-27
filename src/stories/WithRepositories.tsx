import { StoryFn } from '@storybook/react'
import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

interface WithRepositoriesProps {
  collectionRepository: CollectionRepository
}

export function WithRepositories({ collectionRepository }: WithRepositoriesProps) {
  function WithRepositoriesDecorator(Story: StoryFn) {
    return (
      <RepositoriesProvider collectionRepository={collectionRepository}>
        <Story />
      </RepositoriesProvider>
    )
  }

  WithRepositoriesDecorator.displayName = 'WithRepositoriesDecorator'

  return WithRepositoriesDecorator
}

interface RepositoriesStoryProviderProps extends WithRepositoriesProps {
  children: ReactNode
}

export function RepositoriesStoryProvider({
  children,
  collectionRepository
}: RepositoriesStoryProviderProps) {
  return (
    <RepositoriesProvider collectionRepository={collectionRepository}>
      {children}
    </RepositoriesProvider>
  )
}

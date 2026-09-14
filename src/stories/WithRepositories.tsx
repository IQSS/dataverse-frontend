import { StoryFn } from '@storybook/react'
import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { GuestbookRepository } from '@/guestbooks/domain/repositories/GuestbookRepository'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

function failFastRepository<T>(name: string): T {
  return new Proxy({} as object, {
    get(_target, prop) {
      if (typeof prop === 'symbol') return undefined
      return () => {
        throw new Error(
          `[${name}] method "${String(prop)}" was called but no repository was provided. ` +
            `Pass a ${name} explicitly to this story decorator.`
        )
      }
    }
  }) as T
}

interface WithRepositoriesProps {
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
  externalToolsRepository?: ExternalToolsRepository
  fileRepository?: FileRepository
  guestbookRepository?: GuestbookRepository
  userRepository?: UserRepository
}

export function WithRepositories({
  collectionRepository = failFastRepository<CollectionRepository>('CollectionRepository'),
  datasetRepository = failFastRepository<DatasetRepository>('DatasetRepository'),
  externalToolsRepository = failFastRepository<ExternalToolsRepository>('ExternalToolsRepository'),
  fileRepository = failFastRepository<FileRepository>('FileRepository'),
  guestbookRepository = failFastRepository<GuestbookRepository>('GuestbookRepository'),
  userRepository = failFastRepository<UserRepository>('UserRepository')
}: WithRepositoriesProps) {
  function WithRepositoriesDecorator(Story: StoryFn) {
    return (
      <RepositoriesProvider
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        externalToolsRepository={externalToolsRepository}
        fileRepository={fileRepository}
        guestbookRepository={guestbookRepository}
        userRepository={userRepository}>
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
  collectionRepository = failFastRepository<CollectionRepository>('CollectionRepository'),
  datasetRepository = failFastRepository<DatasetRepository>('DatasetRepository'),
  externalToolsRepository = failFastRepository<ExternalToolsRepository>('ExternalToolsRepository'),
  fileRepository = failFastRepository<FileRepository>('FileRepository'),
  guestbookRepository = failFastRepository<GuestbookRepository>('GuestbookRepository'),
  userRepository = failFastRepository<UserRepository>('UserRepository')
}: RepositoriesStoryProviderProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}
      externalToolsRepository={externalToolsRepository}
      fileRepository={fileRepository}
      guestbookRepository={guestbookRepository}
      userRepository={userRepository}>
      {children}
    </RepositoriesProvider>
  )
}

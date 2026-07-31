import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { ExternalToolsRepository } from '@/externalTools/domain/repositories/ExternalToolsRepository'
import { ExternalVocabularyRepository } from '@/external-vocabularies/domain/repositories/ExternalVocabularyRepository'
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
            `Pass a ${name} explicitly to <WithRepositories /> in this test.`
        )
      }
    }
  }) as T
}

const defaultExternalVocabularyRepository: ExternalVocabularyRepository = {
  getConfiguredExternalVocabularies: () => Promise.resolve([]),
  search: () => {
    throw new Error(
      '[ExternalVocabularyRepository] search was called but no repository was provided.'
    )
  },
  resolve: () => {
    throw new Error(
      '[ExternalVocabularyRepository] resolve was called but no repository was provided.'
    )
  },
  validate: () => {
    throw new Error(
      '[ExternalVocabularyRepository] validate was called but no repository was provided.'
    )
  }
}

interface WithRepositoriesProps {
  children: ReactNode
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
  externalVocabularyRepository?: ExternalVocabularyRepository
  externalToolsRepository?: ExternalToolsRepository
  fileRepository?: FileRepository
  guestbookRepository?: GuestbookRepository
  userRepository?: UserRepository
}

export function WithRepositories({
  children,
  collectionRepository = failFastRepository<CollectionRepository>('CollectionRepository'),
  datasetRepository = failFastRepository<DatasetRepository>('DatasetRepository'),
  externalVocabularyRepository = defaultExternalVocabularyRepository,
  externalToolsRepository = failFastRepository<ExternalToolsRepository>('ExternalToolsRepository'),
  fileRepository = failFastRepository<FileRepository>('FileRepository'),
  guestbookRepository = failFastRepository<GuestbookRepository>('GuestbookRepository'),
  userRepository = failFastRepository<UserRepository>('UserRepository')
}: WithRepositoriesProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}
      externalVocabularyRepository={externalVocabularyRepository}
      externalToolsRepository={externalToolsRepository}
      fileRepository={fileRepository}
      guestbookRepository={guestbookRepository}
      userRepository={userRepository}>
      {children}
    </RepositoriesProvider>
  )
}

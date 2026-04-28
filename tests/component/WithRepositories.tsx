import { ReactNode } from 'react'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
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

interface WithRepositoriesProps {
  children: ReactNode
  collectionRepository?: CollectionRepository
  datasetRepository?: DatasetRepository
}

export function WithRepositories({
  children,
  collectionRepository = failFastRepository<CollectionRepository>('CollectionRepository'),
  datasetRepository = failFastRepository<DatasetRepository>('DatasetRepository')
}: WithRepositoriesProps) {
  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      {children}
    </RepositoriesProvider>
  )
}

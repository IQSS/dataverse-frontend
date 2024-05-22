import { PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { DatasetContext } from './DatasetContext'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDatasetByPersistentId } from '../../dataset/domain/useCases/getDatasetByPersistentId'
import { getDatasetByPrivateUrlToken } from '../../dataset/domain/useCases/getDatasetByPrivateUrlToken'

interface DatasetProviderProps {
  repository: DatasetRepository
  searchParams: {
    persistentId?: string
    privateUrlToken?: string
    version?: string
  }
}
export function DatasetProvider({
  repository,
  searchParams,
  children
}: PropsWithChildren<DatasetProviderProps>) {
  const [dataset, setDataset] = useState<Dataset>()
  const [isLoading, setIsLoading] = useState(true)

  const getDataset = useCallback(() => {
    if (searchParams.persistentId) {
      return getDatasetByPersistentId(repository, searchParams.persistentId, searchParams.version)
    }
    if (searchParams.privateUrlToken) {
      return getDatasetByPrivateUrlToken(repository, searchParams.privateUrlToken)
    }
    return Promise.resolve(undefined)
  }, [repository, searchParams])

  useEffect(() => {
    setIsLoading(true)

    getDataset()
      .then((dataset: Dataset | undefined) => {
        setDataset(dataset)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('There was an error getting the dataset', error)
        setIsLoading(false)
      })
  }, [repository, searchParams, getDataset])

  return (
    <DatasetContext.Provider value={{ dataset, isLoading }}>{children}</DatasetContext.Provider>
  )
}

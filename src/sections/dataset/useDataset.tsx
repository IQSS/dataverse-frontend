import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDataset } from '../../dataset/domain/useCases/getDataset'
import { useLoading } from '../loading/LoadingContext'

export function useDataset(repository: DatasetRepository, id: string) {
  const [dataset, setDataset] = useState<Dataset>()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(true)
    getDataset(repository, id)
      .then((dataset: Dataset | undefined) => {
        setDataset(dataset)
        setIsLoading(false)
      })
      .catch((error) => console.error('There was an error getting the dataset', error))
  }, [repository, id])

  return { dataset }
}

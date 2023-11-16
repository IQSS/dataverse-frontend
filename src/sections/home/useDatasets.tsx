import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDatasets } from '../../dataset/domain/useCases/getDatasets'

export function useDatasets(datasetRepository: DatasetRepository) {
  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    setIsLoading(true)

    getDatasets(datasetRepository)
      .then((datasets: Dataset[]) => {
        setDatasets(datasets)
        return datasets
      })
      .catch(() => {
        console.error('There was an error getting the datasets')
        setIsLoading(false)
      })
  }, [datasetRepository])

  return {
    datasets,
    isLoading
  }
}

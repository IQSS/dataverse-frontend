import { useEffect, useState } from 'react'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset } from '../../dataset/domain/models/Dataset'
import { getDataset } from '../../dataset/domain/useCases/getDataset'
import { useLoading } from '../loading/LoadingContext'
import { useDatasetTemplate } from './dataset-template/DatasetTemplateContext'

export function useDataset(repository: DatasetRepository, id: string) {
  const { setTemplateId } = useDatasetTemplate()
  const [dataset, setDataset] = useState<Dataset>()
  const { setIsLoading } = useLoading()

  useEffect(() => {
    setIsLoading(true)
    getDataset(repository, id)
      .then((dataset: Dataset | undefined) => {
        setDataset(dataset)
        setTemplateId(dataset?.templateId)
        setIsLoading(false)
      })
      .catch((error) => console.error('There was an error getting the dataset', error))
  }, [repository, id])

  return { dataset }
}

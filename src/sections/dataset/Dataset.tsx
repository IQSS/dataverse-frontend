import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { useDataset } from './useDataset'

interface DatasetProps {
  datasetRepository: DatasetRepository
  id: string
}

export function Dataset({ datasetRepository, id }: DatasetProps) {
  const { dataset } = useDataset(datasetRepository, id)

  return dataset ? <div>{dataset.title}</div> : null
}

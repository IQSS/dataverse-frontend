import { useState } from 'react'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { UnlinkDatasetButton } from './unlink-dataset-button/UnlinkDatasetButton'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

interface LinkAndUnlinkActionsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
}

export const LinkAndUnlinkActions = ({ dataset, datasetRepository }: LinkAndUnlinkActionsProps) => {
  const [key, setKey] = useState(0)

  // This is a way to force remounting both components when either one of them successfully links or unlinks a dataset.
  // This way, the list of linked collections is refetched and updated in both components.
  const updateKey = () => setKey((prevKey) => prevKey + 1)

  return (
    <>
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        updateParent={updateKey}
        key={`link-dataset-button-${key}`}
      />
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        updateParent={updateKey}
        key={`unlink-dataset-button-${key}`}
      />
    </>
  )
}

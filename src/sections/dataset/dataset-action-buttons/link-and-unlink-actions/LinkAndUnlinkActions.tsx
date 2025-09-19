import { useState } from 'react'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { UnlinkDatasetButton } from './unlink-dataset-button/UnlinkDatasetButton'
import { Dataset } from '@/dataset/domain/models/Dataset'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'

interface LinkAndUnlinkActionsProps {
  dataset: Dataset
  datasetRepository: DatasetRepository
  collectionRepository: CollectionRepository
}

export const LinkAndUnlinkActions = ({
  dataset,
  datasetRepository,
  collectionRepository
}: LinkAndUnlinkActionsProps) => {
  const [key, setKey] = useState(0)

  // This is a way to force remounting both components when either one of them succeesfully links or unlinks a dataset.
  // This way, the list of linked collections is refetched and updated in both components.
  const updateKey = () => setKey((prevKey) => prevKey + 1)

  return (
    <>
      <LinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={updateKey}
        key={`link-dataset-button-${key}`}
      />
      <UnlinkDatasetButton
        dataset={dataset}
        datasetRepository={datasetRepository}
        collectionRepository={collectionRepository}
        updateParent={updateKey}
        key={`unlink-dataset-button-${key}`}
      />
    </>
  )
}

import { useState } from 'react'
import { LinkDatasetButton } from './link-dataset-button/LinkDatasetButton'
import { UnlinkDatasetButton } from './unlink-dataset-button/UnlinkDatasetButton'
import { Dataset } from '@/dataset/domain/models/Dataset'

interface LinkAndUnlinkActionsProps {
  dataset: Dataset
}

export const LinkAndUnlinkActions = ({ dataset }: LinkAndUnlinkActionsProps) => {
  const [key, setKey] = useState(0)

  // This is a way to force remounting both components when either one of them successfully links or unlinks a dataset.
  // This way, the list of linked collections is refetched and updated in both components.
  const updateKey = () => setKey((prevKey) => prevKey + 1)

  return (
    <>
      <LinkDatasetButton
        dataset={dataset}
        updateParent={updateKey}
        key={`link-dataset-button-${key}`}
      />
      <UnlinkDatasetButton
        dataset={dataset}
        updateParent={updateKey}
        key={`unlink-dataset-button-${key}`}
      />
    </>
  )
}

import { useTranslation } from 'react-i18next'
import { type DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type MetadataBlockInfoRepository } from '../../metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { SeparationLine } from '../shared/layout/SeparationLine/SeparationLine'
import { HostCollectionForm } from './HostCollectionForm/HostCollectionForm'
import { NotImplementedModal } from '../not-implemented/NotImplementedModal'
import { useNotImplementedModal } from '../not-implemented/NotImplementedModalContext'
import { DatasetMetadataForm } from '../shared/form/DatasetMetadataForm'

interface CreateDatasetProps {
  datasetRepository: DatasetRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
  collectionId?: string
}

export function CreateDataset({
  datasetRepository,
  metadataBlockInfoRepository,
  collectionId = 'root'
}: CreateDatasetProps) {
  const { t } = useTranslation('createDataset')
  const { isModalOpen, hideModal } = useNotImplementedModal()

  return (
    <>
      <NotImplementedModal show={isModalOpen} handleClose={hideModal} />
      <article>
        <header>
          <h1>{t('pageTitle')}</h1>
        </header>
        <SeparationLine />
        <HostCollectionForm collectionId={collectionId} />

        <DatasetMetadataForm
          mode="create"
          collectionId={collectionId}
          datasetRepository={datasetRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      </article>
    </>
  )
}

import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

interface EditCollectionGeneralInfoProps {
  collectionId: string
  collectionRepository: CollectionRepository
  metadataBlockInfoRepository: MetadataBlockInfoRepository
}

export const EditCollectionGeneralInfo = ({
  collectionId,
  collectionRepository,
  metadataBlockInfoRepository
}: EditCollectionGeneralInfoProps) => {
  return (
    <div>
      <p>Edit collection general info</p>
    </div>
  )
}
